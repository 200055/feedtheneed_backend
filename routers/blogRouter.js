const express = require('express');
const router = new express.Router();
const blog = require('../models/blogModel');
const auth = require('../auth/auth');
const upload = require('../fileUpload/fileUpload');

// upload.fields([{name:'blog_image',maxCount: 1},{name:'banner_image',maxCount: 1}])
// route for inserting blog
router.post('/blog/insert',auth.admin_guard,upload.fields([{name:'blog_image',maxCount: 1},{name:'donor_image',maxCount: 1}]),(req,res)=>{
    if(req.files == undefined){
        return res.json({msg:"Invalid file format"})
    }

    const blog_name = req.body.blog_name;
    const short_desc = req.body.short_desc;
    const blog_desc = req.body.blog_desc;
    const blog_category = req.body.blog_category;
    const donor_name = req.body.donor_name;
    const blog_price = req.body.blog_price
    // const blog_category_name = req.body.blog_category_name;
    const blog_image = req.files['blog_image'][0].filename;
    const donor_image = req.files['donor_image'][0].filename;

    const data = new blog({
        blog_name : blog_name,
        short_desc : short_desc,
        blog_desc : blog_desc,
        blog_category : blog_category,
        blog_price: blog_price,
        donor_name: donor_name,
        // blog_category_name : blog_category_name,
        blog_image : blog_image,
        donor_image: donor_image
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
router.put('/blog/update/:id', auth.admin_guard,upload.fields([{name:'blog_image',maxCount: 1},{name:'donor_image',maxCount: 1}]) , (req,res)=>{
    const  _id = req.params.id;
    const blog_name = req.body.blog_name;
    const short_desc = req.body.short_desc;
    const blog_desc = req.body.blog_desc;
    const blog_category = req.body.blog_category;
    const donor_name = req.body.donor_name;
    const blog_price = req.body.blog_price
    // const blog_category_name = req.body.blog_category_name;
    // const blog_image = req.file.filename;

    if(req.files['blog_image'] == undefined && req.files['donor_image'] == undefined){
        blog.updateOne({
            _id: _id
        },{
            blog_name : blog_name,
            short_desc : short_desc,
            blog_desc : blog_desc,
            blog_category : blog_category,
            donor_name:donor_name,
            blog_price,blog_price
            // blog_category_name : blog_category_name,
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update blog"})
        })
    } else if(req.files['blog_image'] == undefined){
        blog.updateOne({
            _id: _id
        },{
            blog_name : blog_name,
            short_desc : short_desc,
            blog_desc : blog_desc,
            blog_category : blog_category,
            donor_name:donor_name,
            blog_price,blog_price,
            donor_image: req.files['donor_image'][0].filename
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update blog"})
        })
    } else if(req.files['donor_image'] == undefined){
        blog.updateOne({
            _id: _id
        },{
            blog_name : blog_name,
            short_desc : short_desc,
            blog_desc : blog_desc,
            blog_category : blog_category,
            donor_name:donor_name,
            blog_price,blog_price,
            blog_image: req.files['blog_image'][0].filename
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update blog"})
        })
    }
    else{
        blog.updateOne({
            _id: _id
        },{
            blog_name : blog_name,
            short_desc : short_desc,
            blog_desc : blog_desc,
            blog_category : blog_category,
            donor_name:donor_name,
            blog_price,blog_price,
            blog_image: req.files['blog_image'][0].filename,
            donor_image: req.files['donor_image'][0].filename
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