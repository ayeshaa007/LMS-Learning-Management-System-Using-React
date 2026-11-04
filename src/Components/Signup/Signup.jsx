import React, { useContext } from 'react'
import './Signup.css'
import signup from '../../assets/signup.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'
import { StudentContext } from '../../Context/StudentContext'
import { InstructorContext } from '../../Context/InstructorContext'

const Signup = () => {
  const { clickSignup, setChoice, choice } = useContext(UserContext);
  const navigate = useNavigate();

  // Same fix as Login.jsx: bind to whichever context matches the active
  // tab, instead of always reading/writing StudentContext regardless of
  // choice - otherwise instructor signup silently fills the student's
  // form fields and handleInstSignup sees empty ones.
  const { user: studentUser, handleChange: handleStudentChange } = useContext(StudentContext);
  const { user: instructorUser, handleChange: handleInstructorChange } = useContext(InstructorContext);

  const user = choice === "stud" ? studentUser : instructorUser;
  const handleChange = choice === "stud" ? handleStudentChange : handleInstructorChange;

  let child1, child2;
  if (choice === "stud") {
    child1 = "active"
    child2 = "inactive"
  }
  else {
    child1 = "inactive"
    child2 = "active"
  }

  // clickSignup returns the route to send this user to on success (or
  // null on failure) - Signup.jsx navigates there itself, since it's the
  // one actually rendered inside the Router.
  const handleSignupClick = () => {
    const redirectTo = clickSignup();
    if (redirectTo) navigate(redirectTo);
  };

  return (
    <div className='signup'>

      <div className="left">
        <h3>Create your account</h3>
        {choice === "stud" ? <p>Start learning in minutes.</p> : <p>Start teaching in minutes</p>}
        <div className="btns">
          <span className={child1} onClick={() => setChoice("stud")}>Student</span>
          <span className={child2} onClick={() => setChoice("instr")}>Instructor</span>
        </div>
        {choice === "stud" ? <label>Student </label> : <label>Instructor</label>} <input type="text" placeholder='Your name..' name="name" value={user.name} onChange={handleChange} />
        <label>Email</label> <input type="email" placeholder='Your email..' name="email" value={user.email} onChange={handleChange} />
        <label>Password</label> <input type="password" placeholder='Password..' name="password" value={user.password} onChange={handleChange} />
        <button onClick={handleSignupClick}>Create account</button>
        <p>Already have an account? <Link to="/login"><span>Log in</span></Link></p>
      </div>
      <div className="right">
        <img src={signup} />
      </div>
    </div>
  )
}

export default Signup
