import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Character from './character';
import warning from './images/posters/undraw_warning_re_eoyh.svg'

export default function WatchlistNotFound() {
  const fadeInAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 }, // Adjust the duration as needed
  });

 

  return (
    <>

<div className="flex flex-col  h-screen">
  <animated.div style={fadeInAnimation} className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md mb-4">
    <div className="flex items-center">
    
      <div className="ml-2">
        <p className="text-sm leading-5 font-medium w-auto">
          Your watchlist is currently empty. <span className="text-gray-600">Add items to start tracking.</span>
        </p>
      </div>
    </div>
  </animated.div>
  <img className='mx-8 sm:mx-16 md:mx-32 lg:mx-48 xl:mx-56' src={warning} alt="" />
</div>


  
   
    </>
  );
}
