import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import HodDashboard from "./components/HodDashboard";
import ProfessorDashboard from "./components/ProfessorDashboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
const ProtectedRoute = ({ element, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !role) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000} // Default 3 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1} // Limit to 1 toast at a time to prevent stacking
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={<ProtectedRoute element={<HodDashboard />} allowedRole="HOD" />}
        />
        <Route
          path="/professor-dashboard/*"
          element={<ProtectedRoute element={<ProfessorDashboard />} allowedRole="PROFESSOR" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

