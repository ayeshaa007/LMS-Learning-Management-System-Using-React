import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import './CoursePlayer.css'
import Navbar from '../Navbar/Navbar'
import { CourseContext } from '../../Context/CourseContext'
import { StudentContext } from '../../Context/StudentContext'
import {
  getYouTubeId,
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
  isHttpUrl,
} from '../../utils/youtube'

const normalize = (s) => (s || "").toString().trim().toLowerCase();

const TABS = [
  { id: "notes", label: "Notes" },
  { id: "resources", label: "Resources" },
  { id: "discussion", label: "Discussion" },
];

const CoursePlayer = () => {
  const {
    courses,
    viewingCourseIndex,
    markItemComplete,
    getCompletedItems,
    getNote,
    saveNote,
    getComments,
    addComment,
  } = useContext(CourseContext);
  const { currentUser } = useContext(StudentContext);

  const course = viewingCourseIndex !== null ? courses[viewingCourseIndex] : null;

  // Each item gets a stable key based on its position in the course
  // structure (module index + type + index within that type) - this is
  // what's actually persisted as "completed", not the flat running index
  // below (that's only used to track which item is on screen right now).
  const allItems = course
    ? course.modules.flatMap((m, mi) => [
        ...m.lessons.map((l, li) => ({ type: "lesson", moduleHeading: m.heading, key: `lesson-${mi}-${li}`, ...l })),
        ...m.quizes.map((q, qi) => ({ type: "quiz", moduleHeading: m.heading, key: `quiz-${mi}-${qi}`, ...q })),
        ...m.assignments.map((a, ai) => ({ type: "assignment", moduleHeading: m.heading, key: `assignment-${mi}-${ai}`, text: a })),
      ])
    : [];

  // Start on the first item the student hasn't finished yet, so coming back
  // to a course picks up where they left off.
  const [activeItem, setActiveItem] = useState(() => {
    if (viewingCourseIndex === null) return 0;
    const done = getCompletedItems(viewingCourseIndex);
    const firstIncomplete = allItems.findIndex((it) => !done.includes(it.key));
    return firstIncomplete === -1 ? 0 : firstIncomplete;
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [commentText, setCommentText] = useState("");

  if (!course) {
    return (
      <>
        <Navbar />
        <div className='coursePlayer'>
          <div className="playerMessage">
            <p>No course selected. Please go back to the course catalog and pick a course.</p>
            <Link to="/courses"><button>Browse courses</button></Link>
          </div>
        </div>
      </>
    );
  }

  const isEnrolled =
    !!currentUser && (course.enrolled || []).some((s) => s.email === currentUser.email);

  if (!isEnrolled) {
    return (
      <>
        <Navbar />
        <div className='coursePlayer'>
          <div className="playerMessage">
            <p>You need to enroll in "{course.basics.title}" before you can start learning.</p>
            <Link to="/courses/coursename"><button>View course</button></Link>
          </div>
        </div>
      </>
    );
  }

  if (allItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className='coursePlayer'>
          <div className="playerMessage">
            <p>This course doesn't have any content yet.</p>
            <Link to="/student"><button>Back to my courses</button></Link>
          </div>
        </div>
      </>
    );
  }

  const currentIndex = Math.min(activeItem, allItems.length - 1);
  const item = allItems[currentIndex];

  // Only keep completed keys that still match something in the current
  // course structure, in case modules/items were edited or removed since.
  const rawCompletedKeys = getCompletedItems(viewingCourseIndex);
  const completedKeys = rawCompletedKeys.filter((k) => allItems.some((it) => it.key === k));
  const isComplete = (key) => completedKeys.includes(key);

  const selectItem = (i) => {
    setActiveItem(i);
    setShowAnswer(false);
    setSelectedOption(null);
    setActiveTab("notes");
    setCommentText("");
    // On phones the content list sits below the video, so jump back up.
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quizOptions = item.type === "quiz"
    ? item.options.split(',').map((o) => o.trim()).filter(Boolean)
    : [];
  const isCorrect = item.type === "quiz" && selectedOption !== null
    ? normalize(selectedOption) === normalize(item.a)
    : false;

  const checkAnswer = () => {
    if (!selectedOption) {
      alert("Please select an option first.");
      return;
    }
    setShowAnswer(true);
    // A quiz counts as done once it's answered correctly. (If the stored
    // answer doesn't match any option, the quiz could never be passed, so
    // any attempt counts instead of leaving the student stuck.)
    const answerIsAnOption = quizOptions.some((o) => normalize(o) === normalize(item.a));
    if (normalize(selectedOption) === normalize(item.a) || !answerIsAnOption) {
      markItemComplete(viewingCourseIndex, item.key);
    }
  };

  const retryQuiz = () => {
    setShowAnswer(false);
    setSelectedOption(null);
  };

  const postComment = () => {
    if (addComment(viewingCourseIndex, item.key, commentText)) setCommentText("");
  };

  const totalItems = allItems.length;
  const completedCount = completedKeys.length;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const videoId = item.type === "lesson" ? getYouTubeId(item.videoUrl) : null;

  const navButtons = (
    <div className="navBtns">
      <button
        className="secondaryBtn"
        disabled={currentIndex === 0}
        onClick={() => selectItem(currentIndex - 1)}
      >
        &larr; Previous
      </button>
      <button
        disabled={currentIndex === totalItems - 1}
        onClick={() => selectItem(currentIndex + 1)}
      >
        Next &rarr;
      </button>
    </div>
  );

  let runningIndex = -1;

  return (
    <>
    <Navbar />
    <div className='coursePlayer'>
      <div className="left">
        <Link to="/student" className="backLink">&larr; Back to my courses</Link>
        <p className="courseTitle">{course.basics.title}</p>

        {progressPercent === 100 ? (
          <div className="courseComplete">
            Great job! You've completed this course. You can find it under Certificates in your dashboard.
          </div>
        ) : null}

        {item.type === "lesson" ? (
          <>
            {videoId ? (
              <>
                <div className="videoWrap">
                  <iframe
                    key={item.key}
                    src={getYouTubeEmbedUrl(item.videoUrl)}
                    title={`Lesson video: ${item.heading}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <p className="videoFallback">
                  Video not playing?{" "}
                  <a href={getYouTubeWatchUrl(videoId)} target="_blank" rel="noopener noreferrer">Watch it on YouTube</a>
                </p>
              </>
            ) : (
              <div className="videoWrap noVideo">
                <p>No video has been added for this lesson yet.</p>
              </div>
            )}
            <h3>{item.heading}</h3>
            <p className="lessonMeta">{item.moduleHeading} &bull; {item.duration}</p>

            <ul className="row tabs">
              {TABS.map((t) => (
                <li
                  key={t.id}
                  className={activeTab === t.id ? "active" : ""}
                  tabIndex={0}
                  onClick={() => setActiveTab(t.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveTab(t.id); } }}
                >
                  {t.label}
                </li>
              ))}
            </ul>

            <div className="tabPanel">
              {activeTab === "notes" ? (
                <>
                  <textarea
                    className="notesBox"
                    placeholder="Write your notes for this lesson..."
                    value={getNote(viewingCourseIndex, item.key)}
                    onChange={(e) => saveNote(viewingCourseIndex, item.key, e.target.value)}
                  />
                  <p className="hint">Your notes are saved automatically on this device.</p>
                </>
              ) : null}

              {activeTab === "resources" ? (
                <div className="resourceList">
                  {videoId ? (
                    <a href={getYouTubeWatchUrl(videoId)} target="_blank" rel="noopener noreferrer">&#9654; Watch this lesson on YouTube</a>
                  ) : null}
                  {isHttpUrl(item.resourceUrl) ? (
                    <a href={item.resourceUrl.trim()} target="_blank" rel="noopener noreferrer">&#128206; Lesson resource</a>
                  ) : null}
                  {!videoId && !isHttpUrl(item.resourceUrl) ? (
                    <p>No additional resources for this lesson.</p>
                  ) : null}
                </div>
              ) : null}

              {activeTab === "discussion" ? (
                <div className="discussion">
                  {getComments(viewingCourseIndex, item.key).length === 0 ? (
                    <p>No comments yet. Start the discussion!</p>
                  ) : (
                    getComments(viewingCourseIndex, item.key).map((c, ci) => (
                      <div className="comment" key={c.id || ci}>
                        <div className="commentHead">
                          <strong>{c.name}</strong>
                          <span>{new Date(c.time).toLocaleString()}</span>
                        </div>
                        <p>{c.text}</p>
                      </div>
                    ))
                  )}
                  <textarea
                    className="notesBox"
                    placeholder="Ask a question or share a thought..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button onClick={postComment}>Post comment</button>
                </div>
              ) : null}
            </div>

            <div className="actions">
              {isComplete(item.key) ? (
                <p className="completedBadge">&#10003; Completed</p>
              ) : (
                <button className="showAnswerBtn" onClick={() => markItemComplete(viewingCourseIndex, item.key)}>Mark as complete</button>
              )}
              {navButtons}
            </div>
          </>
        ) : null}

        {item.type === "quiz" ? (
          <>
            <h3>{item.q}</h3>
            <p className='last'>{item.moduleHeading} &bull; Quiz</p>
            <ul className="quizOptions">
              {quizOptions.map((opt, i) => (
                <li key={i}>
                  <label>
                    <input
                      type="radio"
                      name={`quiz-${currentIndex}`}
                      value={opt}
                      checked={selectedOption === opt}
                      disabled={showAnswer}
                      onChange={() => setSelectedOption(opt)}
                    />
                    {opt}
                  </label>
                </li>
              ))}
            </ul>

            {!showAnswer ? (
              <button className="showAnswerBtn" onClick={checkAnswer}>Check answer</button>
            ) : (
              <>
                <p className={`quizResult ${isCorrect ? "correct" : "incorrect"}`}>
                  {isCorrect ? "\u2713 Correct!" : "\u2717 Incorrect."} Correct answer: {item.a}
                </p>
                <button className="showAnswerBtn" onClick={retryQuiz}>Try again</button>
              </>
            )}

            <div className="actions">
              {isComplete(item.key) ? <p className="completedBadge">&#10003; Completed</p> : null}
              {navButtons}
            </div>
          </>
        ) : null}

        {item.type === "assignment" ? (
          <>
            <h3>Assignment</h3>
            <p className='last'>{item.moduleHeading}</p>
            <p className='last'>{item.text}</p>
            <div className="actions">
              {isComplete(item.key) ? (
                <p className="completedBadge">&#10003; Completed</p>
              ) : (
                <button className="showAnswerBtn" onClick={() => markItemComplete(viewingCourseIndex, item.key)}>Mark assignment as completed</button>
              )}
              {navButtons}
            </div>
          </>
        ) : null}
      </div>

      <div className="right">
        <div className="learningPath">
          <h4>Learning path</h4>
          <div className="progressTrack">
            <div className="progressFill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="progressLabel">{completedCount} of {totalItems} completed ({progressPercent}%)</p>
        </div>

        <div className="roadmap">
          <h4>Roadmap</h4>
          <div className="roadmapTrack">
            {course.modules.map((m, mi) => {
              const moduleItemKeys = [
                ...m.lessons.map((_, li) => `lesson-${mi}-${li}`),
                ...m.quizes.map((_, qi) => `quiz-${mi}-${qi}`),
                ...m.assignments.map((_, ai) => `assignment-${mi}-${ai}`),
              ];
              const moduleCompleted = moduleItemKeys.filter((k) => isComplete(k)).length;
              const moduleTotal = moduleItemKeys.length;
              const isDone = moduleTotal > 0 && moduleCompleted === moduleTotal;
              const isStarted = moduleCompleted > 0;

              const firstIncomplete = allItems.findIndex(
                (it) => moduleItemKeys.includes(it.key) && !isComplete(it.key)
              );
              const jumpToIndex = firstIncomplete !== -1
                ? firstIncomplete
                : allItems.findIndex((it) => moduleItemKeys.includes(it.key));

              return (
                <div
                  key={mi}
                  className={`roadmapStep ${isDone ? "done" : isStarted ? "inprogress" : ""}`}
                  onClick={() => jumpToIndex !== -1 && selectItem(jumpToIndex)}
                >
                  <div className="roadmapNode">{isDone ? "\u2713" : mi + 1}</div>
                  <div className="roadmapInfo">
                    <p className="roadmapTitle">{m.heading}</p>
                    <p className="roadmapMeta">{moduleCompleted}/{moduleTotal} completed</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <h4>Course content</h4>
        {course.modules.map((m, mi) => (
          <div className="moduleGroup" key={mi}>
            <p className="moduleGroupHeading">{m.heading}</p>
            <ul>
              {m.lessons.map((l, li) => {
                runningIndex++;
                const i = runningIndex;
                const key = `lesson-${mi}-${li}`;
                return (
                  <li
                    key={key}
                    className={i === currentIndex ? 'play' : ''}
                    onClick={() => selectItem(i)}
                    style={{ cursor: "pointer" }}
                  >
                    {isComplete(key) ? '\u2713 ' : ''}{i === currentIndex ? '\u25B6 ' : ''}{l.heading}
                  </li>
                );
              })}
              {m.quizes.map((q, qi) => {
                runningIndex++;
                const i = runningIndex;
                const key = `quiz-${mi}-${qi}`;
                return (
                  <li
                    key={key}
                    className={i === currentIndex ? 'play' : ''}
                    onClick={() => selectItem(i)}
                    style={{ cursor: "pointer" }}
                  >
                    {isComplete(key) ? '\u2713 ' : ''}{i === currentIndex ? '\u25B6 ' : ''}[Quiz] {q.q}
                  </li>
                );
              })}
              {m.assignments.map((a, ai) => {
                runningIndex++;
                const i = runningIndex;
                const key = `assignment-${mi}-${ai}`;
                return (
                  <li
                    key={key}
                    className={i === currentIndex ? 'play' : ''}
                    onClick={() => selectItem(i)}
                    style={{ cursor: "pointer" }}
                  >
                    {isComplete(key) ? '\u2713 ' : ''}{i === currentIndex ? '\u25B6 ' : ''}[Assignment] {a.length > 30 ? `${a.slice(0, 30)}...` : a}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default CoursePlayer
