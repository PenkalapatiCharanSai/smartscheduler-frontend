# 📅 Smart Scheduler — Full Stack Scheduling System

Smart Scheduler is a **Full Stack Web Application** designed to manage academic schedules efficiently.
The system allows administrators (HOD) to assign schedules and professors to view their timetables through role-based dashboards.

---

## 🌐 Live Deployments

* **Frontend (Vercel)**: [https://smartscheduler-indol.vercel.app/](https://smartscheduler-indol.vercel.app/)
* **Backend (Render)**: [https://smartscheduler-backend-h1qt.onrender.com](https://smartscheduler-backend-h1qt.onrender.com)

---

## 🚀 Project Overview

Manual timetable management leads to scheduling conflicts and inefficiency.
Smart Scheduler provides an automated platform to:

* Manage professors
* Assign schedules
* View timetables
* Monitor academic activities

The project follows a **MERN-style architecture** with separate frontend and backend services.

---

## 🏗️ Project Architecture

```
Smart-Scheduler/
│
├── frontend/        → React + Vite Client Application
│
├── backend/         → Node.js + Express API Server
│
└── README.md
```

---

## ✨ Features

### 👨‍💼 HOD Dashboard

* Add & manage professors
* Assign schedules
* Monitor analytics

### 👨‍🏫 Professor Dashboard

* Login authentication
* View assigned timetable
* Schedule tracking

### ⚙️ System Features

* Role-based access
* REST API integration
* Dashboard analytics
* Secure authentication
* Responsive UI

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* React Router
* React Toastify
* Chart.js

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* dotenv

---

## 📂 Folder Structure

```
Smart-Scheduler
│
├── frontend
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/YOUR_USERNAME/Smart-Scheduler.git
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

Open browser:

```
http://localhost:5173
```

---

## 🔗 API Communication

Frontend communicates with backend using REST APIs for:

* Authentication
* Schedule Management
* Professor Data Handling

---

## 📊 Learning Outcomes

* Built Full Stack Application
* Implemented REST APIs
* Integrated React with Express
* Used MongoDB Database
* Applied MVC architecture

---

## 🔮 Future Improvements

* AI-based schedule generation
* Email notifications
* Deployment with Docker
* Role permission enhancement
* Cloud database hosting

---

## 👨‍💻 Author

**Charan**
Full Stack Developer | React & Node.js Enthusiast

---

## 📄 License

This project is developed for educational purposes.
