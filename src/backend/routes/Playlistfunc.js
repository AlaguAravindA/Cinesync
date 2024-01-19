const { likePlaylist,isPlaylistLiked } = require('../controllers/likedPlaylistController');

const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Fetch all playlists (excluding user's playlists)
// Fetch user's playlists
router.get('/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Fetch playlists created by the user
      const userPlaylists = await Playlist.find({ userID: userId });
  
      res.json({ playlists: userPlaylists });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Fetch all playlists (excluding user's playlists)
  router.get('/all/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Fetch all playlists excluding the user's playlists
      const playlists = await Playlist.find({ userID: { $ne: userId } });
  
      res.json(playlists);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Create a new playlist
router.post('/create', async (req, res) => {
  try {
    const { userID, username, PlaylistName, movies } = req.body;

    // Create a new playlist
    const newPlaylist = new Playlist({
      userID,
      username,
      PlaylistName,
      movies,
    });

    // Save the new playlist to the database
    const savedPlaylist = await newPlaylist.save();

    res.json(savedPlaylist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/:playlistID', async (req, res) => {
    try {
      const playlistID = req.params.playlistID;
  
      // Fetch playlist details based on the MongoDB _id
      const playlist = await Playlist.findById(playlistID);
  
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
  
      // Send playlist details to the front-end
      res.json(playlist);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.put('/edit/:playlistId',async(req,res)=>{
    const { playlistID } = req.params;
  const { userID, PlaylistName, movies } = req.body;

  try {
    const playlist = await Playlist.findByIdAndUpdate(
      playlistID,
      { userID, PlaylistName, movies },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    return res.status(200).json(playlist);
  } catch (error) {
    console.error('Error updating playlist:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
  })
// Update a playlist
router.put('/update/:playlistId', async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const { userID, movies } = req.body;

    // Convert the received strings into an array of objects with imdb_id property
    const newMoviesArray = movies.map((imdb_id) => ({ imdb_id }));

    // Find the playlist by ID
    const existingPlaylist = await Playlist.findById(playlistId);

    if (!existingPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Update only the specified fields
    existingPlaylist.userID = userID;

    // Check for existing movies and add only new movies
    const uniqueMovies = newMoviesArray.filter((newMovie) => {
      return !existingPlaylist.movies.some((existingMovie) => {
        return existingMovie.imdb_id === newMovie.imdb_id;
      });
    });

    // Combine the existing movies with the new ones
    existingPlaylist.movies = [...existingPlaylist.movies, ...uniqueMovies];

    // Save the changes
    const updatedPlaylist = await existingPlaylist.save();

    res.json(updatedPlaylist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/updateplay/:playlistId', async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const { userID, movies,PlaylistName } = req.body;
    
    
    // Extract only the imdb_id values from the received array
    const updatedMovies = movies;
    

    // Find the playlist by ID
    const existingPlaylist = await Playlist.findById(playlistId);

    if (!existingPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Update only the specified fields
    existingPlaylist.userID = userID;
    existingPlaylist.movies = updatedMovies;
    existingPlaylist.PlaylistName = PlaylistName; // Update with the new array of imdb_id values

    // Save the changes
    const updatedPlaylist = await existingPlaylist.save();

    res.json(updatedPlaylist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// Delete a playlist
router.delete('/delete/:playlistId', async (req, res) => {
  try {
    const playlistId = req.params.playlistId;

    // Find and delete the playlist
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    res.json(deletedPlaylist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/like', likePlaylist);


router.post('/isLiked', isPlaylistLiked);



module.exports = router;
