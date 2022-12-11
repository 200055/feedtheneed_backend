const mongoose = require('mongoose')

const partner = new mongoose.Schema({
    partner_name:{
        type: String,
        require: true
    },
    partner_category:{
        type: String
    },
    partner_image:{
        type:String
    },
    banner_image:{
        type:String
    }
})
module.exports = mongoose.model('Partner', partner);