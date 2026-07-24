import axios from "axios";
import { STORAGE_KEYS } from "@shared/constants.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(err, fallback = "Une erreur est survenue.") {
  return (
    err.response?.data?.errors?.[0] ||
    err.response?.data?.message ||
    fallback
  );
}

export default api;
