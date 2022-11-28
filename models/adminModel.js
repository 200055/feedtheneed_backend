const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    username:{
        type: String,
    },
    email:{
        type: String,
        require : true
    },
    password:{
        type: String,
        require: true
    },
    picture:{
        type: String
    }
});

module.exports = mongoose.model('Admin', admin)