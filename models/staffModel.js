const mongoose = require('mongoose');

const staff = new mongoose.Schema({
    firstname:{
        type: String,
    },
    lastname:{
        type: String,
    },
    username:{
        type: String,
        require: true
    },
    address:{
        type: String,
    },
    gender:{
        type: String
    },
    email:{
        type: String,
        require : true
    },
    age:{
        type: String,
    },
    phone:{
        type: Number,
    },
    password:{
        type: String,
        require: true
    },
    picture:{
        type: String
    }
});

module.exports = mongoose.model('Staff', staff)