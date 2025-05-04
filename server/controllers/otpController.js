const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

// Initialize Twilio client
let twilioClient = null;

// Debug environment variables
console.log('Environment variables check:');
console.log('TWILIO_ACCOUNT_SID exists:', !!process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN exists:', !!process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_PHONE_NUMBER exists:', !!process.env.TWILIO_PHONE_NUMBER);
console.log('NODE_ENV:', process.env.NODE_ENV);

try {
  // Force initialization with the credentials from .env
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
    console.log('Twilio client initialized successfully with SID:', accountSid);
    console.log('Using Twilio phone number:', process.env.TWILIO_PHONE_NUMBER);
  } else {
    console.log('Twilio credentials missing - please check your .env file');
  }
} catch (error) {
  console.error('Error initializing Twilio client:', error);
}

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP to mobile number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    // Check if Twilio is configured
    const isTwilioConfigured = twilioClient &&
                              process.env.TWILIO_ACCOUNT_SID &&
                              process.env.TWILIO_AUTH_TOKEN &&
                              process.env.TWILIO_PHONE_NUMBER;

    // Always attempt to send SMS if credentials are provided, regardless of environment
    const shouldSendSMS = isTwilioConfigured;

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + parseInt(process.env.OTP_EXPIRY_TIME || 10));

    // Find user by mobile number or create a new one
    let user = await User.findOne({ mobile });

    if (user) {
      // Check if user is blocked or blacklisted
      if (user.status === 'blocked') {
        return res.status(403).json({
          message: 'Your account has been blocked. Please contact support.'
        });
      }

      if (user.status === 'blacklisted') {
        return res.status(403).json({
          message: 'Your account has been blacklisted. Access denied.'
        });
      }

      // Update existing user with new OTP
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // Create new user with mobile and OTP
      user = await User.create({
        name: `User-${mobile.slice(-4)}`, // Default name using last 4 digits
        mobile,
        otp,
        otpExpiry
      });
    }

    // Handle OTP sending based on Twilio configuration
    if (shouldSendSMS) {
      try {
        // Send OTP via Twilio
        console.log(`Attempting to send SMS to ${mobile} from ${process.env.TWILIO_PHONE_NUMBER}`);
        const message = await twilioClient.messages.create({
          body: `Your QuickKart verification code is: ${otp}. Valid for ${process.env.OTP_EXPIRY_TIME || 10} minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: mobile
        });
        console.log('SMS sent successfully, SID:', message.sid);

        // Always return success response
        res.status(200).json({
          message: 'OTP sent successfully to your mobile',
          mobile: mobile,
          userId: user._id,
          // Include OTP in development mode for testing
          ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
        });
      } catch (twilioError) {
        console.error('Twilio error:', twilioError);
        console.error('Twilio error details:', JSON.stringify({
          code: twilioError.code,
          status: twilioError.status,
          moreInfo: twilioError.moreInfo,
          details: twilioError.details
        }, null, 2));

        // Check for Twilio trial account limitations
        if (twilioError.code === 21408) {
          // This is the error code for "Permission to send an SMS has not been enabled for the region"
          // This happens with trial accounts when sending to unverified numbers
          console.log('Trial account limitation detected - phone number not verified in Twilio');

          // Log more details about the phone number
          console.log('Attempted to send to:', mobile);
          console.log('Make sure this exact number is verified in your Twilio account');

          if (process.env.NODE_ENV === 'development') {
            // In development mode, return success with the OTP for testing
            return res.status(200).json({
              message: 'OTP generated successfully. Make sure your exact phone number is verified in Twilio.',
              mobile: mobile,
              userId: user._id,
              devOtp: otp,
              trialAccountLimitation: true,
              verificationNeeded: 'Please verify your exact phone number (including country code) in your Twilio account.'
            });
          }
        }

        // For other errors or in production mode
        if (process.env.NODE_ENV === 'development') {
          // In development, always return the OTP even on error
          res.status(200).json({
            message: 'OTP generated for testing (SMS failed but development mode enabled)',
            mobile: mobile,
            userId: user._id,
            devOtp: otp,
            twilioError: {
              message: twilioError.message,
              code: twilioError.code
            }
          });
        } else {
          // In production, return error
          res.status(500).json({
            message: 'Failed to send OTP SMS. Please try again or contact support.',
            error: twilioError.message
          });
        }
      }
    } else {
      // Twilio not configured
      if (process.env.NODE_ENV === 'development') {
        // In development, return OTP for testing
        res.status(200).json({
          message: 'OTP generated successfully (SMS service not configured - development mode)',
          mobile: mobile,
          userId: user._id,
          devOtp: otp // Include OTP in development mode
        });
      } else {
        // In production, we should not proceed without Twilio
        res.status(500).json({
          message: 'SMS service not configured. Please contact administrator.',
          error: 'Twilio credentials not properly configured'
        });
      }
    }
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({
      message: 'Server error while sending OTP',
      error: error.message
    });
  }
};

// @desc    Verify OTP and login user
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }

    // Find user by mobile number
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check if user is blocked or blacklisted
    if (user.status === 'blocked') {
      return res.status(403).json({
        message: 'Your account has been blocked. Please contact support.'
      });
    }

    if (user.status === 'blacklisted') {
      return res.status(403).json({
        message: 'Your account has been blacklisted. Access denied.'
      });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Return user info with token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email || null,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      message: 'Server error while verifying OTP',
      error: error.message
    });
  }
};

module.exports = { sendOTP, verifyOTP };
