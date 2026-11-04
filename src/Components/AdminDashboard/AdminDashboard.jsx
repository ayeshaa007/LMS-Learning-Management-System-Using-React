import React, { useContext, useState } from 'react'
import './AdminDashboard.css'
import { CourseContext } from '../../Context/CourseContext'
import { StudentContext } from '../../Context/StudentContext'
import { InstructorContext } from '../../Context/InstructorContext'
import Navbar from '../Navbar/Navbar'

const AdminDashboard = () => {
  const { courses, deleteCourse } = useContext(CourseContext);
  const { students, removeStudent } = useContext(StudentContext);
  const { instructors, removeInstructor } = useContext(InstructorContext);

  const [activeBar, setActiveBar] = useState(0);

  const totalEnrollments = courses.reduce(
    (sum, c) => sum + (c.enrolled ? c.enrolled.length : 0),
    0
  );

  return (
    <>
    <Navbar />
    <div className='adminDashboard'>
      <div className="left">
        <ul>
          <li className={activeBar === 0 ? "activeBar" : ""} onClick={() => setActiveBar(0)}>■ Overview</li>
          <li className={activeBar === 1 ? "activeBar" : ""} onClick={() => setActiveBar(1)}>■ Courses</li>
          <li className={activeBar === 2 ? "activeBar" : ""} onClick={() => setActiveBar(2)}>■ Instructors</li>
          <li className={activeBar === 3 ? "activeBar" : ""} onClick={() => setActiveBar(3)}>■ Students</li>
        </ul>
      </div>

      <div className="right">
        {activeBar === 0 ? (
          <>
            <h3>Admin overview</h3>
            <div className="statRow">
              <div className="item">
                <p>Total courses</p>
                <span>{courses.length}</span>
              </div>
              <div className="item">
                <p>Total instructors</p>
                <span>{instructors.length}</span>
              </div>
              <div className="item">
                <p>Total students</p>
                <span>{students.length}</span>
              </div>
              <div className="item">
                <p>Total enrollments</p>
                <span>{totalEnrollments}</span>
              </div>
            </div>
          </>
        ) : null}

        {activeBar === 1 ? (
          <>
            <h3>All courses</h3>
            {courses.length === 0 ? (
              <p className='empty'>No courses have been created yet.</p>
            ) : (
              <div className="manageList">
                {courses.map((c, i) => (
                  <div className="manageItem" key={i}>
                    <div>
                      <h4>{c.basics.title || "Untitled course"}</h4>
                      <p>by {c.author || "Unknown"} • {c.modules.length} modules • {c.enrolled.length} students</p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${c.basics.title}"? This cannot be undone.`)) {
                          deleteCourse(i);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}

        {activeBar === 2 ? (
          <>
            <h3>Instructors</h3>
            {instructors.length === 0 ? (
              <p className='empty'>No instructors have signed up yet.</p>
            ) : (
              <div className="manageList">
                {instructors.map((inst, i) => (
                  <div className="manageItem" key={i}>
                    <div>
                      <h4>{inst.name}</h4>
                      <p>{inst.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove instructor ${inst.name}?`)) {
                          removeInstructor(inst.email);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}

        {activeBar === 3 ? (
          <>
            <h3>Students</h3>
            {students.length === 0 ? (
              <p className='empty'>No students have signed up yet.</p>
            ) : (
              <div className="manageList">
                {students.map((stu, i) => (
                  <div className="manageItem" key={i}>
                    <div>
                      <h4>{stu.name}</h4>
                      <p>{stu.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove student ${stu.name}?`)) {
                          removeStudent(stu.email);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
    </>
  )
}

export default AdminDashboard
