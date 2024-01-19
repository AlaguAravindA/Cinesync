import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseauth';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated, config } from 'react-spring';
import Modal from 'react-modal';

// React Spring animations
const fadeIn = {
  from: { opacity: 0, transform: 'scale(0.8)' },
  to: { opacity: 1, transform: 'scale(1)' },
  config: config.wobbly, // Adjust the animation configuration
};

// Tailwind CSS classes
const modalStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'linear-gradient(45deg, #4e54c8, #8f94fb)',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '100%',
    outline: 'none',
    color: '#fff',
  },
};

export default function Protectcomponent({ component }) {
  const [isProtected, setProtected] = useState<boolean | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setProtected(user !== null);

      // Open the login prompt if not authenticated
      if (!user) {
        setModalOpen(true);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []); // Empty dependency array to run the effect only once

  const closeModal = () => {
    setModalOpen(false);
    navigate('/login');
  };

  const modalProps = useSpring(fadeIn);

  if (isProtected === null) {
    // Show a loading state if authentication state is not determined yet
    return <div>Loading...</div>;
  }

  if (isProtected) {
    // Render the protected component
    return component;
  } else {
    // Show the login prompt with enhanced styling and animations
    return (
      <>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={{ ...modalStyles, overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
          contentLabel="Login Prompt"
        >
          <animated.div style={modalProps}>
            <h2 className="text-3xl font-bold mb-4">Login Required</h2>
            <p className="text-lg mb-6">Please log in to access this page.
            Because it has your favourite Movies on the GO</p>
            
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              onClick={closeModal}
            >
             OK
            </button>
          </animated.div>
        </Modal>
        {null /* or a placeholder component */}
      </>
    );
  }
}
