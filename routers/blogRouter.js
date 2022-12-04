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

router.get('/blog', async (req,res)=>{
    const blog_details = await blog.find({})
    if (!blog_details) {
        res.status(500).json({success: false});
      } else {
        res.status(201).json(blog_details ); 
      }
})

router.get('/blog/:id', async (req,res)=>{
    const blog_details = await blog.findOne({_id : req.params.id})
    if (!blog_details) {
        res.status(500).json({success: false});
      } else {
        res.status(201).json({success: true, data: blog_details });
      }
})

// router for updating blog
router.put('/blog/update/:id', auth.admin_guard, upload.single('blog_image'), (req,res)=>{
    console.log(req.body);
    const  _id = req.params.id;
    const blog_name = req.body.blog_name;
    const short_desc = req.body.short_desc;
    const blog_desc = req.body.blog_desc;
    const blog_category = req.body.blog_category;
    const blog_category_name = req.body.blog_category_name;
    const blog_image = req.file.filename;
    // const blog_image = req.file.filename;   

    if(req.file==undefined){
        blog.updateOne({
            _id: _id
        },{
            blog_name : blog_name,
            short_desc : short_desc,
            blog_desc : blog_desc,
            blog_category : blog_category,
            blog_category_name : blog_category_name,
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update blog"})
        })
    } else{
        blog.updateOne({
            _id: _id
        },{
            blog_name : blog_name,
            short_desc : short_desc,
            blog_desc : blog_desc,
            blog_category : blog_category,
            blog_category_name : blog_category_name,
            blog_image : blog_image
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update blog"})
        })
    }
})

//router to delete blog
router.delete('/blog/:id',auth.admin_guard, (req,res)=>{
    const id = req.params.id;
    blog.deleteOne({_id: id})
    .then(()=>{
        res.json({success:true, msg: "blog deleted successfully"})
    })
    .catch((e)=>{
        res.json(e)
    })

})


module.exports = router;