import React, { useContext } from 'react'
import './CoursesList.css'
import { Link } from 'react-router-dom'
import { CourseContext } from '../../Context/CourseContext';

const CoursesList = () => {
  const {
    courses,
    filteredCourses,
    sidebarFilter,
    handleSearchChange,
    setViewingCourseIndex,
  } = useContext(CourseContext);

  return (
    <div className='coursesList'>
      <div className="head">
        <input
          type="text"
          placeholder='Search courses... '
          value={sidebarFilter.search}
          onChange={handleSearchChange}
        />
        <div className="sort">
          <label>Sort:
            <select>
              <option value="">Popular</option>
              <option value="">Latest</option>
            </select>
          </label>
        </div>
      </div>

      <div className="courses_list">
        {courses.length === 0 ? (
          <p style={{ color: "#5B6472" }}>No courses available yet.</p>
        ) : filteredCourses.length === 0 ? (
          <p style={{ color: "#5B6472" }}>No courses match your filters.</p>
        ) : (
          filteredCourses.map((item, index) => {
            const realIndex = courses.indexOf(item);
            return (
              <div className="course" key={realIndex}>
                <Link to="/courses/coursename" onClick={() => setViewingCourseIndex(realIndex)}>
                  <img src={item.basics.thumbnail} alt={item.basics.title} />
                  <div className="data">
                    <h3>{item.basics.title}</h3>
                    <p>by {item.author}</p>
                    <span>{item.pricing.price === "paid" ? `$${item.pricing.dollars}` : "Free"}</span>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  )
}

export default CoursesList
