/**
 * Vercel API Configuration
 * This file provides API URL configuration for Vercel deployment
 */

// Determine if we're in production (Vercel) or development
const isProduction = process.env.NODE_ENV === 'production';

// Base API URL - use absolute URL in production for Vercel deployment
export const API_BASE_URL = isProduction
  ? window.location.origin + '/api'
  : process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Export for use in apiConfig.js
export default API_BASE_URL;
