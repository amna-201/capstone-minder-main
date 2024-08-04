// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCT13SQW3CBmdfMDyPs2-HV9cmx0YU9e8c",
  authDomain: "capstone-19887.firebaseapp.com",
  projectId: "capstone-19887",
  storageBucket: "capstone-19887.appspot.com",
  messagingSenderId: "201992298565",
  appId: "1:201992298565:web:684d273ab40caed893032c",
  measurementId: "G-676ST1R9VY"
};

// تهيئة تطبيق Firebase
const app = initializeApp(firebaseConfig);

// الحصول على خدمات Firebase
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

// تصدير الخدمات
export { app, db, auth, storage, messaging };

// وظيفة لطلب إذن الإشعارات
export const requestPermission = async () => {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        try {
          const currentToken = await getToken(messaging, { vapidKey: 'BJzaSyAThQ-QC7Iuia2WWv673q9-s172edbPTu46kU5D_xvG4E' });
          if (currentToken) {
            console.log('Current token:', currentToken);
          } else {
            console.log('No registration token available.');
          }
        } catch (err) {
          console.error('An error occurred while retrieving token.', err);
        }
      } else {
        console.log('Notification permission denied.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  } else {
    console.log('Notification API is not supported.');
  }
};

// وظيفة لإرسال الإشعارات
export const sendNotification = async (token, title, body) => {
  console.error('sendNotification function needs to be implemented server-side using Firebase Admin SDK.');
};

// التعامل مع الرسائل الواردة
onMessage(messaging, (payload) => {
  console.log('Message received:', payload);
  if (Notification.permission === 'granted') {
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon
    });
  } else {
    console.log('Notification permission not granted.');
  }
});
