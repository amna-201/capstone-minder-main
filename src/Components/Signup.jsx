import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import signupImage from '../assets/sing.jpg';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/home'); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cusign relative">
      <div className="bg-white bg-opacity-100  border-4  border-sign4 p-8 rounded-lg shadow-lg max-w-sm w-3/4 z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-sign4">Sign Up</h2>
        {error && <p className="text-sign4 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="flex flex-col space-y-5 ">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-3 border border-sign4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-3 border border-sign4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-sign4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-sign4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="bg-sign4 text-white py-2 px-4 rounded-lg shadow-md hover:bg-pink-600"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sign4 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img src={signupImage} alt="Signup decoration" className="w-full h-full object-cover opacity-" />
      </div>
    </div>
  );
}

export default Signup;
