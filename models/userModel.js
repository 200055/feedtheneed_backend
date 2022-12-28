const mongoose = require('mongoose');
const { array } = require('../fileUpload/fileUpload');

const User = new mongoose.Schema({
    email:{
        type : String,
        required : true
    },
    phone:{
        type : String,
        required : true
    },
    password:{
        type: String,
        required : true,
    },
    donation_point:{
        
        type:String,
        "default": 0.0  ,
    },
    age:{
        type : Number,
    },
    gender:{
        type : String,
    },
    dob:{
        type : String,
    },
    picture:{
        type: String
    },
    address:{
        type: String
    },
    firstname:{
        type: String,
    
    },
    lastname:{
        type: String,
    
    },
    username:{
        type : String,
    }
})

module.exports = mongoose.model('User', User)
