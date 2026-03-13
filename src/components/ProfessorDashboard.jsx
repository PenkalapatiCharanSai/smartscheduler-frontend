// import React, { useState, useEffect } from "react";
// import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
// import ViewSchedule from "./ViewSchedule";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { FaCalendarAlt, FaSignOutAlt, FaBars } from "react-icons/fa";

// const ProfessorDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [fullName, setFullName] = useState("");
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const storedFullName = localStorage.getItem("fullName");
//     const storedUsername = localStorage.getItem("username");
//     const token = localStorage.getItem("token");

//     console.log("Stored Data - fullName:", storedFullName, "username:", storedUsername); // Debug

//     if (!token) {
//       navigate("/");
//       return;
//     }

//     if (storedFullName) {
//       setFullName(storedFullName);
//     } else if (storedUsername) {
//       setFullName(storedUsername);
//       toast.warn("Full name not found, displaying username instead");
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.clear();
//     toast.info("Logged out successfully!");
//     navigate("/");
//   };

//   const isActive = (path) => {
//     return location.pathname.includes(path);
//   };

//   return (
//     <div className="professor-dashboard-container">
//       <ToastContainer position="top-right" />
      
//       <nav>
//         {/* <div className="brand">
//           <span className="logo">SchedulePro</span>
//         </div> */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem' }}>
//           <img src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png" 
//           alt="SchedulePro Logo" 
//           style={{ width: '24px', height: '24px' }} />
//           <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#303f9f' }}>
//             Smart Scheduler
//             </span>
//         </div>
        
//         <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
//           <Link to="/professor-dashboard/schedule" className={isActive("/schedule") ? "active" : ""}>
//             <FaCalendarAlt className="nav-icon" />
//             <span>View Schedule</span>
//           </Link>
//         </div>
        
//         <div className="user-actions">
//           <div className="user-info">
//             <div className="user-avatar">
//               {fullName.split(" ")[0]?.charAt(0).toUpperCase() || ""}
//             </div>
//             <div className="user-details">
//               <div className="user-name">{fullName}</div>
//               <div className="user-role">Professor</div>
//             </div>
//           </div>
          
//           <button className="logout-btn" onClick={handleLogout}>
//             <FaSignOutAlt />
//             <span>Logout</span>
//           </button>
//         </div>
//       </nav>
      
//       <div className="dashboard-content">
//         <main className="main-content">
//           {location.pathname === "/professor-dashboard" && (
//             <div className="welcome-banner">
//               <h2>Welcome back, {fullName}</h2>
//               <p>View your assigned schedules using the navigation menu.</p>
//             </div>
//           )}
          
//           <Routes>
//             <Route path="/" element={
//               <div className="dashboard-grid">
//                 <div className="stat-card" onClick={() => navigate("/professor-dashboard/schedule")}>
//                   <h3 className="stat-title">Schedule Viewer</h3>
//                   <p className="stat-value"><FaCalendarAlt /></p>
//                   <span>View your assigned schedules</span>
//                 </div>
//               </div>
//             } />
//             <Route path="schedule" element={<ViewSchedule />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ProfessorDashboard;
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import ViewSchedule from "./ViewSchedule";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCalendarAlt, FaSignOutAlt, FaBars } from "react-icons/fa";

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fullName, setFullName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedFullName = localStorage.getItem("fullName");
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    console.log("Stored Data - fullName:", storedFullName, "username:", storedUsername);

    if (!token) {
      navigate("/");
      return;
    }

    if (storedFullName) {
      setFullName(storedFullName);
    } else if (storedUsername) {
      setFullName(storedUsername);
      toast.warn("Full name not found, displaying username instead");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully!");
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="professor-dashboard-container">
      <ToastContainer position="top-right" />
      <header className="university-header">
        <div className="header-logo">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBzqH_tArKfmBjhyH0FxkKQp54k6PdgUdkaw&s" // Replace with Mallareddy University logo URL or local path
            alt="Mallareddy University Logo" 
            className="university-logo"
          />
        </div>
        <div className="header-title">
          <span className="university-name">Mallareddy University</span>
        </div>
      </header>

      {/* Existing Navbar */}
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem' }}>
          {/* <img 
            src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png" 
            alt="Smart Scheduler Logo" 
            style={{ width: '24px', height: '24px' }} 
          /> */}
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#303f9f' }}>
            Smart Scheduler
          </span>
        </div>
        
        <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <Link to="/professor-dashboard/schedule" className={isActive("/schedule") ? "active" : ""}>
            <FaCalendarAlt className="nav-icon" />
            <span>View Schedule</span>
          </Link>
        </div>
        
        <div className="user-actions">
          <div className="user-info">
            <div className="user-avatar">
              {fullName.split(" ")[0]?.charAt(0).toUpperCase() || ""}
            </div>
            <div className="user-details">
              <div className="user-name">{fullName}</div>
              <div className="user-role">Professor</div>
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
          {location.pathname === "/professor-dashboard" && (
            <div className="welcome-banner">
              <h2>Welcome back, {fullName}</h2>
              <p>View your assigned schedules using the navigation menu.</p>
            </div>
          )}
          
          <Routes>
            <Route path="/" element={
              <div className="dashboard-grid">
                <div className="stat-card" onClick={() => navigate("/professor-dashboard/schedule")}>
                  <h3 className="stat-title">Schedule Viewer</h3>
                  <p className="stat-value"><FaCalendarAlt /></p>
                  <span>View your assigned schedules</span>
                </div>
              </div>
            } />
            <Route path="schedule" element={<ViewSchedule />} />
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

export default ProfessorDashboard;
