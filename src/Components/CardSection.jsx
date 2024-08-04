import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import breath from '../assets/internet.png';
import comu from '../assets/weather-removebg-preview.png';
import timer from '../assets/first-aid-kit.png';

const CardSection = () => {
  return (<div className=' w-screen h-1/2 flex justify-center items-center md:h-full'>
    <div className="w-3/4  h-screen flex flex-col  md:flex-row justify-center items-center  md:space-y-0 md:space-x-5">
      <div className="w-3/4 md:w-1/2 h-full flex flex-col justify-center items-center space-y-5 mt-10">
        <div className="flip-card flex justify-center w-full md:w-3/4 h-1/2 md:h-3/4 items-center">
          <div className="flip-card-inner bg-card3 rounded-3xl w-full h-full">
            <div className="flip-card-front flex justify-center items-center w-full h-full">
              <img src={breath} alt="Icon4" className="h-3/4  " />
            </div>
            <div className="flip-card-back flex justify-center items-center w-full h-full">
            <Link to="/page2" className="flip-card-inner w-3/4 h-3/4 bg-card3 text-white flex flex-col justify-center items-center md:h-full md:w-full">
                <h1 className='blur-sm'>for add reminder medicain</h1>
                <p className='blur-none'>and you can save the وصفه from doctor</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="flip-card flex justify-center w-full md:w-3/4 h-1/2 md:h-3/4">
          <div className="flip-card-inner bg-card2 rounded-3xl w-full h-full">
            <div className="flip-card-front flex justify-center items-center w-full h-full">
              <img src={comu} alt="Icon3" className="h-4/4 " />
            </div>
            <div className="flip-card-back flex justify-cente  items-center w-full h-full">
            <Link to="/page3" className="flip-card-inner w-3/4 h-3/4 bg-card2 text-white flex flex-col justify-center items-center md:h-full md:w-full">
                <h1 className='blur-sm'>for add reminder medicain</h1>
                <p className='blur-none'>and you can save the وصفه from doctor</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-3/4 md:w-1/2 h-full flex justify-center items-center">
        <div className="flip-card flex justify-center w-full md:w-3/4 h-1/2 md:h-3/4 items-center">
          <div className="flip-card-inner bg-card1 rounded-3xl w-full h-full">
            <div className="flip-card-front flex justify-center items-center w-full h-full">
              <img src={timer} alt="Icon4" className="h-3/4" />
            </div>
            <div className="flip-card-back flex justify-center items-center w-full h-full">
              <Link to="/time" className="flip-card-inner w-3/4 h-3/4 bg-card1 text-white flex flex-col justify-center items-center md:h-full md:w-full">
                <h1 className='blur-sm'>for add reminder medicain</h1>
                <p className='blur-none'>and you can save the وصفه from doctor</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div></div>
  );
};

export default CardSection;
