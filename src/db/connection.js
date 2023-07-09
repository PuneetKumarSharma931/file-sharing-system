const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL).then(()=>{

    console.log("MongoDB Successfully Connected!");

}).catch((err)=>{

    console.log("Some Error Occured!");
});