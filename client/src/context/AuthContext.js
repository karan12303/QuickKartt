import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set up axios interceptors for handling token expiration
  useEffect(() => {
    // Add a response interceptor
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Check if the error is due to an expired token
        if (error.response &&
            error.response.status === 401 &&
            error.response.data &&
            error.response.data.tokenExpired) {
          console.log('Token expired, logging out user');
          // Clear user info from state and localStorage
          localStorage.removeItem('userInfo');
          setUserInfo(null);

          // Redirect to login page with a message
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?expired=true';
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Set axios defaults
  useEffect(() => {
    if (userInfo && userInfo.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [userInfo]);

  // Login user with email and password
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('/api/auth/login', { email, password });

      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      throw error;
    }
  };

  // Send OTP to mobile number
  const sendOTP = async (mobile) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('/api/auth/send-otp', { mobile });

      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      throw error;
    }
  };

  // Verify OTP and login
  const verifyOTP = async (mobile, otp) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('/api/auth/verify-otp', { mobile, otp });

      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      throw error;
    }
  };

  // Register user
  const register = async (name, email, password, mobile) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        mobile,
      });

      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    // Clear any other auth-related data from localStorage if needed
    // localStorage.removeItem('cartItems'); // Uncomment if you want to clear cart on logout

    // We don't need to navigate here as we'll handle it in the Header component
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get('/api/auth/profile');

      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        loading,
        error,
        login,
        register,
        logout,
        getUserProfile,
        sendOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
