const mongoose = require('mongoose')

const contact = new mongoose.Schema({
    company_name:{
        type: String,
    },
    company_phone:{
        type: String
    },
    company_address:{
        type: String,
    },
    company_founded:{
        type: String,
    }
})
module.exports = mongoose.model('Contact', contact);