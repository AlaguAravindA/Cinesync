import React, { useState, useEffect } from 'react';
import { useParams, useHistory, useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebaseauth';
import gsap from 'gsap';
import MovieCard from './MovieCard';
import BackToTopButton from './backtotop';
import SearchComponent from './searchmovies';
import Loader from './Loader.tsx';
import NotFound404 from './404notfoun.jsx';

const DetailPlaylist = () => {
  const { playlistID } = useParams();
  const [playlistDetails, setPlaylistDetails] = useState({});
  const [isUserPlaylist, setIsUserPlaylist] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  const fetchPlaylistData = async () => {
    try {
      const response = await fetch(`/playlist/${playlistID}`);

      if (response.ok) {
        const data = await response.json();
        setPlaylistDetails(data);
        const user = auth.currentUser;
        setIsUserPlaylist(user && user.uid === data.userID);
        setIsLiked(data.likes && data.likes.includes(user.uid));
      } else if (response.status === 404) {
        setIsLoading(false);
      } else {
        console.error('Error fetching playlist details');
      }
    } catch (error) {
      console.error('An error occurred while fetching playlist details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      '.entry-animation-container',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );

    fetchPlaylistData();
    fetchRandomMovies();
  }, [playlistID]);
  const fetchLike = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.warn('User is not logged in.');
        return;
      }

      const response = await fetch(`/playlist/isLiked`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user.uid,
          playlistID: playlistID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
      } else {
        console.error('Error fetching liked status:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while fetching liked status:', error.message);
    }
  };

  useEffect(() => {
    fetchLike();
  }, [playlistID]);

  const fetchRandomMovies = async () => {
    try {
      const response = await fetch('/randomMovies');
      if (response.ok) {
        const data = await response.json();
        setRandomMovies(data.randomMovies);
      } else {
        console.error('Error fetching random movies');
      }
    } catch (error) {
      console.error('An error occurred while fetching random movies:', error);
    }
  };

  const handleLikePlaylist = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.warn('User is not logged in. Cannot like playlist.');
        return;
      }

      const response = await fetch(`/playlist/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistID,
          userID: user.uid,
        }),
      });
      console.log(response.ok);

      if (response.ok) {
        setIsLiked((prevIsLiked) => !prevIsLiked); // Toggle liked status
      } else {
        console.error('Error liking playlist:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while liking playlist:', error.message);
    }
  };

  const handleAddOrUpdateMovies = async () => {
    try {
      const user = auth.currentUser;
      const response = await fetch(`/playlist/update/${playlistID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user.uid,
          movies: selectedMovies,
        }),
      });
  
      if (response.ok) {
        console.log('Movies added/updated successfully');
        // Corrected function name here
        fetchPlaylistData();
        fetchRandomMovies();
      } else {
        console.error('Error adding/updating movies to playlist');
      }
    } catch (error) {
      console.error('An error occurred while adding/updating movies to playlist:', error);
    }
  };
  
  const handleSelectMovie = (movieId) => {
    const isSelected = selectedMovies.includes(movieId);
    if (!isSelected) {
      setSelectedMovies((prevSelectedMovies) => [...prevSelectedMovies, movieId]);
    } else {
      setSelectedMovies((prevSelectedMovies) =>
        prevSelectedMovies.filter((id) => id !== movieId)
      );
    }
  };

  const handleEditPlaylist = () => {
    navigate(`/playlist/edit/${playlistID}`);
  };

  const handleRemovePlaylist = async () => {
    try {
      const response = await fetch(`/playlist/delete/${playlistID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        navigate('/playlist');
      } else {
        console.error('Error removing playlist');
      }
    } catch (error) {
      console.error('An error occurred while removing playlist:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="entry-animation-container mt-28" style={{ zIndex: -1 }}>
    {isLoading ? (
     <Loader/>
    ) : (
      <div className="min-h-screen bg-transparent text-white p-8">
        {Object.keys(playlistDetails).length === 0 ? (
          <NotFound404/>
        ) : (
          <div>
            <h2 className="text-4xl mt-4 w-fit font-bold mb-6">{playlistDetails.PlaylistName}</h2>

        <div className="mb-8 bg-white backdrop-filter backdrop-blur-sm bg-opacity-10 p-6 rounded-md text-center">
          <h3 className="text-xl font-semibold mb-2 text-white">Here is the Playlist</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <BackToTopButton />
            {playlistDetails.movies &&
              playlistDetails.movies.map((movie, index) => (
                <li key={index} className="mb-4">
                  <MovieCard id={movie.imdb_id} />
                </li>
              ))}
          </ul>
        </div>

        {isUserPlaylist && (
          <div className="mb-8 bg-white backdrop-filter backdrop-blur-sm bg-opacity-10 p-6 rounded-md">
            <h3 className="text-xl font-semibold mb-4">Add or Update Movies:</h3>
            <div className="flex items-center mb-4">
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 bg-transparent"
                name=""
                id=""
                onChange={handleSearch}
                placeholder="Search for movies..."
              />
              <Link to={`/playlist/search/${playlistID}/${searchQuery}`}>
                <button className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400">
                  Search
                </button>
              </Link>
            </div>
            <ul className="flex items-center flex-wrap">
              {randomMovies.map((movie, index) => (
                <li key={index} className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id={`movieCheckbox_${movie.imdb_id}`}
                    name={`movieCheckbox_${movie.imdb_id}`}
                    checked={selectedMovies.includes(movie.imdb_id)}
                    onChange={() => handleSelectMovie(movie.imdb_id)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`movieCheckbox_${movie.imdb_id}`}
                    className="cursor-pointer w-6 h-6 border border-white rounded-md mr-4 flex items-center justify-center bg-transparent"
                  >
                    {selectedMovies.includes(movie.imdb_id) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 text-white"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>
                  <div className="flex-shrink-0 h-20 w-20 mr-4 mb-4">
                    <p onClick={(e) => e.preventDefault()}>
                      <MovieCard id={movie.imdb_id} />
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex mt-4">
              <button
                onClick={handleAddOrUpdateMovies}
                className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 mr-4"
              >
                Add/Update Movies
              </button>
            </div>
          </div>
        )}

        {isUserPlaylist ? (
          <div className="space-x-4">
            <button
              onClick={handleEditPlaylist}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Edit Playlist
            </button>
            <button
              onClick={handleRemovePlaylist}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Remove Playlist
            </button>
          </div>
        ) : (
          <button
            onClick={handleLikePlaylist}
            disabled={isLiked}
            className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isLiked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLiked ? 'Liked' : 'Like Playlist'}
          </button>
        )}
       </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailPlaylist;