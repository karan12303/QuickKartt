import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/custom.css'; // Import our custom styles
import './dark-mode-enhancements.css'; // Import dark mode enhancements
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { ThemeProvider } from './context/ThemeContext';
import axios from 'axios';
import { API_BASE_URL } from './config/apiConfig';

// Set base URL for axios
axios.defaults.baseURL = API_BASE_URL;

// Configure axios defaults
axios.defaults.timeout = 15000; // 15 seconds timeout
axios.defaults.withCredentials = true; // Enable cookies and authentication headers

// Add request interceptor for error handling
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  response => {
    // Any status code within the range of 2xx
    return response;
  },
  error => {
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network Error: Please check your connection or the server might be down');
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout: The server took too long to respond');
    }

    // Handle other errors
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <CompareProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </CompareProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: registration => {
    const waitingServiceWorker = registration.waiting;
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", event => {
        if (event.target.state === "activated") {
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  }
});
