const express = require('express');
const router = express.Router();
const moviesdata = require('../models/movie');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 80;
    const genreString = req.query.genres || '';
  
    // Check if genres are provided
    if (genreString) {
      // Format the first letter of each genre in the string
      const formattedGenres = genreString.split('|').map(genre => genre.toLowerCase().charAt(0).toUpperCase() + genre.slice(1).toLowerCase());
  
      const regexQueries = formattedGenres.map(genre => ({
        genres: {
          $in: [
            new RegExp(`(^|\\|)${genre}(\\||$)`),
            genre
          ]
        }
      }));
  
      // Construct a query object to include genres if provided
      const query = (page === 1 || page<=5) && formattedGenres.length > 0 ? { $or: regexQueries } : {};
  
      const movies = await moviesdata.find(query).skip((page - 1) * perPage).limit(perPage);
      const totalMovies = await moviesdata.countDocuments();
  
      const totalPages = Math.ceil(totalMovies / perPage);
  
      res.json({
        items: movies,
        totalPages,
      });
    } else {
      // If no genres provided, fetch all data without filtering
      const movies = await moviesdata.find().skip((page - 1) * perPage).limit(perPage);
      const totalMovies = await moviesdata.countDocuments();
  
      const totalPages = Math.ceil(totalMovies / perPage);
  
      res.json({
        items: movies,
        totalPages,
      });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
  
});
// router.get('/search/:query',async (req,res)=>{
//    const query = req.params.query;
   

// })

router.get('/randommovies', async (req, res) => {
  try {
    const numberOfRandomMovies = 5;

    // Specify the genres you want to include in the random selection
    const selectedGenres = ['Action', 'Adventure', 'Science Fiction', 'Thriller'];

    // Use MongoDB Aggregation Framework to get random movies with specified genres
    const randomMovies = await moviesdata.aggregate([
      { $match: { genres: { $in: selectedGenres } } }, // Add this stage to filter by genres
      { $sample: { size: numberOfRandomMovies } }
    ]);

    res.json({ randomMovies });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
