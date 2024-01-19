// MovieCard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moviesimages from '../backend/moviesimg'; // Make sure to adjust the path accordingly

const MovieCard = ({ id, title, genres }) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const setimg = async () => {
      
      try {
        const result = await moviesimages(id, '6dbdf27e3fb82e5b69b71a171310e6a3');
        setImageSrc(result);
      } catch (error) {
        console.error('Error fetching image:', error.message);
      }
    };

    setimg();
  }, [id]);

  return (
    <div key={id} className="group">
      <Link to={`/detailed/${id}`} className="group">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
          <img
            src={imageSrc} // Make sure to pass the correct image source
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <h3 className="mt-4 text-lg text-slate-300">{title}</h3>
        <p className="mt-1 text-sm text-slate-200">{genres}</p>
      </Link>
    </div>
  );
};

export default MovieCard;
