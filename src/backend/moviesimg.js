async function fetchMoviePoster(movieId, apiKey) {
    
    try {
      // Construct the URL
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
  
      // Make the request to TMDb API using fetch
      const response = await fetch(url);
  
      // Check if the response is successful (status code in the range 200-299)
      if (response.ok) {
        // Parse the JSON response
        const data = await response.json();
  
        // Check if the response contains poster_path
        if (data.poster_path) {
          // Construct the full URL for the poster image
          const posterUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  
          // Return the poster URL
          return posterUrl;
        } else {
          throw new Error('No poster available for this movie.');
        }
      } else {
        // If the response status is not in the range 200-299, throw an error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching movie poster:', error.message);
      throw error; // Re-throw the error to propagate it further
    }
  }
  module.exports = fetchMoviePoster;