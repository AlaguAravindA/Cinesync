import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from './MovieCard';
import Loader from './Loader.tsx';
import { auth } from '../firebaseauth';

const SearchComponent = () => {
  const { playlistID, searchQuery } = useParams();
  const [dataReq, setDataReq] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoader(true);
        const response = await fetch(`/searchmovies/movietitles/${searchTerm}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDataReq(data.items[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoader(false);
      }
    };

    fetchData();
  }, [playlistID, searchTerm]);

  const handleAddToPlaylist = async (movieId) => {
    try {
      const user = auth.currentUser;

      const response = await fetch(`/playlist/update/${playlistID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user.uid,
          movies: [movieId],
        }),
      });

      if (response.ok) {
        console.log(`Movie with ID ${movieId} added to playlist with ID ${playlistID}`);
        setAddedToPlaylist(true);
      } else {
        console.error('Error updating playlist:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding movie to playlist:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setAddedToPlaylist(false); // Reset addedToPlaylist when the search term changes
  };

  return (
    <div className="bg-transparent p-8">
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <h2 className="text-3xl font-bold mb-6 relative overflow-hidden inline-block w-auto">
        <span className="relative text-white text-opacity-90 p-4 rounded-md shadow-md">
          Results for {searchTerm}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataReq === null ? (
          <div className="flex flex-col h-screen">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md mb-4">
              <div className="flex items-center">
                <div className="ml-2">
                  <p className="text-sm leading-5 font-medium w-auto">
                    No results found <span className="text-gray-600">Check what you have typed.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
            {isLoader && <Loader />}
            <MovieCard id={dataReq.imdb_id} title={dataReq.original_title} />
            <button
              onClick={() => handleAddToPlaylist(dataReq.imdb_id)}
              className={`bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 mt-2 ${
                addedToPlaylist ? 'bg-gray-500 cursor-not-allowed' : ''
              }`}
              disabled={addedToPlaylist}
            >
              {addedToPlaylist ? 'Added to Playlist' : 'Add to Playlist'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
