const mongoose = require('mongoose')

const blog = new mongoose.Schema({
    blog_name:{
        type: String,
        require: true
    },
    short_desc:{
        type:String
    },
    blog_desc:{
        type: String
    },
    blog_category:{
        type: String
    },
    // blog_category_name:{
    //     type: String,
    // },
    blog_price:{
        type: Number,
        require: true
    },
    blog_image:{
        type:String
    }
})
module.exports = mongoose.model('Blog', blog);