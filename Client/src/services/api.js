import axios from "axios";

// Configure the base URL for your backend
const API = axios.create({
  baseURL: "https://billing-project-g0o7.onrender.com/api", // IMPORTANT: Match your backend port
});

// Interceptor to attach the token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
