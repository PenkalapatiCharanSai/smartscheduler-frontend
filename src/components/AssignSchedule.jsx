import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "./api";
import "react-toastify/dist/ReactToastify.css";
import "./css/AssignSchedule.css";

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
  const [loadingProfessors, setLoadingProfessors] = useState(true);

  const groupToRoomMap = {
    "1": "3-002", "2": "3-003", "3": "3-004", "4": "3-007",
    "5": "3-008", "6": "3-102", "7": "3-103", "8": "3-104"
  };

  const timeSlots = [
    { start: "09:20", end: "10:30", label: "1st Period" },
    { start: "10:30", end: "11:40", label: "2nd Period" },
    { start: "11:50", end: "13:00", label: "3rd Period" },
    { start: "13:50", end: "14:40", label: "4th Period" },
    { start: "14:40", end: "15:30", label: "5th Period" },
    { start: "15:30", end: "16:20", label: "6th Period" }
  ];

  const fetchProfessors = async () => {
    setLoadingProfessors(true);
    try {
      const res = await api.get("/api/schedules/professors");
      setProfessors(res.data || []);
    } catch (err) {
      console.error("Error fetching professors:", err);
      toast.error("Failed to fetch professors from database.", { toastId: "fetch-professors" });
      setProfessors([]);
    } finally {
      setLoadingProfessors(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  useEffect(() => {
    if (selectedProfessor) {
      const prof = professors.find(p => p.username.toLowerCase() === selectedProfessor.toLowerCase());
      if (prof && prof.subjects && prof.subjects.length > 0 && !editingSchedule) {
        setFormData(prev => ({
          ...prev,
          subject: prof.subjects[0].subjectName,
          subjectId: prof.subjects[0].subjectId
        }));
      }

      api.get(`/api/professor/professor-schedule/${selectedProfessor}`)
        .then(res => setScheduleData(res.data || []))
        .catch(err => {
          console.error("Error fetching schedule:", err);
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
        const prof = professors.find(p => p.username.toLowerCase() === selectedProfessor.toLowerCase());
        const sub = prof?.subjects?.find(s => s.subjectName === value);
        newData.subjectId = sub ? sub.subjectId : "";
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Cannot assign schedules to past dates!", { toastId: "past-date-error", autoClose: 3000 });
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
        date: formData.date
      };

      const url = editingSchedule 
        ? `/api/schedules/update/${editingSchedule._id}`
        : "/api/schedules/assign";
      const method = editingSchedule ? "put" : "post";

      const response = await api[method](url, payload);

      if (response.data.aiMessage) {
        toast.info(response.data.aiMessage, { toastId: "ai-message", autoClose: 4000 });
      }

      toast.success(
        editingSchedule 
          ? "Schedule updated successfully!" 
          : "Schedules assigned successfully for one month!", 
        { toastId: editingSchedule ? "update-success" : "assign-success", autoClose: 3000 }
      );

      if (onScheduleAssigned) onScheduleAssigned();
      setEditingSchedule(null);
      
      const currentProf = professors.find(p => p.username.toLowerCase() === selectedProfessor.toLowerCase());
      setFormData({
        subject: currentProf?.subjects?.[0]?.subjectName || "",
        subjectId: currentProf?.subjects?.[0]?.subjectId || "",
        groupNo: "",
        roomNo: "",
        timeSlot: "",
        date: "",
        day: "",
        year: "3rd Year"
      });

      const refreshResponse = await api.get(`/api/professor/professor-schedule/${selectedProfessor}`);
      setScheduleData(refreshResponse.data || []);
    } catch (error) {
      console.error("Error:", error.response);
      const errorMsg = error.response?.data?.error || "Failed to process schedule";
      const aiMessage = error.response?.data?.aiMessage || "";

      if (aiMessage) toast.warn(aiMessage, { toastId: "ai-error-message", autoClose: 4000 });
      toast.error(errorMsg, { toastId: "submit-error", autoClose: 3000 });
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
        const response = await api.delete(`/api/schedules/delete/${id}`);
        if (response.status === 200) {
          toast.success("Schedule deleted successfully!", { toastId: `delete-success-${id}`, autoClose: 3000 });
          const refreshResponse = await api.get(`/api/professor/professor-schedule/${selectedProfessor}`);
          setScheduleData(refreshResponse.data || []);
          if (onScheduleAssigned) onScheduleAssigned();
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete schedule.", { toastId: `delete-error-${id}`, autoClose: 3000 });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingSchedule(null);
    const currentProf = professors.find(p => p.username.toLowerCase() === selectedProfessor?.toLowerCase());
    setFormData({
      subject: currentProf?.subjects?.[0]?.subjectName || "",
      subjectId: currentProf?.subjects?.[0]?.subjectId || "",
      groupNo: "",
      roomNo: "",
      timeSlot: "",
      date: "",
      day: "",
      year: "3rd Year"
    });
  };

  const activeProf = professors.find(p => p.username.toLowerCase() === selectedProfessor?.toLowerCase());

  return (
    <div className="assign-schedule-container">
      <h2>Assign Schedule</h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Select a professor to assign class schedules for 1 month ({professors.length} Professors loaded).
      </p>

      {loadingProfessors ? (
        <p>Loading professors from database...</p>
      ) : professors.length === 0 ? (
        <p>No professor records found in database.</p>
      ) : (
        <div className="professor-cards">
          {professors.map((prof) => (
            <div 
              key={prof._id || prof.user_id || prof.username}
              onClick={() => setSelectedProfessor(prof.username)}
              className={`professor-card ${selectedProfessor === prof.username ? 'selected' : ''}`}
            >
              <h4>{prof.fullName || prof.username}</h4>
              <p style={{ color: "#777", fontSize: "0.85rem", margin: "4px 0" }}>@{prof.username}</p>
              {prof.subjects && prof.subjects.length > 0 && (
                <div style={{ marginTop: "6px" }}>
                  <span style={{ fontSize: "0.8rem", background: "#e8eaf6", color: "#303f9f", padding: "2px 8px", borderRadius: "12px" }}>
                    {prof.subjects[0].subjectName}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedProfessor && (
        <div className="modal-overlay">
          <div className="schedule-modal">
            <h3>
              {editingSchedule ? "Edit Schedule" : "Assign Schedule (1 Month)"} for {activeProf?.fullName || selectedProfessor}
            </h3>
            
            <form onSubmit={handleSubmit} className="schedule-form">
              <select 
                name="subject" 
                value={formData.subject} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Select Subject</option>
                {activeProf?.subjects?.map((sub) => (
                  <option key={sub.subjectId} value={sub.subjectName}>{sub.subjectName}</option>
                ))}
              </select>

              <input type="text" value={formData.subjectId} readOnly placeholder="Subject ID" />

              <select name="groupNo" value={formData.groupNo} onChange={handleInputChange} required>
                <option value="">Select Group</option>
                {Object.keys(groupToRoomMap).map((grp) => (
                  <option key={grp} value={grp}>Group {grp}</option>
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
                <button type="button" onClick={() => { setSelectedProfessor(null); setEditingSchedule(null); }}>Close</button>
              </div>
            </form>

            {scheduleData.length > 0 ? (
              <div style={{ marginTop: "1.5rem" }}>
                <h4>Existing Schedules for {activeProf?.fullName || selectedProfessor}</h4>
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Group</th>
                      <th>Room</th>
                      <th>Time</th>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData.map((schedule) => (
                      <tr key={schedule._id}>
                        <td>{schedule.subject}</td>
                        <td>Group {schedule.groupNo}</td>
                        <td>{schedule.roomNo}</td>
                        <td>{schedule.startTime} - {schedule.endTime}</td>
                        <td>{schedule.date}</td>
                        <td>{schedule.day}</td>
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
              <p style={{ marginTop: "1rem", color: "#666" }}>
                No existing schedules assigned for {activeProf?.fullName || selectedProfessor}.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignSchedule;