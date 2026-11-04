import React, { useEffect, useState } from 'react'
import { AdminContext } from './AdminContext';

const DEFAULT_ADMIN = {
  name: "Admin",
  email: "admin@lms.com",
  password: "admin123",
};

const AdminProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [admins, setAdmins] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("Admins"));
    return Array.isArray(saved) && saved.length > 0 ? saved : [DEFAULT_ADMIN];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    // Restore the logged-in user after a page refresh.
    try {
      const email = localStorage.getItem("CurrentAdmin");
      return email ? admins.find((item) => item.email === email) || null : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem("CurrentAdmin", currentUser.email);
      else localStorage.removeItem("CurrentAdmin");
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

  useEffect(() => {
    localStorage.setItem("Admins", JSON.stringify(admins));
  }, [admins]);

  const handleAdminLogin = () => {
    if (user.email === "" || user.password === "") {
      alert("Please fill all fields.");
      return;
    }

    const adm = admins.find(
      (item) => item.email === user.email && item.password === user.password
    );

    if (adm) {
      setCurrentUser(adm);
      return true;
    }

    alert("Invalid admin credentials.");
    return;
  };

  const logout = () => {
    setCurrentUser(null);
    setUser({ email: "", password: "" });
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        setUser,
        handleChange,
        handleAdminLogin,
        currentUser,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
