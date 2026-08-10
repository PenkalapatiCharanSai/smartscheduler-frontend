// src/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://smartscheduler-backend-h1qt.onrender.com";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});