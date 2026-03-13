import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import AssignSchedule from "./AssignSchedule";
import GroupSchedules from "./GroupSchedules";
import RegisterProfessor from "./RegisterProfessor";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/HodDashboard.css";
import { FaCalendarAlt, FaUsers, FaUserPlus, FaSignOutAlt, FaBars, FaChartBar } from "react-icons/fa";

const HodDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [username, setUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully!");
    navigate("/");
  };

  const handleScheduleAssigned = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Schedule assigned successfully!");
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  console.log("Current Path:", location.pathname); // Debug: Log the current path

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" />
      
      {/* Header Section */}
      <header className="university-header">
        <div className="header-logo">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBzqH_tArKfmBjhyH0FxkKQp54k6PdgUdkaw&s"
            alt="Mallareddy University Logo" 
            className="university-logo"
          />
        </div>
        <div className="header-title">
          <span className="university-name">Mallareddy University</span>
        </div>
      </header>

      {/* Navbar */}
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#303f9f' }}>
            Smart Scheduler
          </span>
        </div>
        
        <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <Link to="/dashboard/assign" className={isActive("/assign") ? "active" : ""}>
            <FaCalendarAlt className="nav-icon" />
            <span>Assign Schedule</span>
          </Link> 
          <Link to="/dashboard/groups" className={isActive("/groups") ? "active" : ""}>
            <FaUsers className="nav-icon" />
            <span>Group Schedules</span>
          </Link>
          <Link to="/dashboard/register" className={isActive("/register") ? "active" : ""}>
            <FaUserPlus className="nav-icon" />
            <span>Register Professor</span>
          </Link>
          <Link to="/dashboard/analytics" className={isActive("/analytics") ? "active" : ""}>
            <FaChartBar className="nav-icon" />
            <span>Analytics Dashboard</span>
          </Link>
        </div>
        
        <div className="user-actions">
          <div className="user-info">
            <div className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{username}</div>
              <div className="user-role">HOD</div>
            </div>
          </div>
          
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </nav>
      
      <div className="dashboard-content">
        <main className="main-content">
          {location.pathname === "/dashboard" && (
            <div className="welcome-banner">
              <h2>Welcome back, {username}</h2>
              <p>Use the dashboard to manage schedules for professors, view groups schedules, register new professors, and analyze scheduling data.</p>
            </div>
          )}
          
          <Routes>
            <Route path="/" element={
              <div className="dashboard-grid">
                <div className="stat-card" onClick={() => navigate("/dashboard/assign")}>
                  <h3 className="stat-title">Schedule Management</h3>
                  <p className="stat-value"><FaCalendarAlt /></p>
                  <span>Assign new schedules</span>
                </div>
                <div className="stat-card" onClick={() => navigate("/dashboard/groups")}>
                  <h3 className="stat-title">Group Overview</h3>
                  <p className="stat-value"><FaUsers /></p>
                  <span>Manage groups schedules</span>
                </div>
                <div className="stat-card" onClick={() => navigate("/dashboard/register")}>
                  <h3 className="stat-title">Professor Registration</h3>
                  <p className="stat-value"><FaUserPlus /></p>
                  <span>Add new professors</span>
                </div>
                <div className="stat-card" onClick={() => navigate("/dashboard/analytics")}>
                  <h3 className="stat-title">Analytics Dashboard</h3>
                  <p className="stat-value"><FaChartBar /></p>
                  <span>View scheduling analytics</span>
                </div>
              </div>
            } />
            <Route path="assign" element={<AssignSchedule onScheduleAssigned={handleScheduleAssigned} />} />
            <Route path="groups" element={<GroupSchedules refreshTrigger={refreshTrigger} />} />
            <Route path="register" element={<RegisterProfessor refreshTrigger={refreshTrigger} />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </main>
      </div>

      {/* Footer Section */}
      <footer className="dashboard-footer">
  <p>
    © {new Date().getFullYear()} Mallareddy University. All rights reserved.
  </p>
</footer>
    </div>
  );
};

export default HodDashboard;