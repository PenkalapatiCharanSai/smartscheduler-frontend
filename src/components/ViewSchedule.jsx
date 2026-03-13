import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/ViewSchedule.css";

const ViewSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessorSchedule = async () => {
      const username = localStorage.getItem("username");
      console.log("Stored Username:", username);

      if (!username) {
        setError("User not found. Please login again.");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/professor/professor-schedule/${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.data.length === 0) {
          setError("No schedule assigned.");
        } else {
          setSchedules(response.data);
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError("Failed to fetch schedule. Please try again later.");
      }
    };

    fetchProfessorSchedule();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const getScheduleStatus = (schedule) => {
    const scheduleDate = new Date(schedule.date);
    const startTime = schedule.startTime.split(":");
    const endTime = schedule.endTime.split(":");
    
    const startDateTime = new Date(scheduleDate);
    startDateTime.setHours(parseInt(startTime[0]), parseInt(startTime[1]), 0, 0);
    
    const endDateTime = new Date(scheduleDate);
    endDateTime.setHours(parseInt(endTime[0]), parseInt(endTime[1]), 0, 0);

    if (currentTime < startDateTime) {
      return "Upcoming";
    } else if (currentTime >= startDateTime && currentTime <= endDateTime) {
      return "Ongoing";
    } else {
      return "Completed";
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const status = getScheduleStatus(schedule);
    return filter === "all" || status.toLowerCase() === filter;
  });

  return (
    <div className="view-schedule-container">
      <h2 className="schedule-heading">Professor Your Schedule</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="filter-buttons">
        <button
          onClick={() => setFilter("all")}
          className={`filter-button ${filter === "all" ? "active-all" : ""}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`filter-button ${filter === "upcoming" ? "active-upcoming" : ""}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter("ongoing")}
          className={`filter-button ${filter === "ongoing" ? "active-ongoing" : ""}`}
        >
          Ongoing
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`filter-button ${filter === "completed" ? "active-completed" : ""}`}
        >
          Completed
        </button>
      </div>

      {filteredSchedules.length > 0 ? (
        <div className="card-container">
          {filteredSchedules.map((schedule, index) => {
            const status = getScheduleStatus(schedule);
            return (
              <div key={index} className={`schedule-card ${status.toLowerCase()}`}>
                <h3>{schedule.subject}</h3>
                <p><strong>Group No:</strong> {schedule.groupNo}</p>
                <p><strong>Room No:</strong> {schedule.roomNo}</p>
                <p><strong>Time:</strong> {schedule.startTime} - {schedule.endTime}</p>
                <p><strong>Date:</strong> {schedule.date}</p>
                <p><strong>Day:</strong> {schedule.day}</p>
                <p><strong>Status:</strong> {status}</p>
              </div>
            );
          })}
        </div>
      ) : (
        !error && <p className="no-schedules">No schedules match the selected filter.</p>
      )}
    
    </div>
  );
};

export default ViewSchedule;