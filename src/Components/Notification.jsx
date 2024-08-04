import { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/messaging';

const Notification = () => {
  useEffect(() => {
    const messaging = firebase.messaging();

    messaging.requestPermission()
      .then(() => messaging.getToken())
      .then(token => {
        console.log('Notification permission granted. Token:', token);
      })
      .catch(error => {
        console.error('Error getting permission or token:', error);
      });

    const setupNotifications = () => {
      const now = new Date();
      const medicationTime = new Date(now.getTime() + 5 * 60000); 

      sendNotification(medicationTime, 'وقت تناول الدواء', 'تذكر تناول حبة الدواء.');

      const reminderTime = new Date(medicationTime.getTime() + 10 * 60000); 
      setTimeout(() => {
        if (!localStorage.getItem('medicationTaken')) {
          sendNotification(reminderTime, 'تذكير تناول الدواء', 'لم تقم بتناول حبة الدواء بعد.');
        }
      }, 10 * 60000);
    };

    setupNotifications();
  }, []);

  const sendNotification = (time, title, body) => {
    const notificationOptions = {
      body,
      icon: 'https://path/to/icon.png',
      tag: 'medication-reminder',
    };

    const now = new Date();
    if (now >= time) {
      new Notification(title, notificationOptions);
    } else {
      setTimeout(() => new Notification(title, notificationOptions), time - now);
    }
  };

  return null;
};

export default Notification;
