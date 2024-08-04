import React from 'react';
import loadingGif from '../assets/dod.gif'; 

function Loading() {
  return (
    <div className="w-screen h-screen bg-cuLoading flex items-center justify-center">
      <img src={loadingGif} alt="Loading..." className=' '  />
    </div>
  );
}

export default Loading;
