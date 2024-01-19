// Footer.js

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-transparent text-white  p-4 text-center" >
      <div className="container mx-auto" >
        <p className="text-sm">
          
        CinéSync App &copy; {new Date().getFullYear()}
        
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;
