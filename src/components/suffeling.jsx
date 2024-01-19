import React, { createContext, useContext, useState } from 'react';

// Create a context
export const ShufflingContext = createContext();

// Define a provider component that wraps your entire application
const ShufflingProvider = ({ children }) => {
  const [shufflingState, setShufflingState] = useState({
    products: [], // Initial array of products
    hasShuffled: false, // Initial state for shuffling flag
  });

  return (
    <ShufflingContext.Provider value={{ shufflingState, setShufflingState }}>
      {children}
    </ShufflingContext.Provider>
  );
};

export default ShufflingProvider;
