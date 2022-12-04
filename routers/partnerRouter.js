const express = require('express');
const router = new express.Router();
const partner = require('../models/partnerModel');
const auth = require('../auth/auth');
const upload = require('../fileUpload/fileUpload');

// route for inserting partner
router.post('/partner/insert',auth.admin_guard,upload.single('partner_image'),(req,res)=>{
    if(req.file == undefined){
        return res.json({msg:"Invalid file format"})
    }

    const partner_name = req.body.partner_name;
    const partner_category = req.body.partner_category;
    const partner_image = req.file.filename;

    const data = new partner({
        partner_name : partner_name,
        partner_category : partner_category,
        partner_image : partner_image
    })

    data.save()
    .then(()=>{
        res.json({success:true, msg:"Inserted"})}  
    )
    .catch((e)=>{
        res.json({msg:"Failed"})
    })
})

router.get('/partner', async (req,res)=>{
    const partner_details = await partner.find({})
    if (!partner_details) {
        res.status(500).json({success: false});
      } else {
        res.status(201).json( partner_details );
      }
})

router.get('/partner/:id', async (req,res)=>{
    const partner_details = await partner.findOne({_id : req.params.id})
    if (!partner_details) {
        res.status(500).json({success: false});
      } else {
        res.status(201).json({success: true, data: partner_details });
      }
})

// router for updating partner
router.put('/partner/update/:id', auth.admin_guard, upload.single('partner_image'), (req,res)=>{
    console.log(req.body);
    const  _id = req.params.id;
    const partner_name = req.body.partner_name;
    const partner_category = req.body.partner_category;
    const partner_image = req.file.filename;
    // const partner_image = req.file.filename;   

    if(req.file==undefined){
        partner.updateOne({
            _id: _id
        },{
            partner_name : partner_name,
            partner_category : partner_category,
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update partner"})
        })
    } else{
        partner.updateOne({
            _id: _id
        },{
            partner_name : partner_name,
            partner_category : partner_category,
            partner_image : partner_image
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update partner"})
        })
    }
})

//router to delete partner
router.delete('/partner/:id',auth.admin_guard, (req,res)=>{
    const id = req.params.id;
    partner.deleteOne({_id: id})
    .then(()=>{
        res.json({success:true, msg: "partner deleted successfully"})
    })
    .catch((e)=>{
        res.json(e)
    })

})


module.exports = router;
