/**
 * Netlify Build Script
 * This script runs before the build to ensure all environment variables are properly set
 */

const fs = require('fs');
const path = require('path');

// Check if we're in a Netlify environment
const isNetlify = process.env.NETLIFY === 'true';

console.log('Running pre-build checks...');

// Create a .env file if it doesn't exist
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('Creating .env file from .env.production...');
  
  try {
    // Copy .env.production to .env
    if (fs.existsSync(path.join(__dirname, '.env.production'))) {
      fs.copyFileSync(
        path.join(__dirname, '.env.production'),
        path.join(__dirname, '.env')
      );
      console.log('Successfully created .env file from .env.production');
    } else {
      console.log('No .env.production file found, creating empty .env file');
      fs.writeFileSync(path.join(__dirname, '.env'), '');
    }
  } catch (error) {
    console.error('Error creating .env file:', error);
  }
}

// Ensure API URL is set
if (!process.env.REACT_APP_API_URL && isNetlify) {
  console.warn('⚠️ REACT_APP_API_URL is not set in Netlify environment variables!');
  console.warn('Please set this in your Netlify dashboard under Site settings > Build & deploy > Environment');
}

// Check for Google Maps API key
if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY && isNetlify) {
  console.warn('⚠️ REACT_APP_GOOGLE_MAPS_API_KEY is not set in Netlify environment variables!');
}

console.log('Pre-build checks completed.');
