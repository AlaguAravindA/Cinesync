const mongoose = require('mongoose');

const likedPlaylistSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  playlistID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist', // Assuming your Playlist model has this name
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const LikedPlaylist = mongoose.model('LikedPlaylist', likedPlaylistSchema);

module.exports = LikedPlaylist;
