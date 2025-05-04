require('dotenv').config();
const path = require('path');

console.log('Checking PayPal Configuration...');
console.log('------------------------------');

// Check if .env file exists
const fs = require('fs');
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const paypalLines = envContent.split('\n').filter(line => line.includes('PAYPAL_'));
    
    if (paypalLines.length > 0) {
      console.log('✅ PayPal configuration found in .env file:');
      paypalLines.forEach(line => {
        const [key, value] = line.split('=');
        if (value && value.trim()) {
          console.log(`   ${key} = ${value.substring(0, 10)}...`);
        } else {
          console.log(`   ❌ ${key} is empty`);
        }
      });
    } else {
      console.log('❌ No PayPal configuration found in .env file');
    }
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
  }
} else {
  console.log('❌ .env file not found at:', envPath);
}

// Check environment variables
console.log('\nEnvironment Variables:');
console.log('------------------------------');

if (process.env.PAYPAL_CLIENT_ID) {
  console.log(`✅ PAYPAL_CLIENT_ID = ${process.env.PAYPAL_CLIENT_ID.substring(0, 10)}...`);
} else {
  console.log('❌ PAYPAL_CLIENT_ID is not set in environment');
}

if (process.env.PAYPAL_CLIENT_SECRET) {
  console.log(`✅ PAYPAL_CLIENT_SECRET = ${process.env.PAYPAL_CLIENT_SECRET.substring(0, 10)}...`);
} else {
  console.log('❌ PAYPAL_CLIENT_SECRET is not set in environment');
}

if (process.env.PAYPAL_MODE) {
  console.log(`✅ PAYPAL_MODE = ${process.env.PAYPAL_MODE}`);
} else {
  console.log('❌ PAYPAL_MODE is not set in environment');
}

console.log('\nTest API Response:');
console.log('------------------------------');

// Create a mock Express response to test the controller
const mockResponse = {
  json: (data) => {
    console.log('API would respond with:', data);
    return mockResponse;
  },
  status: (code) => {
    console.log('Status code:', code);
    return mockResponse;
  }
};

// Import and test the controller
try {
  const { getPayPalClientId } = require('./controllers/paypalController');
  getPayPalClientId({ /* mock request */ }, mockResponse);
} catch (error) {
  console.error('❌ Error testing controller:', error.message);
}

console.log('\nPayPal Configuration Check Complete');
