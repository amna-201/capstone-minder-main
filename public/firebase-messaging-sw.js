importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCT13SQW3CBmdfMDyPs2-HV9cmx0YU9e8c",
  authDomain: "capstone-19887.firebaseapp.com",
  projectId: "capstone-19887",
  storageBucket: "capstone-19887.appspot.com",
  messagingSenderId: "201992298565",
  appId: "1:201992298565:web:684d273ab40caed893032c",
  measurementId: "G-676ST1R9VY"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon
  });
});
