import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/Login.css";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login Response:", response.data); // Debug: Check the response

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("fullName", response.data.fullName || response.data.username);

        const displayName = response.data.fullName || response.data.username;

        toast.success(
          <div className="toast-message">
            <FaCheckCircle className="toast-icon success-icon" />
            <span>Welcome back, {displayName}! 🎉 Redirecting...</span>
          </div>,
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          }
        );

        setTimeout(() => {
          window.location.href =
            response.data.role === "HOD" ? "/dashboard" : "/professor-dashboard";
        }, 2000);
      } else {
        setError("Invalid response from server.");
        toast.error(
          <div className="toast-message">
            <FaExclamationTriangle className="toast-icon warning-icon" />
            <span>⚠️ Server error. Please try again.</span>
          </div>
        );
      }
    } catch (err) {
      setError("Invalid username or password!");
      toast.error(
        <div className="toast-message">
          <FaTimesCircle className="toast-icon error-icon" />
          <span>❌ Incorrect username or password. Try again!</span>
        </div>,
        {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;