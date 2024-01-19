const axios = require('axios');

async function moviesimages(moviesid) {
  const options = {
    method: 'GET',
    url: 'https://movies-tv-shows-database.p.rapidapi.com/',
    params: {
      movieid: moviesid
    },
    headers: {
      Type: 'get-movies-images-by-imdb',
      'X-RapidAPI-Key': '3c96d8a091msh546558017149186p1adb05jsn5fb4c36e28fd',
      'X-RapidAPI-Host': 'movies-tv-shows-database.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.poster;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to propagate it further
  }
}


module.exports = moviesimages;
