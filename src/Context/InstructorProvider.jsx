import React, { useEffect, useState } from 'react'
import { InstructorContext } from './InstructorContext';

const InstructorProvider = ({ children }) => {
  
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });


  const [instructors, setInstructors] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("Instructors"));
    return Array.isArray(saved) ? saved : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    // Restore the logged-in user after a page refresh.
    try {
      const email = localStorage.getItem("CurrentInstructor");
      return email ? instructors.find((item) => item.email === email) || null : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem("CurrentInstructor", currentUser.email);
      else localStorage.removeItem("CurrentInstructor");
    } catch {
      /* storage unavailable - session just won't persist */
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const searchInst = () => {
    return instructors.some((item) => item.email === user.email);
  };

  useEffect(() => {
    localStorage.setItem("Instructors", JSON.stringify(instructors));
  }, [instructors]);

  const handleInstSignup = () => {
    if (user.name === "" || user.email === "" || user.password === "") {
      alert("Please fill all fields.");
      return;
    }
    if (searchInst()) {
      alert("This email already exist.");
      return;
    }

    setInstructors([...instructors, user]);
    setCurrentUser(user);
    return true;
  };

  const handleInstLogin = () => {
    if (user.email === "" || user.password === "") {
      alert("Please fill all fields.");
      return;
    }

    const instr = instructors.find(
      (item) => item.email === user.email && item.password === user.password
    );

    if (instr) {
      setCurrentUser(instr);
      return true;
    }

    alert("This Instructor doesn't exist.");
    return;
  };

  // For the admin dashboard - removes an instructor account by email.
  const removeInstructor = (email) => {
    setInstructors((prev) => prev.filter((item) => item.email !== email));
    if (currentUser && currentUser.email === email) setCurrentUser(null);
  };

  const logout = () => {
    setCurrentUser(null);
    setUser({ name: "", email: "", password: "" });
  };

  return (
    <InstructorContext.Provider
      value={{
        user,
        setUser,
        handleChange,
        handleInstLogin,
        handleInstSignup,
        currentUser,
        instructors,
        removeInstructor,
        logout,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
};

export default InstructorProvider;