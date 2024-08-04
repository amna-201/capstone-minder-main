import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCT13SQW3CBmdfMDyPs2-HV9cmx0YU9e8c",
  authDomain: "capstone-19887.firebaseapp.com",
  projectId: "capstone-19887",
  storageBucket: "capstone-19887.appspot.com",
  messagingSenderId: "201992298565",
  appId: "1:201992298565:web:684d273ab40caed893032c",
  measurementId: "G-676ST1R9VY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };




