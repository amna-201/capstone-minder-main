import React, { useState, useEffect, useRef } from 'react';
import header from '../assets/login.png';
import logo from '../assets/logo.png';
import sye from '../assets/allergy-shots.png';

const Header = () => { 

  const [isClicked, setIsClicked] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [hoverTimeoutId, setHoverTimeoutId] = useState(null);
  const syringeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (hoverTimeoutId) {
        clearTimeout(hoverTimeoutId);
      }
    };
  }, [intervalId, hoverTimeoutId]);

  const handleMouseEnter = () => {
    if (!isClicked) {
      const id = setInterval(moveRandomly, 500);
      setIntervalId(id);
      if (hoverTimeoutId) {
        clearTimeout(hoverTimeoutId);
        setHoverTimeoutId(null);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isClicked) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      const id = setTimeout(() => {
        moveToOriginalPosition();
      }, 5000);
      setHoverTimeoutId(id);
    }
  };

  const moveRandomly = () => {
    const syringe = syringeRef.current;
    const rect = syringe.getBoundingClientRect();
    const logoRect = document.querySelector('.logo').getBoundingClientRect();

    if (
      rect.top <= logoRect.top + 10 && rect.top >= logoRect.top - 10 &&
      rect.left <= logoRect.left + 10 && rect.left >= logoRect.left - 10
    ) {
      clearInterval(intervalId);
      setIntervalId(null);
      return;
    }

    const randomX = Math.random() * 1000 - 500; 
    const randomY = Math.random() * 1000 - 500; 
    syringe.style.transform = `translate(${randomX}px, ${randomY}px)`;
  };

  const moveToOriginalPosition = () => {
    const syringe = syringeRef.current;
    syringe.style.transition = 'transform 1s ease';
    syringe.style.transform = 'translate(0, 0)';
    setIsClicked(false);
  };

  return (
    <div className="w-screen h-1/2 flex flex-col xl:h-screen xl:flex-row justify-center items-center bg-culogin ">
      <div className="absolute top-2 left-2 w-1/4 lg:w-1/12">
        <img src={logo} alt="Company Logo" className="logo w-full"/>
      </div>
      <div className="md:w-1/3 mt-10 md:mt-40 flex flex-col items-center">
        <h1 className="text-6xl md:text-9xl text-sign4 text-opacity-80 shadow-black text-center">MINDER</h1>
        <p className="text-2xl md:text-4xl text-white text-opacity-80 shadow-black text-center mt-4">REMINDER EASILY WITH US</p>
        <div className='mt-10 md:mt-20 w-full flex justify-center'>
          <img 
            src={sye} 
            ref={syringeRef}
            className="syringe hover:antialiased w-1/4 md:w-3/12" 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            alt="Syringe"
          />
        </div>
      </div>
      <div className="w-full md:w-2/3 hidden xl:block">
        <img src={header} alt="Reminder" className=" ml-auto w-full"/>
      </div>
    </div>
  );
};

export default Header;