import axios from 'axios';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: 'https://myflixapplication-paddy-fac687c8aed3.herokuapp.com', // Replace with your base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;