import React, { useEffect } from 'react';
import gsap from 'gsap';

import warning from './images/posters/undraw_warning_re_eoyh.svg'

const Character = () => {
  useEffect(() => {
    // Animation using GSAP
    const character = document.getElementById('character');

    gsap.to(character, {
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
  }, []);

  return (
    <div className="character-container">
      {/* Your character's parts and animations go here */}
      <div className="character" id="character">
        <img src={warning} alt="" srcset="" />

     
      </div>
    </div>
  );
};

export default Character;
