import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth, messaging, requestPermission } from './firebaseConfig';
import Home from './Components/Home';
import Loading from './Components/Loading';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Page2 from './Pages/Page2';
import Page3 from './Pages/Page3';
import Time from './Pages/Time';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser || null);
          setTimeout(() => {
            setLoading(false);
            resolve();
          }, 3000); // تأخير 3 ثواني
        });

        return () => unsubscribe();
      });
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleNotificationSetup = async () => {
      if (user) {
        await requestPermission(); 
        try {
          const token = await getToken(messaging, { vapidKey: 'BJzaSyAThQ-QC7Iuia2WWv673q9-s172edbPTu46kU5D_xvG4E' }); 
          if (token) {
            await setDoc(doc(db, 'users', user.uid), { fcmToken: token }, { merge: true });
            console.log('Token saved to Firestore for user:', user.uid);
          }
        } catch (error) {
          console.error('Error getting token:', error);
        }
      }
    };

    handleNotificationSetup();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/page2" element={user ? <Page2 /> : <Navigate to="/login" />} />
      <Route path="/page3" element={user ? <Page3 /> : <Navigate to="/login" />} />
      <Route path="/time" element={user ? <Time /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default App;
