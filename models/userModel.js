const mongoose = require('mongoose');

const Us = mongoose.model('User',{ // 'User' is table's name
    username :{
        type: String,
    },
    email: {
        type: String,
    },
    phone:{
        type: String
    },
    password:{
        type: String,
    }
})

module.exports = Us;