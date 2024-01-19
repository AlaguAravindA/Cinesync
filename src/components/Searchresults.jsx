import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Movie from '../backend/models/movie';
import MovieCard from './MovieCard';
import Loader from './Loader.tsx';
import Movies from './movies.jsx';
import notfound from './images/posters/undraw_not_found_re_bh2e.svg'

export default function Searchresults() {
  const searchquery = useParams();
  console.log(searchquery);
  const [datareq, setDatareq] = useState(null);

  const [isLoader, setIsloader] = useState(false);
  const [recc, setRecc] = useState([]);
  const [recco, setRecco] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsloader(true);
      try {
        const response = await fetch(`/searchmovies/movietitles/${searchquery.searchquery}`);
        const data = await response.json();
        setDatareq(data.items[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsloader(false);
    };

    fetchData();
  }, [searchquery.searchquery]);

  useEffect(() => {
    const fechreco = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/recommendations?movie_title=${searchquery.searchquery}`);
        const data = await response.json();
        setRecc(data);

        if (data && data.recommendations && data.recommendations.length > 0) {
          fechmovies(data.recommendations);
        }
      } catch (e) {
        console.error('Error fetching recommendations:', e);
      }
    };

    fechreco();
  }, [searchquery.searchquery]);

  const fechmovies = async (recommendations) => {

    let data = recommendations.join(',');


    try {
      const response = await fetch(`/searchmovies/reccomendations/${recommendations}`);
      const reccomendation = await response.json();
      setRecco(reccomendation);
    } catch (error) {
      console.log(error);
    }
  
  };


  return (
    <div className='bg-transparent p-8'>
    <div className='max-w-screen-xl mx-auto'>
    <h2 className='text-3xl font-bold mb-6 relative overflow-hidden inline-block w-auto'>
  <span className='relative  text-white text-opacity-90 p-4 rounded-md shadow-md'>
    Results for {searchquery.searchquery}
  </span>
</h2>


  
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>

        {datareq===null &&(
         <div className="flex flex-col  h-screen">
         <div  className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md mb-4">
           <div className="flex items-center">
           
             <div className="ml-2">
               <p className="text-sm leading-5 font-medium w-auto">
                 No results found  <span className="text-gray-600">Check what you have typed.</span>
               </p>
             </div>
           </div>
         </div>
         <img className='mx-auto max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg' src={notfound} alt="" />
       </div>
        ) }
      {datareq && (
  <div key={datareq.imdb_id} className='bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105'>
    {isLoader && <Loader></Loader>}
    <MovieCard id={datareq.imdb_id} title={datareq.original_title} />
  </div>
) 


}

        
      </div>
    </div>
    { datareq!==null && (  <div className='bg-transparent from-purple-500 rounded-full mt-9 via-purple-700 to-purple-500 p-8 bg-opacity-80'>
  <h2 className='text-4xl font-extrabold text-white mb-6'>
    More Like  "{searchquery.searchquery}"
  </h2>
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
  
              {recco?.recco && recco.recco.map((movies) => (
                <div key={movies.imdb_id} className='bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105'>
                  <MovieCard id={movies.imdb_id} title={movies.original_title}></MovieCard>
                </div>
              ))}
            </div>
  
</div>

    )
}
</div>
  
  )
}
