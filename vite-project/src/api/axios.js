import axios from 'axios';

const API = axios.create({
  baseURL: 'https://blogapp-production-1372.up.railway.app/api',
});

// Har request mein token automatically attach karo
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;