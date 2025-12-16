import axios from "axios";

// Configure the base URL for your backend
const API = axios.create({
  baseURL: "http://localhost:5000/api", // IMPORTANT: Match your backend port
});

// Interceptor to attach the token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
