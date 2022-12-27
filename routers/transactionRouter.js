const express = require('express');
const router = new express.Router();
const user = require('../models/userModel');
const transaction = require('../models/transactionModel');
const auth = require('../auth/auth');
const refund = require('../models/refundDonationModel');

//transaction send
router.post("/user/send_transaction",auth.userGuard, (req,res)=>{
    const user_id = req.userInfo._id;
    const donation_amount = req.body.donation_amount;
    const donation_category = req.body.donation_category;
    const donor_name = req.body.donor_name;
    const donor_note = req.body.donor_note;
    const donor_address = req.body.donor_address;
    const donation_status = req.body.donation_status;
    const idx = req.body.idx;
    const token = req.body.token;

    const data = new transaction({
        user_id: user_id,
        donation_amount: donation_amount, 
        donation_category: donation_category,
        donor_name: donor_name,
        donor_address: donor_address,
        donor_note: donor_note,
        donation_status: donation_status,
        idx: idx,
        token: token,
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

//view leadearboard
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

//view all transaction on the system
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

// see user transaction by the user
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

// admin can change donation status
router.put("/change_donation_status/:id",auth.admin_guard,(req,res)=>{
  const transaction_id = req.params.id;
  const donation_status = req.body.donation_status
  console.log(donation_status);

  transaction.updateOne({
    _id:transaction_id
  },{
    donation_status: donation_status
  })
  .then(()=>{
    
    res.json({success:true, msg:"Updated"})}  
  )
  .catch((e)=>{
      res.json({msg:"Failed to change donation status"})
  })
})

//view user transaction by admin
router.get("/admin/user_transaction/:user_id",auth.admin_guard,async(req,res)=>{
  await transaction.find({
      user_id: req.params.user_id
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

//refund request by user
router.post("/refund_donation_request/:transaction_id",auth.userGuard, async (req,res)=>{
  const transacion_id = req.params.transacion_id;
  const user_id = req.userInfo._id;
  const feedback = req.body.feedback;
  const cancel_reason = req.body.cancel_reason;

  const data = new refund({
    user_id: user_id,
    transacion_id: transacion_id,
    feedback: feedback,
    cancel_reason: cancel_reason
  })
  data.save()
  .then(()=>{
      res.json({success:true, msg:"Refund Request Sent"})}  
  )
  .catch((e)=>{
      res.json({msg:"Failed to send Refund Request"})
  })
})




module.exports = router;