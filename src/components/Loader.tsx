// Loader.js
import React from 'react';
import 'D:\\project_react\\moviesapp1\\src\\components\\styles\\Loader.css';

const Loader = () => {
  return (
    <div className='loader-container'>
      <div className="loader-backdrop">
        <svg className="pl" viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
              <stop offset="0%" stop-color="hsl(313,90%,55%)" />
              <stop offset="100%" stop-color="hsl(223,90%,55%)" />
            </linearGradient>
            <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(313,90%,55%)" />
              <stop offset="100%" stop-color="hsl(223,90%,55%)" />
            </linearGradient>
          </defs>
          <circle className="pl__ring" cx="50" cy="50" r="41" fill="none" stroke="url(#pl-grad1)" stroke-width="18" stroke-dasharray="0 129 0.5 129" stroke-dashoffset="0.01" stroke-linecap="round" transform="rotate(-90,50,50)" />
          <line className="pl__ball" stroke="url(#pl-grad2)" x1="50" y1="9" x2="50.01" y2="91" stroke-width="18" stroke-dasharray="0.5 82" stroke-linecap="round" />
        </svg>
      </div>
    </div>
  );
};

export default Loader;
