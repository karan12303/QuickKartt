import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';

// Real PayPal SDK integration
const PayPalButton = ({ amount, orderId, onSuccess, onError }) => {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    // Fetch PayPal client ID from server
    const getPayPalClientId = async () => {
      try {
        console.log('Fetching PayPal client ID from:', API_ENDPOINTS.PAYPAL.CONFIG);
        const { data } = await axios.get(API_ENDPOINTS.PAYPAL.CONFIG);

        console.log('PayPal client ID response:', data);

        if (!data || !data.clientId) {
          console.error('Invalid response from PayPal config endpoint:', data);
          onError('Invalid PayPal configuration response');
          return null;
        }

        return data.clientId;
      } catch (error) {
        console.error('Error fetching PayPal client ID:', error);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
        onError('Could not load PayPal configuration: ' + (error.message || 'Unknown error'));
        return null;
      }
    };

    // Add PayPal Script
    const addPayPalScript = async () => {
      try {
        // Get client ID from server
        let paypalClientId = await getPayPalClientId();

        // If server request fails, try to use client-side environment variable as fallback
        if (!paypalClientId) {
          if (process.env.REACT_APP_PAYPAL_CLIENT_ID && process.env.REACT_APP_PAYPAL_CLIENT_ID !== 'YOUR_PAYPAL_CLIENT_ID') {
            console.log('Using fallback client ID from environment variable');
            paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
          } else {
            // Hardcoded fallback as last resort (same as in .env file)
            console.log('Using hardcoded fallback client ID');
            paypalClientId = 'AUMuI45crLr_Kr1snunsHP7Pm6qya_bqSyGvEnsSm8-Xu5V-lHW1ZQHLS8xrjkPnru2006gx8yu3SURV';
          }
        }

        if (!paypalClientId) {
          throw new Error('PayPal client ID not available from server or environment');
        }

        console.log('Using PayPal client ID:', paypalClientId.substring(0, 10) + '...');

        // Clear existing script if any
        const existingScript = document.getElementById('paypal-script');
        if (existingScript) {
          existingScript.remove();
        }

        // Create script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'paypal-script';
        script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD&disable-funding=credit,card`;
        script.async = true;

        // Set up onload handler
        script.onload = () => {
          console.log('PayPal SDK loaded successfully');
          setSdkReady(true);
        };

        // Set up error handler
        script.onerror = (err) => {
          console.error('Error loading PayPal SDK:', err);
          onError('Failed to load PayPal SDK. Please try refreshing the page.');
        };

        // Add script to document
        document.body.appendChild(script);
      } catch (error) {
        console.error('PayPal SDK could not be loaded:', error);
        onError(error.message || 'Failed to load PayPal');
      }
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, [onError]);

  if (!sdkReady) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading PayPal...</span>
        </Spinner>
        <p className="mt-2">Loading PayPal...</p>
      </div>
    );
  }

  // Check if PayPal SDK is properly loaded
  if (!window.paypal || !window.paypal.Buttons) {
    console.error('PayPal SDK not properly loaded');
    return (
      <div className="alert alert-danger">
        <p>PayPal could not be loaded. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div>
      <div id="paypal-button-container" ref={(el) => {
        // Only render the PayPal buttons once when the container is first created
        if (el && !el.hasChildNodes()) {
          try {
            const buttonInstance = window.paypal.Buttons({
              // Validate the amount to ensure it's a valid number
              createOrder: (_, actions) => {
                // Ensure amount is a valid number
                const numericAmount = parseFloat(amount);
                if (isNaN(numericAmount) || numericAmount <= 0) {
                  throw new Error(`Invalid amount: ${amount}`);
                }

                // Create a unique invoice ID by combining the order ID with a timestamp
                // This prevents the DUPLICATE_INVOICE_ID error when a user tries to pay multiple times
                const uniqueInvoiceId = `${orderId || 'unknown'}-${Date.now()}`;

                console.log('Creating PayPal order with unique invoice ID:', uniqueInvoiceId);

                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: 'USD',
                        value: numericAmount.toFixed(2),
                      },
                      // Use the unique invoice ID for PayPal, but keep the original order ID in custom_id
                      invoice_id: uniqueInvoiceId,
                      custom_id: orderId || 'unknown',
                    },
                  ],
                });
              },
              onApprove: (_, actions) => {
                return actions.order.capture().then((details) => {
                  // Call the success callback with payment details
                  onSuccess({
                    id: details.id,
                    status: details.status,
                    update_time: details.update_time,
                    email_address: details.payer.email_address,
                  });
                });
              },
              onError: (err) => {
                console.error('PayPal Error:', err);
                onError(typeof err === 'string' ? err : err.toString());
              },
              onCancel: () => {
                console.log('Payment cancelled by user');
              },
              style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal'
              }
            });

            // Check if the button can be rendered
            if (buttonInstance.isEligible && buttonInstance.isEligible()) {
              buttonInstance.render(el).catch(err => {
                console.error('PayPal button render error:', err);
                onError(`Failed to render PayPal button: ${err.message || 'Unknown error'}`);
              });
            } else {
              console.error('PayPal button is not eligible for rendering');
              onError('PayPal is not available for this transaction. Please try another payment method.');
            }
          } catch (err) {
            console.error('Error setting up PayPal button:', err);
            onError(`Failed to set up PayPal: ${err.message || 'Unknown error'}`);

            // Add a fallback error message to the DOM
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.textContent = 'PayPal encountered an error. Please try another payment method.';
            el.appendChild(errorDiv);
          }
        }
      }} />
    </div>
  );
};

export default PayPalButton;
