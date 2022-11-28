const express = require('express');
const router = new express.Router();
const blog = require('../models/blogModel');
const auth = require('../auth/auth');
const upload = require('../fileUpload/fileUpload');

// route for inserting blog
router.post('/blog/insert',auth.admin_guard,upload.single('blog_image'),(req,res)=>{
    if(req.file == undefined){
        return res.json({msg:"Invalid file format"})
    }

    const blog_name = req.body.blog_name;
    const short_desc = req.body.short_desc;
    const blog_desc = req.body.blog_desc;
    const blog_category = req.body.blog_category;
    const blog_category_name = req.body.blog_category_name;
    const blog_image = req.file.filename;

    const data = new blog({
        blog_name : blog_name,
        short_desc : short_desc,
        blog_desc : blog_desc,
        blog_category : blog_category,
        blog_category_name : blog_category_name,
        blog_image : blog_image
    })

    data.save()
    .then(()=>{
        res.json({success:true, msg:"Inserted"})}  
    )
    .catch((e)=>{
        res.json({msg:"Failed"})
    })
})

module.exports = router;