const mongoose = require('mongoose');

const Schema= mongoose.Schema;

const movieSchema= new Schema({
    imdb_id:{
        type:String,
        required:true
    }
    ,
    original_title:{
        type:String,
        required:true
    },
    overview:{
        type:String,
        required : true
    },
    genres:{
        type:[String],
        required: true
    },
    director:String,
    vote_average:String


    
});
module.exports= mongoose.model('Movie',movieSchema)
