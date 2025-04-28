/**
 * Service Worker Registration Script
 * Registers the service worker for PWA functionality
 */

// Only register service worker in production and https environments
const shouldRegisterServiceWorker = () => {
  return (
    // Check for production environment
    (process.env.NODE_ENV === 'production' || import.meta.env?.PROD) &&
    // Check for service worker support
    'serviceWorker' in navigator &&
    // Check for HTTPS (or localhost which is treated as secure)
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
  );
};

// Log service worker status
const logRegistrationStatus = (status, details = '') => {
  if (status === 'success') {
    console.log(
      '%cService Worker registered successfully! 🎉',
      'color: green; font-weight: bold;',
      details
    );
  } else if (status === 'error') {
    console.error(
      '%cService Worker registration failed 😭',
      'color: red; font-weight: bold;',
      details
    );
  } else {
    console.log(`%cService Worker: ${status}`, 'color: blue;', details);
  }
};

// Register the service worker
const registerServiceWorker = async () => {
  if (!shouldRegisterServiceWorker()) {
    logRegistrationStatus('skipped', 'Not in production or https environment');
    return;
  }

  try {
    logRegistrationStatus('registering', 'Starting registration process...');
    
    // Wait for the page to fully load
    window.addEventListener('load', async () => {
      try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        
        logRegistrationStatus('success', {
          scope: registration.scope
        });
        
        // Handle updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available, prompt for page refresh
                logRegistrationStatus(
                  'update available',
                  'New version available! Please refresh the page.'
                );
                
                // Show notification to user about update
                if (window.confirm('New version available! Reload now?')) {
                  window.location.reload();
                }
              } else {
                // Content is cached for offline use
                logRegistrationStatus(
                  'cached',
                  'Content is now available offline!'
                );
              }
            }
          };
        };
      } catch (error) {
        logRegistrationStatus('error', error);
      }
    });
  } catch (error) {
    logRegistrationStatus('error', error);
  }
};

// Execute registration
registerServiceWorker();

export default registerServiceWorker;
