import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token to outgoing requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('alumni_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept 401s to handle logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear and optionally redirect
      if (localStorage.getItem('alumni_token')) {
        localStorage.removeItem('alumni_token');
        localStorage.removeItem('alumni_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
