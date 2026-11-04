import './Login.css'
import React, { useContext, useEffect } from 'react'
import login from '../../assets/login.jpg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'
import { StudentContext } from '../../Context/StudentContext'
import { InstructorContext } from '../../Context/InstructorContext'
import { AdminContext } from '../../Context/AdminContext'

const Login = () => {
  const { clickLogin, setChoice, choice } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // When RequireAuth sends someone here, pre-select the matching tab.
  useEffect(() => {
    const role = location.state && location.state.role;
    if (role) setChoice(role);
  }, [location.state, setChoice]);

  const { user: studentUser, handleChange: handleStudentChange } = useContext(StudentContext);
  const { user: instructorUser, handleChange: handleInstructorChange } = useContext(InstructorContext);
  const { user: adminUser, handleChange: handleAdminChange } = useContext(AdminContext);

  let user, handleChange;
  if (choice === "stud") {
    user = studentUser;
    handleChange = handleStudentChange;
  } else if (choice === "instr") {
    user = instructorUser;
    handleChange = handleInstructorChange;
  } else {
    user = adminUser;
    handleChange = handleAdminChange;
  }


  const handleLoginClick = () => {
    const redirectTo = clickLogin();
    if (redirectTo) navigate(redirectTo);
  };

  return (
    <div className='login'>
      <div className="left">
        <img src={login} />
      </div>
      <div className="right">
        <h3>Welcome back</h3>
        <p>Login to continue Learning</p>
        <div className="btns">
          <span className={choice === "stud" ? "active" : "inactive"} onClick={() => setChoice("stud")}>Student</span>
          <span className={choice === "instr" ? "active" : "inactive"} onClick={() => setChoice("instr")}>Instructor</span>
          <span className={choice === "admin" ? "active" : "inactive"} onClick={() => setChoice("admin")}>Admin</span>
        </div>

        <label>Email</label> <input type="email" name="email" value={user.email} onChange={handleChange} />
        <label>Password</label> <input type="password" name="password" value={user.password} onChange={handleChange} />
        <button onClick={handleLoginClick}>Login</button>

        {choice !== "admin" ? (
          <p>Don't have an account? <Link to="/signup"><span>Sign up</span></Link></p>
        ) : null}
      </div>
    </div>
  )
}

export default Login
