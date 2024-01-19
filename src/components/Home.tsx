import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseauth.js';
import { onAuthStateChanged } from 'firebase/auth';
import Movies from './movies.jsx';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      // Reset shuffling flag when a new user logs in
      setHasShuffled(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // If the user is logged in and movies haven't been shuffled in this session
    if (isLoggedIn && !hasShuffled) {
      // Perform shuffling logic
      setHasShuffled(true);
    }
  }, [isLoggedIn, hasShuffled]);

  return (
    <>
      <Movies hasShuffled={hasShuffled} setHasShuffled={setHasShuffled} />
    </>
  );
}
