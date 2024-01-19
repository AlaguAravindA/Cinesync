const LikedPlaylist = require('../models/Likedplaylist');
const Playlist = require('../models/playlist');

// Controller to handle liking a playlist
const likePlaylist = async (req, res) => {
  try {
    const { userID, playlistID } = req.body;
    // Check if the playlist exists
   
   
    const playlist = await Playlist.findById(playlistID);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if the user has already liked the playlist
    const existingLike = await LikedPlaylist.findOne({ userID:userID, playlistID:playlistID });
    if (existingLike) {
      return res.status(400).json({ error: 'Playlist already liked by the user' });
    }
    // Create a new liked playlist entry
    const newLike = new LikedPlaylist({
      userID,
      playlistID,
    });
    
    // Save the liked playlist entry to the database
    await newLike.save();
    
    res.json({ message: 'Playlist liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const isPlaylistLiked = async (req, res) => {
  try {
    const { userID, playlistID } = req.body;
    
    // Check if the user has already liked the playlist
    const existingLike = await LikedPlaylist.findOne({ userID, playlistID });
  
    const isLiked = !!existingLike;

    res.json({ isLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { likePlaylist, isPlaylistLiked };



