const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const auth = require('../auth/auth');
const map = require('../models/mapsModel');

const contact = require('../models/contactUsModel');


// *********contact us*********
// contact us post
router.post('/contact',auth.staff_guard, (req,res)=>{
    const company_name = req.body.company_name;
    const company_address = req.body.company_address;
    const company_phone = req.body.company_phone;
    const company_founded = req.body.company_founded;
    

    const data = new contact({
        company_name: company_name,
        company_address: company_address,
        company_phone: company_phone,
        company_founded: company_founded
    })

    data.save()
    .then(()=>{
        res.json({success:true, msg:"Inserted"})}  
    )
    .catch((e)=>{
        res.json({msg:"Failed"})
    })

})
// view contact us 
router.get('/contact', async (req,res)=>{
    const contact_details = await contact.find({})
    if (!contact_details) {
        res.status(500).json({success: false});
      } else {
        res.status(201).json({success: true, data: contact_details });
      }

})
// view one contact us 
router.put('/contact/:id', auth.admin_guard, (req,res)=>{
    const  _id = req.params.id;
    const company_name = req.body.company_name;
    const company_address = req.body.company_address;
    const company_phone = req.body.company_phone;
    const company_founded = req.body.company_founded;

        contact.updateOne({
            _id: _id
        },{
            company_name :  company_name,
            company_address : company_address,
            company_phone : company_phone,
            company_founded : company_founded,
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update contact us"})
        })
})



// *******visit us on maps*********
// map us post
router.post('/map',auth.admin_guard, (req,res)=>{
    const lat = req.body.lat;
    const long = req.body.long;

    const data = new map({
        lat: lat,
        long: long,
    })

    data.save()
    .then(()=>{
        res.json({success:true, msg:"Inserted"})}  
    )
    .catch((e)=>{
        res.json({msg:"Failed"})
    })

})
// view map us 
router.get('/map', async (req,res)=>{
    const map_details = await map.find({})
    if (!map_details) {
        res.status(500).json({success: false});
      } else {
        res.status(201).json({success: true, data: map_details });
      }

})
// view one map us 
router.put('/map/:id', auth.admin_guard, (req,res)=>{
    const  _id = req.params.id;
    const lat = req.body.lat;
    const long = req.body.long;

        map.updateOne({
            _id: _id
        },{
            lat :  lat,
            long : long,
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update map"})
        })
})




module.exports = router;