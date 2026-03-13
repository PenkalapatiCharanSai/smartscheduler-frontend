import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './css/AssignSchedule.css';

const AssignSchedule = ({ onScheduleAssigned }) => {
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    subjectId: "",
    groupNo: "",
    roomNo: "",
    timeSlot: "",
    date: "",
    day: "",
    year: "3rd Year"
  });
  const [editingSchedule, setEditingSchedule] = useState(null);

  const groupToRoomMap = {
    "1": "3-002", "2": "3-003", "3": "3-004", "4": "3-007",
    "5": "3-008", "6": "3-102", "7": "3-103", "8": "3-104"
  };

  // Updated time slots to match GroupSchedules.js
  const timeSlots = [
    { start: "09:20", end: "10:30", label: "1st Period" },
    { start: "10:30", end: "11:40", label: "2nd Period" },
    { start: "11:50", end: "13:00", label: "3rd Period" },
    { start: "13:50", end: "14:40", label: "4th Period" },
    { start: "14:40", end: "15:30", label: "5th Period" },
    { start: "15:30", end: "16:20", label: "6th Period" }
  ];

  useEffect(() => {
    axios.get("http://localhost:8000/api/schedules/professors")
      .then((response) => setProfessors(response.data))
      .catch((error) => {
        console.error("Error fetching professors:", error);
        toast.error("Failed to fetch professors.", { toastId: "fetch-professors" });
      });
  }, []);

  useEffect(() => {
    if (selectedProfessor) {
      const prof = professors.find(p => p.username === selectedProfessor);
      if (prof && prof.subjects.length > 0 && !editingSchedule) {
        setFormData(prev => ({
          ...prev,
          subject: prof.subjects[0].subjectName,
          subjectId: prof.subjects[0].subjectId
        }));
      }
      axios.get(`http://localhost:8000/api/professor/professor-schedule/${selectedProfessor}`)
        .then((response) => {
          console.log(`Schedules for ${selectedProfessor}:`, response.data);
          setScheduleData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching schedule:", error);
          toast.error("Failed to fetch schedule.", { toastId: "fetch-schedule" });
          setScheduleData([]);
        });
    } else {
      setScheduleData([]);
    }
  }, [selectedProfessor, professors, editingSchedule]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      roomNo: groupToRoomMap[formData.groupNo] || ""
    }));
  }, [formData.groupNo]);

  useEffect(() => {
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      setFormData(prev => ({
        ...prev,
        day: selectedDate.toLocaleString("en-us", { weekday: "long" })
      }));
    }
  }, [formData.date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === "subject") {
        const prof = professors.find(p => p.username === selectedProfessor);
        const sub = prof?.subjects.find(s => s.subjectName === value);
        newData.subjectId = sub ? sub.subjectId : "";
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error("Cannot assign schedules to past dates!", {
        toastId: "past-date-error",
        autoClose: 3000,
      });
      return;
    }

    try {
      const [startTime, endTime] = formData.timeSlot.split("-").map(time => time.padStart(5, "0"));
      const payload = {
        professor: selectedProfessor,
        subject: formData.subject,
        subjectId: formData.subjectId,
        groupNo: formData.groupNo,
        roomNo: formData.roomNo,
        startTime,
        endTime,
        date: formData.date, // Starting date for the one-month assignment
      };

      const url = editingSchedule 
        ? `http://localhost:8000/api/schedules/update/${editingSchedule._id}`
        : "http://localhost:8000/api/schedules/assign";
      const method = editingSchedule ? "put" : "post";

      const response = await axios[method](url, payload);

      if (response.data.aiMessage) {
        toast.info(response.data.aiMessage, {
          toastId: "ai-message",
          autoClose: 4000,
        });
      }

      toast.success(
        editingSchedule 
          ? "Schedule updated successfully!" 
          : "Schedules assigned successfully for one month!", 
        {
          toastId: editingSchedule ? "update-success" : "assign-success",
          autoClose: 3000,
        }
      );
      onScheduleAssigned();
      setEditingSchedule(null);
      setFormData({
        subject: professors.find(p => p.username === selectedProfessor)?.subjects[0]?.subjectName || "",
        subjectId: professors.find(p => p.username === selectedProfessor)?.subjects[0]?.subjectId || "",
        groupNo: "",
        roomNo: "",
        timeSlot: "",
        date: "",
        day: "",
        year: "3rd Year"
      });

      const refreshResponse = await axios.get(`http://localhost:8000/api/professor/professor-schedule/${selectedProfessor}`);
      setScheduleData(refreshResponse.data);
    } catch (error) {
      console.error("Error:", error.response);
      const errorMsg = error.response?.data?.error || "Failed to process schedule";
      const aiMessage = error.response?.data?.aiMessage || "";

      if (aiMessage) {
        toast.warn(aiMessage, {
          toastId: "ai-error-message",
          autoClose: 4000,
        });
      }

      toast.error(errorMsg, {
        toastId: "submit-error",
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      subject: schedule.subject,
      subjectId: schedule.subjectId,
      groupNo: schedule.groupNo,
      roomNo: schedule.roomNo,
      timeSlot: `${schedule.startTime}-${schedule.endTime}`,
      date: schedule.date,
      day: schedule.day,
      year: schedule.year || "3rd Year"
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/schedules/delete/${id}`);
        if (response.status === 200) {
          toast.success("Schedule deleted successfully!", {
            toastId: `delete-success-${id}`,
            autoClose: 3000,
          });
          const refreshResponse = await axios.get(`http://localhost:8000/api/professor/professor-schedule/${selectedProfessor}`);
          setScheduleData(refreshResponse.data);
          onScheduleAssigned();
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete schedule.", {
          toastId: `delete-error-${id}`,
          autoClose: 3000,
        });
        const refreshResponse = await axios.get(`http://localhost:8000/api/professor/professor-schedule/${selectedProfessor}`);
        setScheduleData(refreshResponse.data);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingSchedule(null);
    setFormData({
      subject: professors.find(p => p.username === selectedProfessor)?.subjects[0]?.subjectName || "",
      subjectId: professors.find(p => p.username === selectedProfessor)?.subjects[0]?.subjectId || "",
      groupNo: "",
      roomNo: "",
      timeSlot: "",
      date: "",
      day: "",
      year: "3rd Year"
    });
  };

  return (
    <div className="assign-schedule-container">
      <h2>Assign Schedule</h2>

      <div className="professor-cards">
        {professors.map((prof) => (
          <div 
            key={prof._id}
            onClick={() => setSelectedProfessor(prof.username)}
            className="professor-card"
          >
            <h4>{prof.fullName}</h4>
          </div>
        ))}
      </div>

      {selectedProfessor && (
        <div className="modal-overlay">
          <div className="schedule-modal">
            <h3>{editingSchedule ? "Edit Schedule" : "Assign Schedule (1 Month)"} for {professors.find(p => p.username === selectedProfessor)?.fullName}</h3>
            
            <form onSubmit={handleSubmit} className="schedule-form">
              <select 
                name="subject" 
                value={formData.subject} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Select Subject</option>
                {professors.find(p => p.username === selectedProfessor)?.subjects.map((sub) => (
                  <option key={sub.subjectId} value={sub.subjectName}>{sub.subjectName}</option>
                ))}
              </select>
              <input type="text" value={formData.subjectId} readOnly placeholder="Subject ID" />
              <select name="groupNo" value={formData.groupNo} onChange={handleInputChange} required>
                <option value="">Select Group</option>
                {Object.keys(groupToRoomMap).map((grp) => (
                  <option key={grp} value={grp}>{grp}</option>
                ))}
              </select>
              <input type="text" value={formData.roomNo} readOnly placeholder="Room No" />
              <select name="timeSlot" value={formData.timeSlot} onChange={handleInputChange} required>
                <option value="">Select Time Slot (Assigned for 1 Month)</option>
                {timeSlots.map((slot) => (
                  <option key={slot.label} value={`${slot.start}-${slot.end}`}>
                    {slot.label} ({slot.start} - {slot.end})
                  </option>
                ))}
              </select>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleInputChange} 
                required 
                min={new Date().toISOString().split("T")[0]}
              />
              <input type="text" value={formData.day} readOnly placeholder="Day" />
              <input type="text" value={formData.year} readOnly placeholder="Year" />
              <div className="table-actions">
                <button type="submit">{editingSchedule ? "Update" : "Assign for 1 Month"}</button>
                {editingSchedule && (
                  <button type="button" onClick={handleCancelEdit}>Cancel Edit</button>
                )}
                <button type="button" onClick={() => setSelectedProfessor(null)}>Close</button>
              </div>
            </form>

            {scheduleData.length > 0 ? (
              <div>
                <h4>Existing Schedules for {professors.find(p => p.username === selectedProfessor)?.fullName}</h4>
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Group</th>
                      <th>Room</th>
                      <th>Time</th>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Year</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData.map((schedule) => (
                      <tr key={schedule._id}>
                        <td>{schedule.subject}</td>
                        <td>{schedule.groupNo}</td>
                        <td>{schedule.roomNo}</td>
                        <td>{schedule.startTime}-{schedule.endTime}</td>
                        <td>{schedule.date}</td>
                        <td>{schedule.day}</td>
                        <td>{schedule.year || "3rd Year"}</td>
                        <td className="table-actions">
                          <button onClick={() => handleEdit(schedule)}>Edit</button>
                          <button onClick={() => handleDelete(schedule._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No existing schedules for {professors.find(p => p.username === selectedProfessor)?.fullName}.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignSchedule;