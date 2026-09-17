import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // Point to the backend URL or dev proxy /api
  baseURL: import.meta.env.VITE_API_URL || '/api',
  // Ensure cookies are sent with requests for authentication
  withCredentials: true,
});

// Interceptor to include Bearer token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
