


import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
// import AdminServices from "./pages/AdminServices";
import ApplicationForm from "./pages/ApplicationForm";
import OperatorPanel from "./pages/OperatorPanel";
import UserDashboard from "./pages/UserDashboard";

import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ForgotPassword from './pages/ForgotPassword';
import UserProfile from './pages/UserProfile'; // ✅ UserProfile import


function App() {
  return (
    <AuthProvider>
      <UserProvider>
        
       
 
        <Router>
          <Navbar /> {/* Navbar always visible */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* User Routes */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />

            {/* 🔗 Application Form with serviceId (dynamic route added) */}
            <Route path="/application-form" element={<ApplicationForm />} />
            <Route path="/application-form/:serviceId" element={<ApplicationForm />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            {/* <Route path="/admin/services" element={<AdminServices />} /> */}

            {/* Operator Route */}
            <Route path="/operator" element={<OperatorPanel />} />
          </Routes>
        </Router>
     
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
