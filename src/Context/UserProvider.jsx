import React, { useContext, useState } from 'react'
import { UserContext } from './UserContext'
import { StudentContext } from './StudentContext';
import { InstructorContext } from './InstructorContext';
import { AdminContext } from './AdminContext';

const UserProvider = ({ children }) => {
  const { handleStuLogin, handleStuSignup } = useContext(StudentContext);
  const { handleInstLogin, handleInstSignup } = useContext(InstructorContext);
  const { handleAdminLogin } = useContext(AdminContext);

  const [choice, setChoice] = useState("stud");

  const clickLogin = () => {
    if (choice === "stud") return handleStuLogin() ? "/student" : null;
    if (choice === "instr") return handleInstLogin() ? "/instructor" : null;
    if (choice === "admin") return handleAdminLogin() ? "/admin" : null;
    return null;
  };

  const clickSignup = () => {
    if (choice === "stud") return handleStuSignup() ? "/student" : null;
    if (choice === "instr") return handleInstSignup() ? "/instructor" : null;
    
    return null;
  };

  return (
    <UserContext.Provider value={{ clickLogin, clickSignup, setChoice, choice }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
