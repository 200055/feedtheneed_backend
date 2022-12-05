const mongoose = require('mongoose');

const User = new mongoose.Schema({
    firstname:{
        type: String,

    },
    lastname:{
        type: String,

    },
    username:{
        type : String,

    },
    email:{
        type : String,
        required : true
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
    phone:{
        type : String,
        required : true
    },
    password:{
        type: String,
        required : true,
    },
    picture:{
        type: String
    },
    address:{
        type: String
    },
})

module.exports = mongoose.model('User', User)
