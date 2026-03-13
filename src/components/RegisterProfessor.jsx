import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaBook, FaPlus, FaMinus, FaArrowLeft, FaSave, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./css/RegisterProfessor.css";

const RegisterProfessor = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    username: "",
    fullName: "",
    password: "",
    subjects: [{ subjectName: "", subjectId: "" }]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordStrength("weak");
      return "Password should be at least 6 characters";
    } else if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      setPasswordStrength("strong");
      return "";
    } else {
      setPasswordStrength("medium");
      return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate password
    if (name === "password") {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  const handleSubjectChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [name]: value };
    setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
  };

  // const addSubject = () => {
  //   setFormData(prev => ({
  //     ...prev,
  //     subjects: [...prev.subjects, { subjectName: "", subjectId: "" }]
  //   }));
  // };

  // const removeSubject = (index) => {
  //   if (formData.subjects.length > 1) {
  //     const updatedSubjects = [...formData.subjects];
  //     updatedSubjects.splice(index, 1);
  //     setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
  //   }
  // };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.user_id) {
      newErrors.user_id = "User ID is required";
    }
    
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }
    
    // Validate each subject
    formData.subjects.forEach((subject, index) => {
      if (!subject.subjectName) {
        newErrors[`subjectName-${index}`] = "Subject Name is required";
      }
      if (!subject.subjectId) {
        newErrors[`subjectId-${index}`] = "Subject ID is required";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/register-professor",
        { ...formData, role: "PROFESSOR" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      toast.success(
        <div className="toast-message">
          <FaCheckCircle size={18} />
          <span>Professor registered successfully!</span>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );
      
      setFormData({
        user_id: "",
        username: "",
        fullName: "",
        password: "",
        subjects: [{ subjectName: "", subjectId: "" }]
      });
      setPasswordStrength("");
    } catch (error) {
      console.error("Error registering professor:", error);
      const errorMsg = error.response?.data?.message || "Failed to register professor.";
      
      toast.error(
        <div className="toast-message">
          <FaExclamationCircle size={18} />
          <span>{errorMsg}</span>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-professor-container">
      <ToastContainer />
      
      <div className="register-header">
        <h2 className="register-heading">Register Professor</h2>
        <p className="register-subheading">Add a new professor </p>
      </div>
      
      <div className="register-form-wrapper">
        <form onSubmit={handleSubmit} className="register-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FaUser className="section-title-icon" />
              Professor Information
            </h3>
            
            <div className="form-row">
              <div className="input-group">
                <label className="input-label" htmlFor="user_id">User ID</label>
                <input
                  id="user_id"
                  type="number"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  placeholder="Enter faculty ID number"
                  className={`register-input ${errors.user_id ? 'error' : ''}`}
                />
                {errors.user_id && (
                  <div className="error-message">
                    <FaExclamationCircle size={12} />
                    {errors.user_id}
                  </div>
                )}
              </div>
              
              <div className="input-group">
                <label className="input-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username for login"
                  className={`register-input ${errors.username ? 'error' : ''}`}
                />
                {errors.username && (
                  <div className="error-message">
                    <FaExclamationCircle size={12} />
                    {errors.username}
                  </div>
                )}
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter professor's full name"
                className={`register-input ${errors.fullName ? 'error' : ''}`}
              />
              {errors.fullName && (
                <div className="error-message">
                  <FaExclamationCircle size={12} />
                  {errors.fullName}
                </div>
              )}
            </div>
            
            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter secure password"
                className={`register-input ${errors.password ? 'error' : ''}`}
              />
              
              {formData.password && (
                <div className="password-strength">
                  <div className={`password-strength-bar strength-${passwordStrength}`}></div>
                </div>
              )}
              
              {formData.password && (
                <div className="">
                  
                </div>
              )}
              
              {errors.password && (
                <div className="error-message">
                  <FaExclamationCircle size={12} />
                  {errors.password}
                </div>
              )}
            </div>
          </div>
          
          {/* Subjects Section */}
          <div className="form-section">
            <div className="subjects-heading">
              <h3 className="section-title">
                <FaBook className="section-title-icon" />
                Subject Information
              </h3>


            </div>
            
            <div className="subjects-container">
              {formData.subjects.map((subject, index) => (
                <div key={index} className="subject-row">
                  <div className="input-group">
                    <div className="subject-row-header">Subject Name</div>
                    <input
                      type="text"
                      name="subjectName"
                      value={subject.subjectName}
                      onChange={(e) => handleSubjectChange(index, e)}
                      placeholder="e.g. Cloud Computing"
                      className={`register-input ${errors[`subjectName-${index}`] ? 'error' : ''}`}
                    />
                    {errors[`subjectName-${index}`] && (
                      <div className="error-message">
                        <FaExclamationCircle size={12} />
                        {errors[`subjectName-${index}`]}
                      </div>
                    )}
                  </div>
                  
                  <div className="input-group">
                    <div className="subject-row-header">Subject ID</div>
                    <input
                      type="text"
                      name="subjectId"
                      value={subject.subjectId}
                      onChange={(e) => handleSubjectChange(index, e)}
                      placeholder="e.g. MR22-1CS0108"
                      className={`register-input ${errors[`subjectId-${index}`] ? 'error' : ''}`}
                    />
                    {errors[`subjectId-${index}`] && (
                      <div className="error-message">
                        <FaExclamationCircle size={12} />
                        {errors[`subjectId-${index}`]}
                      </div>
                    )}
                  </div>
                  
                
                </div>
              ))}
              
            
            </div>
          </div>
          
          <div className="button-container">
            <button 
              type="button" 
              onClick={() => navigate("/dashboard")} 
              className="back-button"
            >
              <FaArrowLeft size={14} />
              Back to Dashboard
            </button>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <FaSave size={14} />
                  <span>Register Professor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterProfessor;