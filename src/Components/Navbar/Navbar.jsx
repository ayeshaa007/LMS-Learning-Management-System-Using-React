import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css'
import logo from '../../assets/logo.png'
import { StudentContext } from '../../Context/StudentContext';
import { InstructorContext } from '../../Context/InstructorContext';
import { AdminContext } from '../../Context/AdminContext';

const Navbar = () => {
  const { currentUser: student, logout: logoutStudent } = useContext(StudentContext);
  const { currentUser: instructor, logout: logoutInstructor } = useContext(InstructorContext);
  const { currentUser: admin, logout: logoutAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  // Mobile menu open/closed (the menu is always visible on wide screens).
  const [open, setOpen] = useState(false);

  const dashboardPath = student ? "/student" : instructor ? "/instructor" : admin ? "/admin" : null;

  const handleLogout = () => {
    logoutStudent();
    logoutInstructor();
    logoutAdmin();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className='navbar'>
       <nav>
        <span>
            <img src={logo} alt="Eduvia logo" />
            <span>Eduvia</span>
        </span>
        <button
          type="button"
          className="menuToggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "\u2715" : "\u2630"}
        </button>
        <div className={open ? "navMenu open" : "navMenu"} onClick={() => setOpen(false)}>
        <ul>
        <NavLink to="/"><li>Home</li></NavLink> 
          <NavLink to="/courses">  <li>Courses</li></NavLink> 
          <NavLink to="/QandA">  <li>Q&A</li></NavLink> 
          <NavLink to="/about">  <li>About</li></NavLink> 
        </ul>
        <div className="btns">
{dashboardPath ? (
  <>
    <button className='loginBtn' onClick={handleLogout}>Log out</button>
    <Link to={dashboardPath}><button className='signupBtn'>Dashboard</button></Link>
  </>
) : (
  <>
    <Link to="/login"><button className='loginBtn'>Log in</button></Link>
    <Link to="/signup"> <button className='signupBtn'>Sign up</button></Link>
  </>
)}
        </div>
        </div>
        </nav> 
    </div>
  )
}

export default Navbar;
