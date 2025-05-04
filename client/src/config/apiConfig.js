/**
 * API Configuration
 * This file centralizes all API URL configuration to ensure proper URL formatting
 * in both development and production environments.
 */

// Import the base URL from vercelConfig
import { API_BASE_URL as BASE_URL } from './vercelConfig';

// Export the API base URL
export const API_BASE_URL = BASE_URL;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    SEND_OTP: `${API_BASE_URL}/api/auth/send-otp`,
    VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
  },

  // Product endpoints
  PRODUCTS: {
    LIST: `${API_BASE_URL}/api/products`,
    DETAIL: (id) => `${API_BASE_URL}/api/products/${id}`,
    SEARCH: `${API_BASE_URL}/api/products/search`,
  },

  // Order endpoints
  ORDERS: {
    LIST: `${API_BASE_URL}/api/orders`,
    DETAIL: (id) => `${API_BASE_URL}/api/orders/${id}`,
    CREATE: `${API_BASE_URL}/api/orders`,
    UPDATE_TO_PAID: (id) => `${API_BASE_URL}/api/orders/${id}/pay`,
    UPDATE_TO_DELIVERED: (id) => `${API_BASE_URL}/api/orders/${id}/deliver`,
  },

  // User endpoints
  USERS: {
    LIST: `${API_BASE_URL}/api/users`,
    DETAIL: (id) => `${API_BASE_URL}/api/users/${id}`,
    ADDRESSES: `${API_BASE_URL}/api/users/addresses`,
  },

  // Wishlist endpoints
  WISHLIST: {
    LIST: `${API_BASE_URL}/api/wishlist`,
    ADD: `${API_BASE_URL}/api/wishlist`,
    REMOVE: (id) => `${API_BASE_URL}/api/wishlist/${id}`,
  },

  // Analytics endpoints
  ANALYTICS: {
    DASHBOARD: `${API_BASE_URL}/api/analytics/dashboard`,
    SALES: `${API_BASE_URL}/api/analytics/sales`,
    PRODUCTS: `${API_BASE_URL}/api/analytics/products`,
  },

  // Inventory endpoints
  INVENTORY: {
    LIST: `${API_BASE_URL}/api/inventory`,
    UPDATE: (id) => `${API_BASE_URL}/api/inventory/${id}`,
  },

  // Reviews endpoints
  REVIEWS: {
    LIST: (productId) => `${API_BASE_URL}/api/reviews/${productId}`,
    CREATE: `${API_BASE_URL}/api/reviews`,
  },

  // PayPal endpoints
  PAYPAL: {
    CONFIG: `${API_BASE_URL}/api/paypal/config`,
    WEBHOOK: `${API_BASE_URL}/api/paypal/webhook`,
  },
};

// Create axios config with proper base URL
export const getAxiosConfig = (token = null) => {
  const config = {
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export default API_ENDPOINTS;
