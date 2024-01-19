const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const watchlist = new Schema({
    userId:{
        type:String,
        requried : true
    },
    watchlist : {
        type : Array,
        default: []
        
    }

})


module.exports= mongoose.model('Watchlist',watchlist);