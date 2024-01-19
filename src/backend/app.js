

const express = require('express');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const app = express();
const cors = require('cors');

dotenv.config({path:'./config.env'});

const db = process.env.DB_URI


app.use(cors())

mongoose.connect(db ,{

});




const allmovies = require('./routes/movies.js');
const seacrhmovies = require('./routes/serachmovies.js');

const watchlistrouter = require('./routes/watchlist.js');
const createWatchlist = require('./routes/Watchlistonlogin.js');
const fetchdata = require('./routes/fetchdata.js');
const addtowatchlist = require('./routes/AddtoWatchlist.js');
const prerence = require('./routes/prefrences.js');
const fetchpref = require('./routes/fetchprefrence.js');
const addcomments = require('./routes/addcomment.js');
const playlist = require('./routes/Playlistfunc.js');




try{

    app.use('/', allmovies);
    app.use('/watchlist/addtowatchlist',addtowatchlist);
    app.use('/watchlist/fetchWatchlist',fetchdata);
    app.use('/prefrences',prerence);
    app.use('/watchlist',watchlistrouter);
    app.use('/watchlists',createWatchlist); 
    app.use('/searchmovies', seacrhmovies);
    app.use('/pref',fetchpref);
    app.use('/addcomments',addcomments);
    app.use('/playlist',playlist);
  
    

    
}
catch(e){
    console.error('error');

}



const port= process.env.PORT || 3000;
app.listen(port , ()=>{
    console.log("Server connnected in "+ port);
})


