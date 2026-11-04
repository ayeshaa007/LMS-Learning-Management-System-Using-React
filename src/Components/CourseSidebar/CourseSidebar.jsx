import React, { useContext } from 'react'
import './CourseSidebar.css'
import { CourseContext } from '../../Context/CourseContext';

const CourseSidebar = () => {
  const { sidebarFilter, handleFilterChange } = useContext(CourseContext);

  return (
    <div className='courseSidebar'>
      <h2>Filters</h2>

      {/* These values must match the category options in NewCourse.jsx exactly,
          since that's what actually gets stored on a course. */}
      <div className="category">
        <h3>Category</h3>
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.category.c1 === "Web Development"}
            onChange={() => handleFilterChange("category", "c1", "Web Development")}
          />
          Web Development
        </label>
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.category.c2 === "App Development"}
            onChange={() => handleFilterChange("category", "c2", "App Development")}
          />
          App Development
        </label>
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.category.c3 === "Graphic Designing"}
            onChange={() => handleFilterChange("category", "c3", "Graphic Designing")}
          />
          Graphic Designing
        </label>
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.category.c4 === "Database"}
            onChange={() => handleFilterChange("category", "c4", "Database")}
          />
          Database
        </label>
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.category.c5 === "Speaking Languages"}
            onChange={() => handleFilterChange("category", "c5", "Speaking Languages")}
          />
          Speaking Languages
        </label>
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.category.c6 === "Digital Marketing"}
            onChange={() => handleFilterChange("category", "c6", "Digital Marketing")}
          />
          Digital Marketing
        </label>
      </div>

      <div className="level">
        <h3>Level</h3>
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.level.l1 === "Beginner"}
            onChange={() => handleFilterChange("level", "l1", "Beginner")}
          />
          Beginner
        </label>
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.level.l2 === "Intermediate"}
            onChange={() => handleFilterChange("level", "l2", "Intermediate")}
          />
          Intermediate
        </label>
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.level.l3 === "Advanced"}
            onChange={() => handleFilterChange("level", "l3", "Advanced")}
          />
          Advanced
        </label>
      </div>

      <div className="price">
        <h3>Price</h3>
        {/* pricing.price is stored lowercase ("free"/"paid") on a course,
            per the Type select in NewCourse.jsx - filter values must match that. */}
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.price.p1 === "free"}
            onChange={() => handleFilterChange("price", "p1", "free")}
          />
          Free
        </label>
        <label>
          <input
            type="checkbox"
            checked={sidebarFilter.price.p2 === "paid"}
            onChange={() => handleFilterChange("price", "p2", "paid")}
          />
          Paid
        </label>
      </div>
    </div>
  )
}

export default CourseSidebar
