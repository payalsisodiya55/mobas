import axios from 'axios';

const GROCERY_API_BASE = import.meta.env.VITE_GROCERY_API_URL || 'http://localhost:5001/api';

export const groceryAPI = axios.create({
  baseURL: GROCERY_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if needed (e.g. for auth token)
groceryAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_accessToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default groceryAPI;
