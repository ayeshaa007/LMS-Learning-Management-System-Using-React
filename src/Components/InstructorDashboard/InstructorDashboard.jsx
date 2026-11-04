import React, { useContext, useState } from 'react'
import './InstructorDashboard.css'
import NewCourse from '../NewCourse/NewCourse';
import { CourseContext } from '../../Context/CourseContext';
import { InstructorContext } from '../../Context/InstructorContext';
import Navbar from '../Navbar/Navbar';

const InstructorDashboard = () => {
  const { courses } = useContext(CourseContext);
  const { currentUser } = useContext(InstructorContext);

  const [activeBar, setActiveBar] = useState(0);

  const clickAdd = () => {
    setActiveBar(4);
  }

  const myCourses = currentUser
    ? courses.filter((c) => c.author === currentUser.name)
    : [];

  const totalStudents = myCourses.reduce(
    (sum, c) => sum + (c.enrolled ? c.enrolled.length : 0),
    0
  );

  const totalRevenue = myCourses.reduce((sum, c) => {
    const isPaid = c.pricing && c.pricing.price === "paid";
    const price = isPaid ? parseFloat(c.pricing.dollars) || 0 : 0;
    const enrolledCount = c.enrolled ? c.enrolled.length : 0;
    return sum + price * enrolledCount;
  }, 0);

  const overviewStats = [
    { id: 1, h: "Total students", v: totalStudents },
    { id: 2, h: "Courses published", v: myCourses.length },
    { id: 3, h: "Estimated revenue", v: `$${totalRevenue.toFixed(2)}` },
  ];

  return (
    <>
    <Navbar />
    <div className='instructorDashboard'>
      <div className="left">
        <ul>
          <li className={activeBar == 0 ? "activeBar" : ""} onClick={() => { setActiveBar(0) }}>■ Overview</li>
          <li className={activeBar == 1 || activeBar == 4 ? "activeBar" : ""} onClick={() => { setActiveBar(1) }}>■ My courses</li>
          <li className={activeBar == 2 ? "activeBar" : ""} onClick={() => { setActiveBar(2) }}>■ Students</li>
          <li className={activeBar == 3 ? "activeBar" : ""} onClick={() => { setActiveBar(3) }}>■ Earnings </li>
        </ul>
      </div>


      <div className="right">

        {activeBar == 0 ? <>
          <div className="instrHead">
            <h3>Instructor overview</h3>
            <button onClick={clickAdd}>+ New course</button>
          </div>
          <div className="instRow">
            {overviewStats.map((item) => (
              <div className="item" key={item.id}>
                <p>{item.h}</p>
                <span>{item.v}</span>
              </div>
            ))}
          </div>

          <div className="instCourses">
            <h3>My Courses</h3>
            {myCourses.length === 0 ? (
              <p style={{ color: "#5B6472" }}>You haven't published any courses yet.</p>
            ) : (
              myCourses.map((c, i) => (
                <div className="item" key={i}>
                  <h4>{c.basics.title}</h4>
                  <p>{c.enrolled.length} students</p>
                </div>
              ))
            )}
          </div>
        </> : null}

        {activeBar == 1 ? <>
          <div className="instrHead">
            <h3>My courses</h3>
            <button onClick={clickAdd}>+ New course</button>
          </div>
          <div className="instCourses">
            {myCourses.length === 0 ? (
              <p style={{ color: "#5B6472" }}>You haven't published any courses yet. Click "+ New course" to get started.</p>
            ) : (
              myCourses.map((c, i) => (
                <div className="item" key={i}>
                  <h4>{c.basics.title}</h4>
                  <p>{c.basics.category} • {c.basics.level} • {c.modules.length} modules</p>
                  <p>{c.enrolled.length} students • {c.pricing.price === "paid" ? `$${c.pricing.dollars}` : "Free"}</p>
                </div>
              ))
            )}
          </div>
        </> : null}

        {activeBar == 2 ? <>
          <h3>Students</h3>
          <div className="instCourses">
            {totalStudents === 0 ? (
              <p style={{ color: "#5B6472" }}>No students enrolled in your courses yet.</p>
            ) : (
              myCourses.map((c, i) =>
                c.enrolled.length > 0 ? (
                  <div className="item" key={i}>
                    <h4>{c.basics.title}</h4>
                    {c.enrolled.map((s, j) => (
                      <p key={j}>{s.name} • {s.email}</p>
                    ))}
                  </div>
                ) : null
              )
            )}
          </div>
        </> : null}

        {activeBar == 3 ? <>
          <h3>Earnings</h3>
          <div className="instRow">
            <div className="item">
              <p>Estimated revenue</p>
              <span>${totalRevenue.toFixed(2)}</span>
            </div>
            <div className="item">
              <p>Enrolled students</p>
              <span>{totalStudents}</span>
            </div>
          </div>
          <div className="instCourses">
            {myCourses.length === 0 ? (
              <p style={{ color: "#5B6472" }}>Publish a course to start earning.</p>
            ) : (
              myCourses.map((c, i) => {
                const isPaid = c.pricing && c.pricing.price === "paid";
                const dollars = parseFloat(c.pricing.dollars) || 0;
                const earned = isPaid ? dollars * c.enrolled.length : 0;
                return (
                  <div className="item" key={i}>
                    <h4>{c.basics.title}</h4>
                    <p>{isPaid ? `$${dollars} × ${c.enrolled.length} students = $${earned.toFixed(2)}` : "Free course"}</p>
                  </div>
                );
              })
            )}
          </div>
        </> : null}

        {activeBar == 4 ? <NewCourse/> : null}

      </div>

    </div>
    </>
  )
}

export default InstructorDashboard
