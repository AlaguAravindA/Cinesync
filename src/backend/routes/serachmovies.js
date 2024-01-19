// seacrhmovies router
const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

router.get('/:movieId', async (req, res) => {
  try {
    const id = req.params.movieId;

    if (!id) {
      return res.status(400).json({ error: 'movieId parameter is required' });
    }

    const movies = await Movie.find({ imdb_id: id });

    if (movies.length === 0) {
      return res.status(404).json({ error: 'No movies found for the given imdb_id' });
    }

    res.json({ items: movies });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/movietitles/:movietitle', async (req, res) => {
  try {
    const movietitle = req.params.movietitle;

    if (!movietitle) {
      return res.status(400).json({ error: 'movietitle parameter is required' });
    }

    const regexPattern = new RegExp(`^${movietitle}$`, 'i');
    const movies = await Movie.find({ original_title: { $regex: regexPattern } });

    if (movies.length === 0) {
      return res.status(404).json({ error: 'No movies found for the given movietitle' });
    }

    res.json({ items: movies });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/movietitle/:movies_title', async (req, res) => {
  try {
    const inputTitle = req.params.movies_title;
    const escapedTerm = inputTitle.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  

    // Escape special characters
    const regexPattern = new RegExp(escapedTerm, "i");

    // Use MongoDB $regex operator for case-insensitive search
    const similarTitles = await Movie.find({
     original_title: { $regex: regexPattern }
    }).limit(3);

    res.json({ similarTitles });

  } catch (e) {
    // Handle errors
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/reccomendations/:moviesnames',async (req,res)=>{
  const movies= req.params.moviesnames;
  const impotr =  movies.split(',');
  const recc= await Movie.find({original_title:impotr});
  res.json({recco:recc});

})


module.exports = router;
