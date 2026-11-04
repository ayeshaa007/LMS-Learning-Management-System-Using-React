import React, { useContext, useEffect, useState } from "react";
import { CourseContext } from "./CourseContext";
import { InstructorContext } from "./InstructorContext";
import { StudentContext } from "./StudentContext";
import { getYouTubeId, isHttpUrl } from "../utils/youtube";
import { getCourseItemKeys } from "../utils/courseHelpers";

// localStorage can throw (private mode, quota full, corrupted JSON) - these
// wrappers make sure that never crashes the whole app.
const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch {
    return fallback;
  }
};

const readObject = (key) => {
  const value = readJSON(key, {});
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Could not save "${key}" to localStorage:`, error);
    return false;
  }
};

// Shrinks a picked image before it is stored as a data URL, so thumbnails
// don't eat up the (roughly 5MB) localStorage limit.
const compressImage = (file, maxWidth = 800, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("This file is not a valid image."));
      img.onload = () => {
        if (!img.width || !img.height) {
          reject(new Error("This image has no readable size."));
          return;
        }
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        // White background so transparent PNGs don't turn black as JPEG.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

// After a course is deleted, shift per-course storage keys (which embed the
// course index) so progress/notes/comments stay attached to the right course.
const remapAfterDelete = (map, deleted, pos) => {
  const out = {};
  Object.keys(map).forEach((key) => {
    const parts = key.split("::");
    const idx = Number(parts[pos]);
    if (Number.isNaN(idx)) {
      out[key] = map[key];
      return;
    }
    if (idx === deleted) return;
    if (idx > deleted) parts[pos] = String(idx - 1);
    out[parts.join("::")] = map[key];
  });
  return out;
};

const getDefaultLesson = () => ({
  heading: "",
  duration: "",
  videoUrl: "",
  resourceUrl: "",
});

const getDefaultQuiz = () => ({
  q: "",
  a: "",
  options: "",
});

const getDefaultModule = () => ({
  heading: "",
  duration: "",

  lessons: [],
  lesson: getDefaultLesson(),

  quizes: [],
  quiz: getDefaultQuiz(),

  assignments: [],
  assignment: "",
});

const isBlank = (value) => !value || !value.toString().trim();

const validateLesson = (lesson) => {
  if (isBlank(lesson.heading)) return "Lesson title is required.";
  if (isBlank(lesson.duration)) return "Lesson duration is required.";
  if (isBlank(lesson.videoUrl)) return "Lesson video link is required. Paste a YouTube link.";
  if (!getYouTubeId(lesson.videoUrl)) {
    return "Please enter a valid YouTube video link, e.g. https://www.youtube.com/watch?v=...";
  }
  if (!isBlank(lesson.resourceUrl) && !isHttpUrl(lesson.resourceUrl)) {
    return "The resource link must be a full web address starting with http:// or https://";
  }
  return null;
};

const validateQuiz = (quiz) => {
  if (isBlank(quiz.q)) return "Quiz question is required.";
  if (isBlank(quiz.a)) return "Quiz answer is required.";
  if (isBlank(quiz.options)) return "Quiz options are required.";
  const options = quiz.options.split(",").map((o) => o.trim()).filter(Boolean);
  if (options.length < 2) return "Please provide at least two quiz options, separated by commas.";
  const answer = quiz.a.trim().toLowerCase();
  if (!options.some((o) => o.toLowerCase() === answer)) {
    return "The quiz answer must match one of the options exactly.";
  }
  return null;
};

const validateAssignment = (assignment) => {
  if (isBlank(assignment)) return "Assignment details are required.";
  return null;
};

const validateModule = (module) => {
  if (isBlank(module.heading)) return "Module title is required.";
  if (isBlank(module.duration)) return "Module duration is required.";
  if (module.lessons.length === 0) return "Add at least one lesson before saving the module.";
  if (module.quizes.length === 0) return "Add at least one quiz before saving the module.";
  if (module.assignments.length === 0) return "Add at least one assignment before saving the module.";
  return null;
};

const validateBasics = (basics) => {
  if (isBlank(basics.title)) return "Course title is required.";
  if (isBlank(basics.category)) return "Please select a category.";
  if (isBlank(basics.level)) return "Please select a level.";
  if (isBlank(basics.overview)) return "Course description is required.";
  if (isBlank(basics.thumbnail)) return "Course thumbnail is required.";
  if (isBlank(basics.date)) return "Starting date is required.";
  return null;
};

const validatePricing = (pricing) => {
  if (isBlank(pricing.price)) return "Please select a pricing type.";
  if (pricing.price === "paid" && isBlank(pricing.dollars)) return "Please enter a price for a paid course.";
  return null;
};

const validateCourse = (course) => {
  return (
    validateBasics(course.basics) ||
    validatePricing(course.pricing) ||
    (course.modules.length === 0 ? "Add at least one module before saving the course." : null)
  );
};

const getDefaultCourse = () => ({
  basics: {
    title: "",
    category: "",
    level: "",
    overview: "",
    thumbnail: "",
    date: "",
  },

  modules: [],
  module: getDefaultModule(),

  ratings: "",
  students: 0,
  enrolled: [],
  author: "",

  reviews: [],
  QAs: [],
  QA: {
    q: "",
    a: [],
  },

  pricing: {
    dollars: "",
    price: "free",
  },

  content: {
    name: "",
    video: "",
  },

  time: "",
  projects: "",
});

const CourseProvider = ({ children }) => {
  const { currentUser: currentInstructor } = useContext(InstructorContext);
  const { currentUser: currentStudent } = useContext(StudentContext);
  const [sidebarFilter, setSidebarFilter] = useState({
    category: { c1: "", c2: "", c3: "", c4: "", c5: "", c6: "" },
    level: { l1: "", l2: "", l3: "" },
    price: { p1: "", p2: "" },
    search: "",
  });
  

  

  const handleImageChange = async (event) => {
    const input = event.target;
    const file = input.files && input.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file for the thumbnail.");
      input.value = "";
      return;
    }

    // Using a base64 data URL (not URL.createObjectURL) because courses are
    // persisted to localStorage - an object URL only works for the current
    // page session and would show a broken image after a refresh. The image
    // is compressed first so it stays small enough to store.
    try {
      const thumbnail = await compressImage(file);
      setCourse((prev) => ({
        ...prev,
        basics: {
          ...prev.basics,
          thumbnail,
        },
      }));
    } catch (error) {
      alert(error.message || "Could not use this image. Please try another one.");
      input.value = "";
    }
  };

  const [course, setCourse] = useState(getDefaultCourse());

  const [courses, setCourses] = useState(() => {
    const saved = readJSON("Courses", []);
    return Array.isArray(saved) ? saved : [];
  });
const [filteredCourses, setFilteredCourses] = useState(courses);

  // The selected course is remembered so a refresh on the player / checkout
  // page doesn't throw the student back to "No course selected".
  const [viewingCourseIndex, setViewingCourseIndex] = useState(() => {
    const saved = readJSON("ViewingCourseIndex", null);
    return Number.isInteger(saved) && saved >= 0 && saved < courses.length ? saved : null;
  });

  // Per-student progress through a course's lessons/quizzes/assignments.
  // Keyed by "<studentEmail>::<courseIndex>" -> array of item keys (e.g.
  // "lesson-0-1"), so it survives content edits better than a raw index
  // would. Persisted separately from `courses` since it's per-student data.
  const [courseProgress, setCourseProgress] = useState(() => readObject("CourseProgress"));

  // Per-student notes (key: "<email>::<courseIndex>::<itemKey>") and
  // per-lesson discussion comments (key: "<courseIndex>::<itemKey>").
  const [lessonNotes, setLessonNotes] = useState(() => readObject("LessonNotes"));
  const [discussions, setDiscussions] = useState(() => readObject("Discussions"));

  useEffect(() => {
    if (!writeJSON("Courses", courses)) {
      alert("Your browser storage is full, so the latest changes could not be saved.");
    }
  }, [courses]);

  useEffect(() => {
    writeJSON("CourseProgress", courseProgress);
  }, [courseProgress]);

  useEffect(() => {
    writeJSON("LessonNotes", lessonNotes);
  }, [lessonNotes]);

  useEffect(() => {
    writeJSON("Discussions", discussions);
  }, [discussions]);

  useEffect(() => {
    writeJSON("ViewingCourseIndex", viewingCourseIndex);
  }, [viewingCourseIndex]);

  const progressKey = (courseIndex) =>
    `${currentStudent ? currentStudent.email : "guest"}::${courseIndex}`;

  const markItemComplete = (courseIndex, itemKey) => {
    if (!currentStudent) return;
    const key = progressKey(courseIndex);
    setCourseProgress((prev) => {
      const existing = prev[key] || [];
      if (existing.includes(itemKey)) return prev;
      return { ...prev, [key]: [...existing, itemKey] };
    });
  };

  const getCompletedItems = (courseIndex) => {
    if (!currentStudent) return [];
    return courseProgress[progressKey(courseIndex)] || [];
  };

  // Completed / total / percent for the logged-in student in one course.
  const getCourseProgress = (courseIndex) => {
    const keys = getCourseItemKeys(courses[courseIndex]);
    const completed = getCompletedItems(courseIndex).filter((k) => keys.includes(k)).length;
    return {
      completed,
      total: keys.length,
      percent: keys.length > 0 ? Math.round((completed / keys.length) * 100) : 0,
    };
  };

  const noteKey = (courseIndex, itemKey) =>
    `${currentStudent ? currentStudent.email : "guest"}::${courseIndex}::${itemKey}`;

  const getNote = (courseIndex, itemKey) => lessonNotes[noteKey(courseIndex, itemKey)] || "";

  const saveNote = (courseIndex, itemKey, text) => {
    if (!currentStudent) return;
    const key = noteKey(courseIndex, itemKey);
    setLessonNotes((prev) => {
      const next = { ...prev };
      if (text) next[key] = text;
      else delete next[key];
      return next;
    });
  };

  const getComments = (courseIndex, itemKey) =>
    discussions[`${courseIndex}::${itemKey}`] || [];

  const addComment = (courseIndex, itemKey, text) => {
    if (!currentStudent) return false;
    const clean = (text || "").trim();
    if (!clean) {
      alert("Please write something before posting.");
      return false;
    }
    const key = `${courseIndex}::${itemKey}`;
    const comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: currentStudent.name,
      email: currentStudent.email,
      text: clean,
      time: new Date().toISOString(),
    };
    setDiscussions((prev) => ({ ...prev, [key]: [...(prev[key] || []), comment] }));
    return true;
  };

  const handleBasicsChange = (e) => {
    const { name, value } = e.target;

    setCourse((prev) => ({
      ...prev,
      basics: {
        ...prev.basics,
        [name]: value,
      },
    }));
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;

    setCourse((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [name]: value,
      },
    }));
  };

  const handleModuleChange = (e) => {
    const { name, value } = e.target;

    setCourse((prev) => ({
      ...prev,
      module: {
        ...prev.module,
        [name]: value,
      },
    }));
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;

    setCourse((prev) => ({
      ...prev,
      module: {
        ...prev.module,
        lesson: {
          ...prev.module.lesson,
          [name]: value,
        },
      },
    }));
  };

  const handleQuizChange = (e) => {
    const { name, value } = e.target;

    setCourse((prev) => ({
      ...prev,
      module: {
        ...prev.module,
        quiz: {
          ...prev.module.quiz,
          [name]: value,
        },
      },
    }));
  };

  const handleAssignmentChange = (e) => {
    const { value } = e.target;

    setCourse((prev) => ({
      ...prev,
      module: {
        ...prev.module,
        assignment: value,
      },
    }));
  };

  const addLesson = () => {
    const error = validateLesson(course.module.lesson);
    if (error) {
      alert(error);
      return false;
    }

    setCourse((prev) => ({
      ...prev,
      module: {
        ...prev.module,
        lessons: [
          ...prev.module.lessons,
          {
            ...prev.module.lesson,
            videoUrl: prev.module.lesson.videoUrl.trim(),
            resourceUrl: (prev.module.lesson.resourceUrl || "").trim(),
          },
        ],
        lesson: getDefaultLesson(),
      },
    }));
    return true;
  };

  const addQuiz = () => {
    const error = validateQuiz(course.module.quiz);
    if (error) {
      alert(error);
      return false;
    }

    setCourse((prev) => ({
      ...prev,
      module: {
        ...prev.module,
        quizes: [...prev.module.quizes, prev.module.quiz],
        quiz: getDefaultQuiz(),
      },
    }));
    return true;
  };

  const addAssignment = () => {
    const error = validateAssignment(course.module.assignment);
    if (error) {
      alert(error);
      return false;
    }

    setCourse((prev) => ({
      ...prev,
      module: {
        ...prev.module,
        assignments: [...prev.module.assignments, prev.module.assignment],
        assignment: "",
      },
    }));
    return true;
  };

  const addModule = () => {
    const error = validateModule(course.module);
    if (error) {
      alert(error);
      return false;
    }

    setCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, prev.module],
      module: getDefaultModule(),
    }));
    return true;
  };

  const handleSave = () => {
    if (!currentInstructor) {
      alert("You must be logged in as an instructor to publish a course.");
      return false;
    }

    const courseToSave = {
      ...course,
      author: currentInstructor.name,
    };

    const error = validateCourse(courseToSave);
    if (error) {
      alert(error);
      return false;
    }

    setCourses((prev) => [...prev, courseToSave]);
    setCourse(getDefaultCourse());
    alert("Course saved successfully!");
    return true;
  };

  const enrollStudent = (courseIndex) => {
    if (!currentStudent) {
      alert("You must be logged in as a student to enroll.");
      return false;
    }

    const target = courses[courseIndex];
    if (!target) {
      alert("Course not found.");
      return false;
    }

    const alreadyEnrolled = target.enrolled.some(
      (s) => s.email === currentStudent.email
    );
    if (alreadyEnrolled) {
      alert("You're already enrolled in this course.");
      return false;
    }

    setCourses((prev) =>
      prev.map((c, i) =>
        i === courseIndex
          ? {
              ...c,
              enrolled: [...c.enrolled, currentStudent],
              students: c.enrolled.length + 1,
            }
          : c
      )
    );
    return true;
  };

  const deleteCourse = (courseIndex) => {
    setCourses((prev) => prev.filter((_, i) => i !== courseIndex));
    setCourseProgress((prev) => remapAfterDelete(prev, courseIndex, 1));
    setLessonNotes((prev) => remapAfterDelete(prev, courseIndex, 1));
    setDiscussions((prev) => remapAfterDelete(prev, courseIndex, 0));
    setViewingCourseIndex((prev) => {
      if (prev === null) return null;
      if (prev === courseIndex) return null;
      return prev > courseIndex ? prev - 1 : prev;
    });
  };


const handleSearchChange = (e) => {
  const { value } = e.target;

  setSidebarFilter((prev) => ({
    ...prev,
    search: value,
  }));
};

// Used by the category cards on the home page: opens the course list with
// exactly this one category ticked (and no leftover level/price/search filters).
const CATEGORY_FILTER_KEYS = {
  "Web Development": "c1",
  "App Development": "c2",
  "Graphic Designing": "c3",
  "Database": "c4",
  "Speaking Languages": "c5",
  "Digital Marketing": "c6",
};

const selectCategoryFilter = (categoryName) => {
  const key = CATEGORY_FILTER_KEYS[categoryName];
  if (!key) return;
  setSidebarFilter({
    category: { c1: "", c2: "", c3: "", c4: "", c5: "", c6: "", [key]: categoryName },
    level: { l1: "", l2: "", l3: "" },
    price: { p1: "", p2: "" },
    search: "",
  });
};

const handleFilterChange = (type, key, value) => {
  setSidebarFilter((prev) => ({
    ...prev,
    [type]: {
      ...prev[type],
      [key]: prev[type][key] === value ? "" : value,
    },
  }));
};

const filterCourses = () => {

  let filtered = [...courses];

  // Search
  if (sidebarFilter.search.trim() !== "") {
    filtered = filtered.filter((course) =>
      course.basics.title
        .toLowerCase()
        .includes(sidebarFilter.search.toLowerCase())
    );
  }

  // Category
  const selectedCategories = Object.values(sidebarFilter.category).filter(Boolean);

  if (selectedCategories.length > 0) {
    filtered = filtered.filter((course) =>
      selectedCategories.includes(course.basics.category)
    );
  }

  // Level
  const selectedLevels = Object.values(sidebarFilter.level).filter(Boolean);

  if (selectedLevels.length > 0) {
    filtered = filtered.filter((course) =>
      selectedLevels.includes(course.basics.level)
    );
  }

  // Price
  const selectedPrices = Object.values(sidebarFilter.price).filter(Boolean);

  if (selectedPrices.length > 0) {
    filtered = filtered.filter((course) =>
      selectedPrices.includes(course.pricing.price)
    );
  }

  setFilteredCourses(filtered);
};
useEffect(() => {
  filterCourses();
}, [courses, sidebarFilter]);

  return (
    <CourseContext.Provider
      value={{
        course,
        courses,
        handleBasicsChange,
        handlePricingChange,
        handleModuleChange,
        handleLessonChange,
        handleQuizChange,
        handleAssignmentChange,
        handleImageChange,
        addModule,
        addLesson,
        addQuiz,
        addAssignment,
        handleSave,
        enrollStudent,
        deleteCourse,
        viewingCourseIndex,
        setViewingCourseIndex,
        markItemComplete,
        getCompletedItems,
        getCourseProgress,
        getNote,
        saveNote,
        getComments,
        addComment,
        sidebarFilter,
        selectCategoryFilter,
filteredCourses,
handleSearchChange,
handleFilterChange,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export default CourseProvider;
