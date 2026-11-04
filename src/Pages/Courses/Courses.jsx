import React from 'react'
import CourseSidebar from '../../Components/CourseSidebar/CourseSidebar'
import './Courses.css'
import Navbar from '../../Components/Navbar/Navbar'
import CoursesList from '../../Components/CoursesList/CoursesList'
import Footer from '../../Components/Footer/Footer'

const Courses = () => {
  return (
    <div className='courses'>
      <Navbar/>
      <div className="listing">
      <CourseSidebar/>
      <CoursesList/>
      </div>
      <Footer/>
    </div>
  )
}

export default Courses