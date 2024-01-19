import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from '@heroicons/react/20/solid';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsVisible(scrollTop > 100); // Change 100 to your preferred scroll position
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
    className={`fixed bottom-4 right-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isVisible ? '' : 'hidden'}`}

    >
      <button
        onClick={scrollToTop}
        className="bg-blue-500 text-white p-2 rounded-full focus:outline-none"
      >
        <ArrowUpIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default BackToTopButton;
