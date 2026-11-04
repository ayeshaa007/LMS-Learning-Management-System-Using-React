import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { StudentContext } from '../../Context/StudentContext'
import { InstructorContext } from '../../Context/InstructorContext'
import { AdminContext } from '../../Context/AdminContext'

// role: "stud" | "instr" | "admin" (same values the Login tabs use).
// Sends logged-out visitors to the login page with the right tab selected.
const RequireAuth = ({ role, children }) => {
  const { currentUser: student } = useContext(StudentContext);
  const { currentUser: instructor } = useContext(InstructorContext);
  const { currentUser: admin } = useContext(AdminContext);

  const user = role === "stud" ? student : role === "instr" ? instructor : admin;

  if (!user) return <Navigate to="/login" replace state={{ role }} />;
  return children;
};

export default RequireAuth
