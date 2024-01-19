const mongoose = require('mongoose');

const connectbd = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    }).then(con =>{
        console.log('connectoed'+con.connection.host);
    })
}

module.exports=connectbd;