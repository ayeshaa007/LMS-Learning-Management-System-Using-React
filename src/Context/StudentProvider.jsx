import React, { useEffect, useState } from 'react'
import { StudentContext } from './StudentContext';

const StudentProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [students, setStudents] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("Students"));
    return Array.isArray(saved) ? saved : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    // Restore the logged-in user after a page refresh.
    try {
      const email = localStorage.getItem("CurrentStudent");
      return email ? students.find((item) => item.email === email) || null : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem("CurrentStudent", currentUser.email);
      else localStorage.removeItem("CurrentStudent");
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

  const searchStu = () => {
    return students.some((item) => item.email === user.email);
  };

  useEffect(() => {
    localStorage.setItem("Students", JSON.stringify(students));
  }, [students]);

  const handleStuSignup = () => {
    if (user.name === "" || user.email === "" || user.password === "") {
      alert("Please fill all fields.");
      return;
    }
    if (searchStu()) {
      alert("This email already exist.");
      return;
    }

    setStudents([...students, user]);
    setCurrentUser(user);
    return true;
  };

  const handleStuLogin = () => {
    if (user.email === "" || user.password === "") {
      alert("Please fill all fields.");
      return;
    }

    const stud = students.find(
      (item) => item.email === user.email && item.password === user.password
    );

    if (stud) {
      setCurrentUser(stud);
      return true;
    }

    alert("This student doesn't exist.");
    return;
  };

  // For the admin dashboard - removes a student account by email.
  const removeStudent = (email) => {
    setStudents((prev) => prev.filter((item) => item.email !== email));
    if (currentUser && currentUser.email === email) setCurrentUser(null);
  };

  const logout = () => {
    setCurrentUser(null);
    setUser({ name: "", email: "", password: "" });
  };

  return (
    <StudentContext.Provider
      value={{
        user,
        setUser,
        handleChange,
        handleStuLogin,
        handleStuSignup,
        currentUser,
        students,
        removeStudent,
        logout,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;