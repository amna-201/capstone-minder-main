import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import back from '../assets/back.png';
import img1 from '../assets/firstaid.png';
import img2 from '../assets/heart.png';
import img3 from '../assets/headphone.png';
import img4 from '../assets/temp.png';
import img5 from '../assets/wood.png';

function GetStarted() {
  return (
    <div className="icons-container mb-6 w-full h-screen flex flex-col justify-between items-center bg-green-300">
      <div className="relative flex flex-col items-center justify-center h-3/4 w-full bg-green-300">
        <img src={back} alt="back" className="absolute inset-0 object-cover w-full h-full" />
        <img src={img1} alt="img1" className="relative z-10 w-1/4 h-auto mb-6" />
        <img src={img2} alt="img2" className="absolute top-4 left-4 w-1/12 h-auto" />
        <img src={img3} alt="img3" className="absolute top-4 right-4 w-1/12 h-auto" />
        <img src={img4} alt="img4" className="absolute bottom-4 left-4 w-1/12 h-auto" />
        <img src={img5} alt="img5" className="absolute bottom-4 right-4 w-1/12 h-auto" />
      </div>
      <div className="bg-white backdrop-blur-md h-1/4 w-3/4 md:w-1/4 rounded-lg shadow-lg text-center flex flex-col justify-center items-center mb-8 z-10">
        <img src={logo} alt="logo" className="h-1/2 mb-4" />
        <Link to="/login" className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg shadow-md hover:bg-green-600">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default GetStarted;
