import axios from "axios";
import { auth } from "../config/firebase";

// This instance is for our custom Flask backend
const backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Firebase Auth token automatically
backend.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error getting auth token", error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default backend;
