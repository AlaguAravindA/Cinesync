import React, { useState, useEffect, useContext } from 'react';
import MovieCard from './MovieCard.js';
import Pagination from './Pagination.js';
import BackToTopButton from './backtotop.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseauth.js';
import Loader from './Loader.tsx';
import { ShufflingContext } from './suffeling.jsx'; // Import the context

function Movies() {
  const api = '6dbdf27e3fb82e5b69b71a171310e6a3';
  const apiUrl = '/';

  const { shufflingState, setShufflingState } = useContext(ShufflingContext);

  const [user, setUser] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 100;
  const [userPreferences, setUserPreferences] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      let apiUrlWithPreferences = `${apiUrl}?page=${currentPage}&perPage=${itemsPerPage}`;

      // Fetch user preferences only when the user is logged in
      if (user) {
        const response = await fetch(`/pref/${user}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUserPreferences(data.preferences || []); // Ensure preferences is an array
        const genreString = data.preferences.join('|');
        apiUrlWithPreferences += `&genres=${genreString}`;
      }

      const response = await fetch(apiUrlWithPreferences);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch movies when the component mounts and when currentPage or user change
    fetchData();
  }, [currentPage, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user?.uid || '');
    });

    return () => unsubscribe();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const shuffleMovies = () => {
    // Shuffle the movies and update the shuffling state
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
    setShufflingState({
      ...shufflingState,
      products: shuffledProducts,
      hasShuffled: true,
    });
  };

  useEffect(() => {
    // Check if shuffling is needed when products or user changes
    if (shufflingState.hasShuffled) {
      shuffleMovies();
      setShufflingState({ ...shufflingState, hasShuffled: false });
    }
  }, [shufflingState.hasShuffled, setShufflingState]);

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {isLoading && <Loader></Loader>}
          {!isLoading &&
            products.map((product) => (
              <MovieCard
                key={product.id}
                id={product.imdb_id}
                title={product.original_title}
                genres={product.genres}
              />
            ))}
        </div>
      </div>
      <BackToTopButton />
      <div className="bottom-16 sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
 
      </div>
    </div>
  );
}

export default Movies;
