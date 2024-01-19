const express = require('express');
const router = express.Router();
const Watchlist = require('../models/watchlist'); // Adjust the path accordingly

const app = express();
app.use(express.json());
router.get('/:uid', async (req, res) => {
   

    const userId = req.params.uid;

    try {
        // Check if the watchlist for the user already exists
        const existingWatchlist = await Watchlist.findOne({ userId : userId });

        if (!existingWatchlist) {
            // If not, create a new watchlist for the user
            // const newWatchlist = new Watchlist({ userId : userId });
            // await newWatchlist.save();

            Watchlist.create({userId : userId })
            console.log('Watchlist created for user:', userId);
        }

        // Continue with other login logic...
        // You might want to send a response indicating successful login.
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
