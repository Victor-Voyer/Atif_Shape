import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("atif_token");
  if (token) {
    // Le back utilise très probablement un Bearer token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


