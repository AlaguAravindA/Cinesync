const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const playlistschema = new Schema({
    userID:{
        type:String,
        required: true,
    },
    username:{
        type:String,
        required:true
    },
    PlaylistName:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        default: ()=> new Date().toLocaleString()
      },
      movies:[
        {
            imdb_id:{
                type:String,
                required:true
            }


        }
      ]

    
})

module.exports = mongoose.model('Playlist',playlistschema);