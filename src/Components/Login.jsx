import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import topImage from '../assets/login3.jpg'; 
import bottomImage from '../assets/login3.jpg'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home'); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full h-screen bg-culogin">
      <div className="absolute top-0 w-fit h-1/2">
        <img src={topImage} alt="top decoration" className="w-full h-full" />
      </div>
      <div className="absolute top-2/4 w-fit h-1/2">
        <img src={bottomImage} alt="bottom decoration" className="w-full h-full rotate-180" />
      </div>
      <div className="relative z-10 flex flex-col justify-center items-center w-72 gap-y-4 rounded-lg mt-48">
        <h2 className="text-2xl font-extralight italic text-center">LOGIN</h2>
        {error && <p className="text-sign4 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col items-center w-full gap-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border-4 border-sign4 rounded-3xl"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border-4 border-sign4 rounded-3xl"
          />
          <button
            type="submit"
            className="bg-sign4 text-white py-2 px-4 rounded-lg shadow-md hover:bg-pink-600 w-full"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-sign4 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
