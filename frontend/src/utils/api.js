import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // Point to the backend URL. In development, we use localhost:5000 (or whatever port the backend runs on)
  baseURL: import.meta.env.VITE_API_URL,
  // Ensure cookies are sent with requests for authentication
  withCredentials: true,
});

export default api;
