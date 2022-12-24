const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const user = require('../models/userModel');
const transaction = require('../models/transactionModel');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth');
const upload = require('../fileupload/fileupload');

//transaction send
router.post("/user/send_transaction",auth.userGuard, (req,res)=>{
    const user_id = req.userInfo._id;
    const donation_amount = req.body.donation_amount;
    const donation_category = req.body.donation_category;
    const donor_name = req.body.donor_name;
    const donor_note = req.body.donor_note;
    const donor_address = req.body.donor_address;

    const data = new transaction({
        user_id: user_id,
        donation_amount: donation_amount,
        donation_category: donation_category,
        donor_name: donor_name,
        donor_address: donor_address,
        donor_note: donor_note,
    })
    data.save()
    .then(()=>{
        res.json({success:true, msg:"Transaction Successful"})}  
    )
    .catch((e)=>{
        res.json({msg:"Transaction Failed"})
    })
})

router.put("/user/donation_point",auth.userGuard,(req,res)=>{
    const donation_point = req.body.donation_point
    const user_id = req.userInfo._id;
    user.updateOne({
        _id: user_id
    },
    {
        donation_point : donation_point
    })
    .then(()=>{
        res.json({success:true, msg:"Updated"})}  
    )
    .catch((e)=>{
        res.json({msg:"Failed to update donation point"})
    })
})

router.get("/leaderboard",async(req,res)=>{
    await user.find({})
    .then((user) => {
        res.status(201).json({
          success: true,
          data: user,
        });
      })
      .catch((e) => {
        res.json({
          msg: e,
        });
      });
})

router.get("/all_transaction",async(req,res)=>{ 
    await transaction.find({})
    .populate({
        path: "user_id"
    })
    .then((transaction) => {
        res.status(201).json({
          success: true,
          data: transaction,
        });
      })
      .catch((e) => {
        res.json({
          msg: e,
        });
      });
})
router.get("/user_transaction",auth.userGuard,async(req,res)=>{
    await transaction.find({
        user_id: req.userInfo._id
    })
    .then((transaction) => {
        res.status(201).json({
          success: true,
          data: transaction,
        });
      })
      .catch((e) => {
        res.json({
          msg: e,
        });
      });
})




module.exports = router;