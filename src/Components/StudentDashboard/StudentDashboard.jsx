import React, { useContext, useState } from 'react'
import './StudentDashboard.css'
import { useNavigate } from 'react-router-dom';
import { CourseContext } from '../../Context/CourseContext';
import { StudentContext } from '../../Context/StudentContext';
import CoursesList from '../CoursesList/CoursesList';
import Navbar from '../Navbar/Navbar';

const StudentDashboard = () => {
  const { courses, setViewingCourseIndex, getCourseProgress } = useContext(CourseContext);
  const { currentUser } = useContext(StudentContext);
  const navigate = useNavigate();

  const [activeBar, setActiveBar] = useState(0);

  const myCourses = currentUser
    ? courses.filter((c) => c.enrolled.some((s) => s.email === currentUser.email))
    : [];

  const openInPlayer = (course) => {
    const realIndex = courses.indexOf(course);
    setViewingCourseIndex(realIndex);
    navigate("/courseplayer");
  };


  const completedCourses = myCourses.filter((c) => {
    const p = getCourseProgress(courses.indexOf(c));
    return p.total > 0 && p.percent === 100;
  });

  const renderProgress = (c) => {
    const p = getCourseProgress(courses.indexOf(c));
    return (
      <>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${p.percent}%` }}></div>
        </div>
        <p>{p.completed} of {p.total} completed ({p.percent}%)</p>
      </>
    );
  };

  return (
    <>
    <Navbar />
    <div className='studentDashboard'>
      <div className="left">
        <ul>
          <li className={activeBar == 0 ? "activeBar" : ""} onClick={() => { setActiveBar(0) }}>■ Dashboard</li>
          <li className={activeBar == 1 ? "activeBar" : ""} onClick={() => { setActiveBar(1) }}>■ My Courses</li>
          <li className={activeBar == 2 ? "activeBar" : ""} onClick={() => { setActiveBar(2) }}>■ Q&A</li>
          <li className={activeBar == 3 ? "activeBar" : ""} onClick={() => { setActiveBar(3) }}>■ Certificates</li>
          <li className={activeBar == 4 ? "activeBar" : ""} onClick={() => { setActiveBar(4) }}>■ Messages</li>
          <li className={activeBar == 5 ? "activeBar" : ""} onClick={() => { setActiveBar(5) }}>■ Courses</li>
        </ul>
      </div>

      <div className="right">

        {activeBar == 0 ? <>
          <h3>Welcome Back, {currentUser ? currentUser.name : "Student"}</h3>
          <label>Continue Learning</label>
          <div className="current">
            {myCourses.length === 0 ? (
              <p style={{ color: "#5B6472" }}>You're not enrolled in any courses yet.</p>
            ) : (
              myCourses.map((c, i) => (
                <div className="list" key={i} onClick={() => openInPlayer(c)} style={{ cursor: "pointer" }}>
                  <h4>{c.basics.title}</h4>
                  <p>by {c.author}</p>
                  {renderProgress(c)}
                </div>
              ))
            )}
          </div>
          <label>Upcoming live classes</label>
          <div className="liveclass">
            <p style={{ color: "#5B6472" }}>No live classes scheduled right now.</p>
          </div>
        </> : null}

        {activeBar == 1 ? <>
          <h3>My Courses</h3>
          <div className="current">
            {myCourses.length === 0 ? (
              <p style={{ color: "#5B6472" }}>You're not enrolled in any courses yet. Browse the course catalog to get started.</p>
            ) : (
              myCourses.map((c, i) => (
                <div className="list" key={i} onClick={() => openInPlayer(c)} style={{ cursor: "pointer" }}>
                  <h4>{c.basics.title}</h4>
                  <p>by {c.author} • {c.modules.length} modules • {c.basics.level}</p>
                  {renderProgress(c)}
                </div>
              ))
            )}
          </div>
        </> : null}

        {activeBar == 2 ? <>
          <h3>Q&A</h3>
          <div className="current">
            {myCourses.every((c) => !c.QAs || c.QAs.length === 0) ? (
              <p style={{ color: "#5B6472" }}>No questions yet.</p>
            ) : (
              myCourses.map((c, i) =>
                c.QAs && c.QAs.length > 0 ? (
                  <div className="list" key={i}>
                    <h4>{c.basics.title}</h4>
                    {c.QAs.map((qa, j) => (
                      <p key={j}>{qa.q}</p>
                    ))}
                  </div>
                ) : null
              )
            )}
          </div>
        </> : null}

        {activeBar == 3 ? <>
          <h3>Certificates</h3>
          {completedCourses.length === 0 ? (
            <p style={{ color: "#5B6472" }}>You'll receive a certificate here once you complete a course.</p>
          ) : (
            <div className="current">
              {completedCourses.map((c, i) => (
                <div className="list certificate" key={i}>
                  <h4>Certificate of completion</h4>
                  <p>Awarded to {currentUser ? currentUser.name : "Student"}</p>
                  <p>for completing <b>{c.basics.title}</b></p>
                  <p>Instructor: {c.author}</p>
                </div>
              ))}
            </div>
          )}
        </> : null}

        {activeBar == 4 ? <>
          <h3>Messages</h3>
          <p style={{ color: "#5B6472" }}>No messages yet.</p>
        </> : null}

        {activeBar == 5 ? <CoursesList /> : null}

      </div>
    </div>
    </>
  )
}

export default StudentDashboard
