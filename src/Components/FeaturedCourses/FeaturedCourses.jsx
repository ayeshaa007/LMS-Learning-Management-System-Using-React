import React, { useContext } from 'react'
import './FeaturedCourses.css'
import { Link } from 'react-router-dom'
import { CourseContext } from '../../Context/CourseContext'

// The names must match the category options in NewCourse.jsx and the
// checkboxes in CourseSidebar.jsx exactly.
const categories = [
    { id: 1, icon: "\uD83D\uDCBB", name: "Web Development" },
    { id: 2, icon: "\uD83D\uDCF1", name: "App Development" },
    { id: 3, icon: "\uD83C\uDFA8", name: "Graphic Designing" },
    { id: 4, icon: "\uD83D\uDDC4\uFE0F", name: "Database" },
    { id: 5, icon: "\uD83D\uDDE3\uFE0F", name: "Speaking Languages" },
    { id: 6, icon: "\uD83D\uDCC8", name: "Digital Marketing" },
]

const FeaturedCourses = () => {
  const { courses, selectCategoryFilter } = useContext(CourseContext);

  const countFor = (name) => courses.filter((c) => c.basics.category === name).length;

  return (
    <div className='featured'>
<h2>Browse by category</h2>
<div className="feature_list">
    {categories.map((item)=>{
      const count = countFor(item.name);
      return (
  <Link
    to="/courses"
    className="list_item"
    key={item.id}
    onClick={() => selectCategoryFilter(item.name)}
  >
    <span className="icon" aria-hidden="true">{item.icon}</span>
    <div className="data">
        <h3>{item.name}</h3>
        <p>{count} {count === 1 ? "course" : "courses"}</p>
    </div>
  </Link>
      );
    })}
</div>
    </div>
  )
}

export default FeaturedCourses