const mongoose = require('mongoose')

const maps = new mongoose.Schema({
    lat:{
        type: String,
        require: true
    },
    long:{
        type: String,
        require: true
    },
})
module.exports = mongoose.model('Maps', maps);