import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Create an instance of axios with the base URL from environment variables
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing userInfo from localStorage:', error);
      }
    }

    // Ensure all URLs are absolute when in production
    if (process.env.NODE_ENV === 'production' && !config.url.startsWith('http')) {
      // If the URL is not absolute and doesn't start with the base URL, prepend the base URL
      if (!config.url.startsWith(API_BASE_URL) && !config.url.startsWith('/')) {
        config.url = `${API_BASE_URL}/${config.url}`;
      } else if (config.url.startsWith('/') && !config.url.startsWith(API_BASE_URL)) {
        // If the URL starts with a slash but not with the base URL, replace the slash with the base URL
        config.url = `${API_BASE_URL}${config.url}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your internet connection.'));
    }

    // Log the error for debugging
    console.error('API Error:', error.response?.data || error.message);

    return Promise.reject(error);
  }
);

export default api;
