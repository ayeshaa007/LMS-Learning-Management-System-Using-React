import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';

import Courses from './Pages/Courses/Courses';
import QandA from './Pages/Q&A/QandA';
import Login from './Components/Login/Login';
import CourseDetail from './Components/CourseDetail/CourseDetail';
import Signup from './Components/Signup/Signup';
import UserProvider from './Context/UserProvider';
import StudentDashboard from './Components/StudentDashboard/StudentDashboard';
import CoursePlayer from './Components/CoursePlayer/CoursePlayer';
import InstructorDashboard from './Components/InstructorDashboard/InstructorDashboard';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import StudentProvider from './Context/StudentProvider';
import InstructorProvider from './Context/InstructorProvider';
import AdminProvider from './Context/AdminProvider';
import Checkout from './Components/Checkout/Checkout';
import NewCourse from './Components/NewCourse/NewCourse';
import Navbar from './Components/Navbar/Navbar';
import CourseProvider from './Context/CourseProvider';
import About from './Pages/About/About';
import CoursesList from './Components/CoursesList/CoursesList';
import RequireAuth from './Components/RequireAuth/RequireAuth';

const App = () => {
  return (

              <BrowserRouter>

    <StudentProvider>
      <InstructorProvider>
        <AdminProvider>
          <CourseProvider>
            <UserProvider>
                <Routes>
                  <Route path="/" element={<Home /> } />
                  <Route path="/about" element={<About/>} />
                  <Route path="/courses" element={<Courses />}/>
                  <Route path="/courses/coursename" element={<CourseDetail />} />
                  <Route path="/QandA" element={<QandA />} />

                  <Route path="/courseplayer" element={<RequireAuth role="stud"><CoursePlayer/></RequireAuth>} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/student" element={<RequireAuth role="stud"><StudentDashboard/></RequireAuth>} />
                  <Route path="/instructor" element={<RequireAuth role="instr"><InstructorDashboard/></RequireAuth>} />
                  <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard/></RequireAuth>} />
                  <Route path="/newCourse" element={<RequireAuth role="instr"><NewCourse/></RequireAuth>} />
                  <Route path="/checkout" element={<RequireAuth role="stud"><Checkout/></RequireAuth>} />

                </Routes>
            </UserProvider>
          </CourseProvider>
        </AdminProvider>
      </InstructorProvider>
    </StudentProvider>
              </BrowserRouter>

  )
}

export default App
