import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { messaging } from './firebaseConfig';
import { getToken } from 'firebase/messaging'; 

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);

      return Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');

          return getToken(messaging, { vapidKey: 'BJ8idA92hcIJwoc6wylP4DexvPUjLeKMWsykbAUZlsZflW5_dVpXTS70NVMkHculXTIhOLWmncCEMp1BZVz2Fao' }).then((currentToken) => {
            if (currentToken) {
              console.log('FCM Token:', currentToken);
            } else {
              console.log('No registration token available.');
            }
          }).catch(err => {
            console.error('An error occurred while retrieving token.', err);
          });
        } else {
          console.log('Notification permission denied.');
        }
      });
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
