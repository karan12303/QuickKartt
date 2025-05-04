import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import Message from './Message';
import Loader from './Loader';

const OTPLoginForm = ({ onLoginSuccess }) => {
  const { loading, error, sendOTP, verifyOTP } = useContext(AuthContext);

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [devOtp, setDevOtp] = useState(''); // For development mode only

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const data = await sendOTP(mobile);
      setOtpSent(true);

      console.log('OTP Response:', data); // Log the response for debugging

      // For development mode or trial account limitations
      if (data.devOtp) {
        setDevOtp(data.devOtp);

        // Check if this is a trial account limitation
        if (data.trialAccountLimitation) {
          setOtpMessage(`${data.message} Your OTP is: ${data.devOtp}`);
        } else {
          setOtpMessage(`OTP sent successfully! In development mode, your OTP is: ${data.devOtp}`);
        }
      } else {
        setOtpMessage('OTP sent successfully! Please check your phone.');
      }
    } catch (error) {
      // Error is handled in the context
      console.error('OTP Send Error:', error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP(mobile, otp);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      // Error is handled in the context
    }
  };

  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      {otpMessage && <Alert variant="info">{otpMessage}</Alert>}
      {loading && <Loader />}

      {!otpSent ? (
        <Form onSubmit={handleSendOTP}>
          <Form.Group controlId="mobile" className="my-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              Enter your phone number with country code (e.g., +1XXXXXXXXXX for US).
              <br />
              <strong>Important:</strong> With a Twilio trial account, this must be exactly the same number you verified in Twilio.
            </Form.Text>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-3">
            Send OTP
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handleVerifyOTP}>
          <Form.Group controlId="otp" className="my-3">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            {devOtp && (
              <Alert variant="info" className="mt-2 mb-3">
                <strong>Development Mode:</strong> Your OTP is <span className="fs-5 fw-bold">{devOtp}</span>

                <div className="mt-2 small">
                  <strong>Note:</strong> With a Twilio trial account, you can only send SMS to verified phone numbers.
                  <br />
                  If you've verified your number but still don't receive SMS:
                  <ul className="mb-0 mt-1">
                    <li>Make sure you entered <strong>exactly</strong> the same number you verified (including country code)</li>
                    <li>Check that your Twilio account is active and has available credits</li>
                    <li>Try using the format <strong>+[country code][number]</strong> with no spaces or dashes</li>
                  </ul>
                </div>
              </Alert>
            )}
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button
              type="button"
              variant="outline-secondary"
              className="my-3"
              onClick={() => {
                setOtpSent(false);
                setOtpMessage('');
                setDevOtp('');
              }}
            >
              Back
            </Button>
            <Button type="submit" variant="primary" className="my-3">
              Verify & Login
            </Button>
          </div>
        </Form>
      )}
    </>
  );
};

export default OTPLoginForm;
