# Eduvia — Learning Management System

Eduvia is a front-end Learning Management System (LMS) built with **React** and **Vite**. It has three roles — **students**, **instructors** and **admins** — and covers the full flow from publishing a course to completing it.

There is no backend. All data (accounts, courses, progress, notes, comments) is saved in the browser's **localStorage**, so the project runs with nothing but Node.js.

---

## Features

### Public pages
- **Home** — hero section, stats bar and a **Browse by category** section. Clicking a category opens the Courses page with that category already ticked in the filter sidebar.
- **Courses** — course catalog with search, sorting, and sidebar filters (category, level, price).
- **Course detail** — overview, curriculum, reviews and Q&A tabs. Enrolled students see **Go to course** instead of **Enroll now**.
- **About** and **Q&A** pages.
- Fully **responsive**: phone, tablet and desktop, with a hamburger menu on small screens.

### Students
- Sign up / log in, and stay logged in after a refresh.
- Enroll in free or paid courses (demo checkout, no real payment).
- **Course player**:
  - Embedded **YouTube** video for each lesson.
  - Quizzes and assignments.
  - Previous / Next navigation, and the course resumes at your first unfinished item.
  - Working **Notes**, **Resources** and **Discussion** tabs for each lesson.
  - Progress bar, module roadmap and a "course completed" message.
- Dashboard with progress on every course and a **Certificates** tab for finished courses.

### Instructors
- Create courses in four steps: **Basics → Curriculum → Pricing → Publish**.
- Add a thumbnail (compressed automatically so it doesn't fill browser storage).
- Build modules containing lessons, quizzes and assignments.
- For every lesson, paste a **YouTube link** with a live preview. Only the link is stored, never the video file. An optional resource link can also be added.
- Dashboard listing their courses and students.

### Admins
- Overview statistics.
- Manage (remove) students, instructors and courses.

### Access control
`/student`, `/instructor`, `/admin`, `/newCourse`, `/checkout` and `/courseplayer` redirect to the login page if you are not signed in with the right role.

---

## Getting started

**Requirements:** Node.js 20.19 or newer, and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Then open the address shown in the terminal (usually `http://localhost:5173`).

### Other scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Checks the code with Oxlint |

---

## Default admin account

An admin account is created automatically the first time the app runs:

| Email | Password |
| --- | --- |
| `admin@lms.com` | `admin123` |

Students and instructors create their own accounts on the **Sign up** page.

---

## Try it out

1. **Sign up as an instructor** and open **+ New course**.
2. Fill in the basics (title, category, level, overview, thumbnail, date).
3. In **Curriculum**, add a module, then add a lesson and paste a YouTube link such as `https://www.youtube.com/watch?v=dQw4w9WgXcQ`. Add a quiz or assignment if you like, then **Save Module**.
4. Set the price in **Pricing**, then publish from **Publish**.
5. **Log out**, then **sign up as a student**.
6. Go to **Courses**, open the course, click **Enroll now**, and start learning.

**Supported video links:** `youtube.com/watch?v=…`, `youtu.be/…`, `youtube.com/embed/…`, `youtube.com/shorts/…` and `youtube.com/live/…`. A start time such as `?t=1m30s` is respected. Some videos have embedding turned off by their owner; the player shows a "Watch it on YouTube" link for those.

---

## Project structure

```
src/
├── App.jsx                  Routes and context providers
├── main.jsx                 App entry point
├── index.css                Global styles
├── assets/                  Images and logo
├── utils/
│   ├── youtube.js           YouTube link parsing and embed URLs
│   └── courseHelpers.js     Shared course helper functions
├── Context/                 State management (React Context)
│   ├── CourseProvider.jsx   Courses, filters, progress, notes, comments
│   ├── StudentProvider.jsx  Student accounts and session
│   ├── InstructorProvider.jsx
│   ├── AdminProvider.jsx
│   └── UserProvider.jsx     Login/signup tab selection
├── Pages/                   Home, Courses, About, Q&A
└── Components/
    ├── Navbar, HeroSection, Linebar, FeaturedCourses (categories),
    │   BlueBar, Footer
    ├── CourseSidebar, CoursesList, CourseDetail
    ├── Login, Signup, RequireAuth
    ├── Checkout, CoursePlayer
    └── StudentDashboard, InstructorDashboard, AdminDashboard, NewCourse
```

Each component keeps its own `.jsx` and `.css` file side by side.

---

## How data is stored

Everything is stored in the browser's localStorage under these keys:

| Key | Contents |
| --- | --- |
| `Students`, `Instructors`, `Admins` | Registered accounts |
| `CurrentStudent`, `CurrentInstructor`, `CurrentAdmin` | Email of the logged-in user (keeps you signed in after refresh) |
| `Courses` | All courses, including modules, lesson video links and enrolled students |
| `CourseProgress` | Completed lessons, quizzes and assignments per student and course |
| `LessonNotes`, `Discussions` | Student notes and lesson comments |
| `ViewingCourseIndex` | The course currently open |

To reset the app completely, clear the site's data in your browser (DevTools → Application → Local Storage → Clear).

---

## Tech stack

- [React](https://react.dev) 19
- [React Router](https://reactrouter.com) 7
- [Vite](https://vite.dev) for development and builds
- [Oxlint](https://oxc.rs) for linting
- Plain CSS with media queries (no UI framework)

---

## Limitations

This project is a front-end demo, so keep these in mind:

- **No backend or real security.** Passwords are saved as plain text in localStorage, and access control only exists in the browser. Do not use real passwords or personal data.
- **Data stays on one device and browser.** Browsers allow roughly 5 MB of localStorage, which is why videos are linked rather than uploaded and thumbnails are compressed.
- **Checkout is a simulation.** No payment is processed.
- Course progress, notes and comments are stored by the course's position in the list; the app keeps them in sync when a course is deleted.
