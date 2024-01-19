import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import './styles/Notfoundcss.css'; // Import a separate CSS file for styling

const NotFound404 = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'elastic.out(1, 0.75)' } });

    tl.from(containerRef.current, { opacity: 0, duration: 1, delay: 0.5 })
      .from('.box', { duration: 0.8, scale: 0, opacity: 0, stagger: 0.2, rotation: 360 })
      .to('.box', { duration: 0.5, y: -20, stagger: 0.1, repeat: -1, yoyo: true })
      .to('.text-9xl', { duration: 1, color: '#FF4F4F', ease: 'power4.out', repeat: -1, yoyo: true }, '-=0.5');

    return () => tl.kill(); // Kill the animation on unmount
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-9xl mb-4 text-slate-500 font-bold">404 Not Found</h1>
      <div className="flex space-x-4">
        {['🎬', '🔄'].map((symbol, index) => (
          <div key={index} className="box text-6xl font-bold text-white">
            {symbol}
          </div>
        ))}
      </div>
      <Link to={'/'}>
        <button className="back-button">Go back to Home</button>
      </Link>
      <p className="mt-4 text-gray-600">Oops! It seems like you're lost in cyberspace.</p>
    </div>
  );
};

export default NotFound404;
