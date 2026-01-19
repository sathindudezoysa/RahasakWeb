import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

// Create axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token to all requests
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


export default API;