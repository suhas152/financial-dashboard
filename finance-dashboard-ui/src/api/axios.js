import axios from "axios";

const BASE_URL = "http://localhost:2026";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
