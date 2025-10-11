import axios from "axios";

// Use Vite's environment variable for the backend base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ dynamically reads from .env
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

