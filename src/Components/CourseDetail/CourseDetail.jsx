import React, { useContext, useState } from 'react'
import './CourseDetail.css'
import { Link } from 'react-router-dom'
import { CourseContext } from '../../Context/CourseContext'
import { StudentContext } from '../../Context/StudentContext'
import Navbar from '../Navbar/Navbar'

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "curriculum", label: "Curriculum" },
  { id: "reviews", label: "Reviews" },
  { id: "qa", label: "Q&A" },
];

const CourseDetail = () => {
  const { courses, viewingCourseIndex } = useContext(CourseContext);
  const { currentUser } = useContext(StudentContext);
  const [activeTab, setActiveTab] = useState("overview");
  const course = viewingCourseIndex !== null ? courses[viewingCourseIndex] : null;

  if (!course) {
    return (
      <>
        <Navbar />
        <div className='courseDetail'>
          <p>No course selected. Please go back to the course catalog and pick a course.</p>
        </div>
      </>
    );
  }

  const isEnrolled =
    !!currentUser && (course.enrolled || []).some((s) => s.email === currentUser.email);

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <>
    <Navbar />
    <div className='courseDetail'>
      <div className="left">
        <p>Home/Courses/{course.basics.title}</p>
        <h3>{course.basics.title}</h3>
        <div className="row">
          <p>{course.enrolled.length} students</p>
          <p>by {course.author}</p>
        </div>
        <img src={course.basics.thumbnail} alt={course.basics.title} />
        <ul className="row">
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

        {activeTab === "overview" ? (
          <p className='last'>{course.basics.overview}</p>
        ) : null}

        {activeTab === "curriculum" ? (
          <div className="last curriculum">
            {course.modules.map((m, mi) => (
              <div className="cModule" key={mi}>
                <div className="cHead">
                  <h4>{m.heading}</h4>
                  <span>{m.duration}</span>
                </div>
                <p>{m.lessons.length} lessons &bull; {m.quizes.length} quizzes &bull; {m.assignments.length} assignments</p>
                {m.lessons.map((l, li) => (
                  <div className="cLesson" key={li}>
                    <span>&#9654; {l.heading}</span>
                    <span>{l.duration}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === "reviews" ? (
          <p className='last'>
            {course.reviews && course.reviews.length > 0
              ? `${course.reviews.length} review(s)`
              : "No reviews yet."}
          </p>
        ) : null}

        {activeTab === "qa" ? (
          <div className='last'>
            {course.QAs && course.QAs.length > 0
              ? course.QAs.map((qa, i) => <p key={i}>{qa.q}</p>)
              : <p>No questions yet.</p>}
          </div>
        ) : null}
      </div>
      <div className="right">
        <h3>{course.pricing.price === "paid" ? `$ ${course.pricing.dollars}` : "Free"}</h3>
        {isEnrolled ? (
          <Link to="/courseplayer"><button>Go to course</button></Link>
        ) : (
          <Link to="/checkout"><button>Enroll now</button></Link>
        )}
        <p>This course includes: </p>
        <p>✓ {course.modules.length} modules </p>
        <p>✓ {totalLessons} lessons </p>
        <p>✓ Lifetime access</p>
      </div>
    </div>
    </>
  )
}

export default CourseDetail
