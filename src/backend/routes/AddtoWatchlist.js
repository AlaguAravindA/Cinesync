const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const router = express.Router();

router.use(express.json());
const Watchlist = require('../models/watchlist');

// Assuming your watchlist model has a schema like { user_id: String, movies: [String] }

router.post('/:userId', async (req, res) => {
    
  try {
    const id = req.body.id;
  
    // Assuming you have a user ID available in the request (you need to implement your own authentication mechanism)
    const userId = req.params.userId;
    
    
  

    // Check if the movie is already in the watchlist
    const watchlist = await Watchlist.findOne({ userId: userId });
  

    if (watchlist && watchlist.watchlist.includes(id)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    // If the movie is not in the watchlist, add it
    try {
        const result = await Watchlist.updateOne(
          { userId: userId },
          { $addToSet: { watchlist: id } }
        );
         // Log the result to check for any errors
      } catch (error) {
        console.error('Error during update:', error);
      }
      

    res.status(200).json({ message: 'Movie added to watchlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
