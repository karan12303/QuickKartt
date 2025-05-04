import React, { useState, useEffect } from 'react';
import { Button, Toast } from 'react-bootstrap';
import { FaDownload, FaMobileAlt } from 'react-icons/fa';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallPrompt(true);
    });

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      // Hide the install button
      setShowInstallPrompt(false);
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      // Log the installation to analytics
      console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = () => {
    // Hide the install button
    setShowInstallPrompt(false);
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        // Show the install button again
        setShowInstallPrompt(true);
      }
      // Clear the deferredPrompt
      setDeferredPrompt(null);
    });
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <Toast 
      className="position-fixed bottom-0 end-0 m-3 z-50"
      style={{ zIndex: 9999 }}
      onClose={() => setShowInstallPrompt(false)}
    >
      <Toast.Header>
        <FaMobileAlt className="me-2 text-primary" />
        <strong className="me-auto">Install QuickKart</strong>
      </Toast.Header>
      <Toast.Body>
        <p className="mb-2">Install our app for a better experience!</p>
        <div className="d-flex justify-content-end">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            className="me-2"
            onClick={() => setShowInstallPrompt(false)}
          >
            Not now
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleInstallClick}
          >
            <FaDownload className="me-1" /> Install
          </Button>
        </div>
      </Toast.Body>
    </Toast>
  );
};

export default InstallPWA;
