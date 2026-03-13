import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/GroupSchedules.css";

const GroupSchedules = ({ refreshTrigger }) => {
  const [groupSchedules, setGroupSchedules] = useState({});
  const [professors, setProfessors] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  const groups = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeSlots = [
    "09:20-10:30", 
    "10:30-11:40", 
    "11:40-11:50", // Break
    "11:50-13:00", 
    "13:00-13:50", // Lunch
    "13:50-14:40", 
    "14:40-15:30", 
    "15:30-16:20"
  ];

  const specialSlots = {
    "11:40-11:50": "Break",
    "13:00-13:50": "Lunch"
  };

  const dayMap = {
    "Monday": "Mon", "Tuesday": "Tue", "Wednesday": "Wed",
    "Thursday": "Thu", "Friday": "Fri", "Saturday": "Sat"
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profResponse = await axios.get("http://localhost:8000/api/schedules/professors");
        setProfessors(profResponse.data);

        const schedules = {};
        for (const group of groups) {
          const response = await axios.get(`http://localhost:8000/api/schedules/group/${group}`);
          schedules[group] = response.data || [];
        }
        setGroupSchedules(schedules);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const getProfessorFullName = (username) => {
    const professor = professors.find(prof => prof.username === username);
    return professor ? professor.fullName : username;
  };

  const getScheduleForSlot = (group, day, timeSlot) => {
    // If it's a special slot (Break or Lunch), return the special slot name
    if (specialSlots[timeSlot]) {
      return specialSlots[timeSlot];
    }

    const [startTime, endTime] = timeSlot.split("-");
    const schedules = groupSchedules[group] || [];
    const schedule = schedules.find(s => {
      const normalizedDay = dayMap[s.day] || s.day;
      return normalizedDay === day && s.startTime === startTime && s.endTime === endTime;
    });
    return schedule ? schedule.subject : "-";
  };

  const getFacultyDetails = (group) => {
    const schedules = groupSchedules[group] || [];
    const uniqueFaculty = {};
    schedules.forEach(s => {
      uniqueFaculty[s.professor] = {
        fullName: getProfessorFullName(s.professor),
        subject: s.subject,
        subjectId: s.subjectId
      };
    });
    return Object.values(uniqueFaculty);
  };

  return (
    <div className="group-schedules-container">
      <h2>Group Schedules</h2>
      <div className="group-buttons">
        {groups.map(group => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={selectedGroup === group ? "active" : ""}
          >
            Group {group}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-indicator">
          Loading schedules...
        </div>
      ) : selectedGroup ? (
        <div className="timetable">
          <h3>Group {selectedGroup} Timetable</h3>
          {groupSchedules[selectedGroup]?.length === 0 && (
            <p>No schedules assigned for Group {selectedGroup}.</p>
          )}
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>9:20-10:30</th>
                <th>10:30-11:40</th>
                <th>11:40-11:50</th>
                <th>11:50-13:00</th>
                <th>13:00-13:50</th>
                <th>13:50-14:40</th>
                <th>14:40-15:30</th>
                <th>15:30-16:20</th>
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td>{day}</td>
                  {timeSlots.map(slot => (
                    <td 
                      key={slot} 
                      className={specialSlots[slot] ? 'special-slot' : ''}
                    >
                      {getScheduleForSlot(selectedGroup, day, slot)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {groupSchedules[selectedGroup]?.length > 0 && (
            <div className="faculty-details">
              <h4>Faculty Details</h4>
              <table>
                <thead>
                  <tr>
                    <th>Subject ID</th>
                    <th>Subject Name</th>
                    <th>Professor Name</th>
                  </tr>
                </thead>
                <tbody>
                  {getFacultyDetails(selectedGroup).map((faculty, index) => (
                    <tr key={index}>
                      <td>{faculty.subjectId}</td>
                      <td>{faculty.subject}</td>
                      <td>{faculty.fullName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default GroupSchedules;