import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/UserPreferences.css';
import image from '../components/images/posters/Action_image.jpg';
import rimage from './images/posters/Romanticmovies.jpg';
import scary from './images/posters/Scary-Movies-800x400w.jpg';

const useGenreCardSpring = (selected) => {
  return useSpring({
    scale: selected ? 1.05 : 1,
    config: { mass: 1, tension: 170, friction: 26 },
  });
};

const UserPreferences = () => {
  const [isClicked, setClicked] = useState(false);
  const { uid } = useParams();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [hasPref, setHasPref] = useState(false);
  const navigate = useNavigate();

  const actionSpring = useGenreCardSpring(selectedGenre === 'ACTION');
  const dramaRomanceSpring = useGenreCardSpring(selectedGenre === 'DRAMA/ROMANCE');
  const thrillerSpring = useGenreCardSpring(selectedGenre === 'Horror');

  const handleGenreSelection = (genre) => {
    setSelectedGenre(genre);
  };

  const handleSelection = async () => {
    // Perform API call to store the selected preference
    await fetch(`/prefrences/setpref/${uid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pref: selectedGenre }),
    });

    setHasPref(true);
    setClicked(true);
    // Navigate to home after storing the preference
    navigate('/');
  };

  useEffect(() => {
    // Fetch preference existence status
    fetch(`/prefrences/${uid}`)
      .then((response) => response.json())
      .then((data) => setHasPref(data.exists));
  }, [uid, selectedGenre]);

  const renderGenreCard = (genre, spring, imageSrc) => (
    <animated.div
      style={{
        ...spring,
      }}
      className={`genre-card ${genre.toLowerCase()} ${selectedGenre === genre ? 'selected' : ''} mb-4 p-4 rounded-full overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105`}
      onClick={() => handleGenreSelection(genre)}
    >
      <h3 className="text-xl mb-2 font-bold text-white">{genre}</h3>
      <img src={imageSrc} alt={`${genre} Image`} className="card-image rounded-full mb-2" />
      {/* ...Additional card content */}
    </animated.div>
  );

  const springProps = useSpring({
    transform: isClicked ? 'scale(0.8)' : 'scale(1)',
    config: { tension: 300, friction: 10 },
  });

  return (
    <div className="user-preferences-container bg-transparent text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl mb-6 font-semibold text-center">Select Your Preferences</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderGenreCard('ACTION', actionSpring, image)}
        {renderGenreCard('ROMANCE', dramaRomanceSpring, rimage)}
        {renderGenreCard('Horror', thrillerSpring, scary)}
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl mb-4 font-semibold">You selected: {selectedGenre}</h2>
        <animated.button
          onClick={handleSelection}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
          style={springProps}
          disabled={!selectedGenre}
        >
          OK
        </animated.button>
      </div>
    </div>
  );
};

export default UserPreferences;
