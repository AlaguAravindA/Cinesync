const express = require('express');
const watchlistRouter = express.Router();
const Watchlist = require('../models/watchlist');

// GET user's watchlist by UID
watchlistRouter.get('/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;

    // Find the watchlist for the specified user ID
    const userWatchlist = await Watchlist.findOne({ userId: uid });
  

    if (!userWatchlist || userWatchlist.watchlist.length === 0) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    // If the watchlist is found and not empty, send it in the response
    res.status(200).json({ watchlist: userWatchlist.watchlist });
  } catch (error) {
    console.error('Error fetching watchlist:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST to add a movie to the watchlist
watchlistRouter.post('/:uid/:movieId', async (req, res) => {
  try {
    const uid = req.params.uid;
    const movieId = req.params.movieId;

    // Find the watchlist for the specified user ID
    const userWatchlist = await Watchlist.findOne({ userId: uid });

    if (!userWatchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    // Add the movie to the watchlist if it's not already there
    if (!userWatchlist.watchlist.includes(movieId)) {
      userWatchlist.watchlist.push(movieId);
      await userWatchlist.save();
      res.status(200).json({ message: 'Movie added to watchlist' });
    } else {
      res.status(409).json({ error: 'Movie already in watchlist' });
    }
  } catch (error) {
    console.error('Error adding movie to watchlist:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE to remove a movie from the watchlist
watchlistRouter.delete('/:uid/:movieId', async (req, res) => {
  try {
    const uid = req.params.uid;
    const movieId = req.params.movieId;

    // Find the watchlist for the specified user ID
    const userWatchlist = await Watchlist.findOne({ userId: uid });

    if (!userWatchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    // Remove the movie from the watchlist if it's there
    const index = userWatchlist.watchlist.indexOf(movieId);
    if (index !== -1) {
      userWatchlist.watchlist.splice(index, 1);
      await userWatchlist.save();
      res.status(200).json({ message: 'Movie removed from watchlist' });
    } else {
      res.status(400).json({ error: 'Movie not found in watchlist' });
    }
  } catch (error) {
    console.error('Error removing movie from watchlist:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = watchlistRouter;
