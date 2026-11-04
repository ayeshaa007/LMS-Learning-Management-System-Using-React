import React, { useContext } from 'react'
import './About.css'
import { Link } from 'react-router-dom'
import { CourseContext } from '../../Context/CourseContext';
import { InstructorContext } from '../../Context/InstructorContext';
import { StudentContext } from '../../Context/StudentContext';
import Navbar from '../../Components/Navbar/Navbar';


const About = () => {
  const { courses } = useContext(CourseContext);
  const { students } = useContext(StudentContext);
  const { instructors } = useContext(InstructorContext);

  const stats = [
    { id: 1, v: courses.length, l: "Courses" },
    { id: 2, v: instructors.length, l: "Instructors" },
    { id: 3, v: students.length, l: "Students" },
  ];

  const values = [
    {
      id: 1,
      h: "Learn at your pace",
      p: "Every course stays available to you for good, so you can learn on your own schedule.",
    },
    {
      id: 2,
      h: "Taught by real instructors",
      p: "Courses are built and published by instructors on the platform, not a faceless catalog.",
    },
    {
      id: 3,
      h: "Simple, honest pricing",
      p: "Each course is clearly listed as free or paid, with no hidden fees at checkout.",
    },
  ];

  return (
    <div className='about'>
   <Navbar/>
      <div className="hero">
        <h1>About Us</h1>
        <p>We're building a simple, focused place to teach and learn - one course at a time.</p>
      </div>

      <div className="mission">
        <h3>Our mission</h3>
        <p>
          We started this platform to make it easy for instructors to share what they know, and
          for students to find courses that actually fit what they're trying to learn - without
          the clutter. Whether you're picking up a new skill or teaching one, we want to keep
          that process simple.
        </p>
      </div>

      <div className="statRow">
        {stats.map((item) => (
          <div className="statItem" key={item.id}>
            <span>{item.v}</span>
            <p>{item.l}</p>
          </div>
        ))}
      </div>

      <div className="values">
        <h3>Why learn with us</h3>
        <div className="valueRow">
          {values.map((item) => (
            <div className="valueItem" key={item.id}>
              <h4>{item.h}</h4>
              <p>{item.p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta">
        <h3>Ready to get started?</h3>
        <p>Browse our courses or create an account to start teaching or learning today.</p>
        <div className="ctaBtns">
          <Link to="/courses"><button className="primary">Explore courses</button></Link>
          <Link to="/signup"><button className="secondary">Sign up</button></Link>
        </div>
      </div>
    </div>
  )
}

export default About
