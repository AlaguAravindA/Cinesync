// EditPlaylist.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';

const EditPlaylist = () => {
  const { playlistID } = useParams();
  const history = useNavigate();

  const [playlistData, setPlaylistData] = useState({
    PlaylistName: '',
    movies: [],
  });

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const response = await fetch(`/playlist/${playlistID}`);
        const playlistDetails = await response.json();
        setPlaylistData(playlistDetails);
      } catch (error) {
        console.error('Error fetching playlist details:', error);
      }
    };

    fetchPlaylistDetails();
  }, [playlistID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRemoveMovie = (index) => {
    setPlaylistData((prevData) => {
      const updatedMovies = [...prevData.movies];
      updatedMovies.splice(index, 1);
      return { ...prevData, movies: updatedMovies };
    });
  };

  const handleUpdatePlaylist = async () => {
    try {
      const updatedMovies = playlistData.movies.map((movie) => ({ imdb_id: movie.imdb_id }));
      
      const response = await fetch(`/playlist/updateplay/${playlistID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: playlistData.userID,
          movies: updatedMovies,
          PlaylistName: playlistData.PlaylistName,
        }),
      });
  
      if (response.ok) {
        console.log('Playlist updated successfully');
        history(`/playlist/detail/${playlistID}`);
      } else {
        console.error('Error updating playlist:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-4">Edit Playlist</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="PlaylistName" className="block text-sm font-medium text-white">
            Playlist Name:
          </label>
          <input
            type="text"
            id="PlaylistName"
            name="PlaylistName"
            value={playlistData.PlaylistName}
            onChange={handleInputChange}
            className="mt-1 p-2 border bg-transparent text-white rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Movies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlistData.movies.map((movie, index) => (
              <div key={index} className="relative m-2">
                <MovieCard id={movie.imdb_id} />
                <div className="absolute top-0 right-0">
                  <button
                    type="button"
                    onClick={() => handleRemoveMovie(index)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleUpdatePlaylist}
        >
          Update Playlist
        </button>
      </form>
    </div>
  );
};

export default EditPlaylist;
