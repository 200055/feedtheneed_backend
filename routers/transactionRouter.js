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
router.get("/leaderboard", async (req, res) => {
  await user.find().sort({donation_point: -1})
    .then((users) => {
      res.status(201).json({
        success: true,
        data: users,
      });
    })
    .catch((e) => {
      res.json({
        msg: e,
      });
    });
});

//view all transaction on the system
router.get("/all_transaction",async(req,res)=>{ 
    await transaction.find().sort({created_at:-1})
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
//pagination transaction
router.get("/all_transaction_pagination", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalCount = await transaction.countDocuments();
  const totalPages = Math.ceil(totalCount / perPage);  // Calculate the total number of pages
  await transaction
    .find()
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort({ created_at: -1 })
    .populate({
      path: "user_id",
    })
    .then((transactions) => {
      res.status(201).json({
        success: true,
        data: transactions,
        totalPages: totalPages,  // Return the total number of pages
      });
    })
    .catch((e) => { 
      res.json({
        msg: e,
      });
    });
});

// see user transaction by the user
router.get("/user_transaction",auth.userGuard,async(req,res)=>{
    await transaction.find({
        user_id: req.userInfo._id
    }).sort({created_at:-1})
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

// staff can change donation status
router.put("/staff/change_donation_status/:id",auth.staff_guard,(req,res)=>{
  const transaction_id = req.params.id;
  const donation_status = req.body.donation_status

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

//view user transaction by staff
router.get("/staff/user_transaction/:user_id",auth.staff_guard,async(req,res)=>{
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

//admin can delete a transaction
router.delete("/delete_transaction/:transaction_id", auth.admin_guard, async (req, res) => {
  try {
    const transaction_id = req.params.transaction_id;
    await transaction.deleteOne({
      _id: transaction_id,
    });
    res.json({ success: true, msg: "Transaction Deleted" });
  } catch (e) {
    res.json({ msg: "Failed to delete transaction" });
  }
});

//refund request by user
router.post("/refund_donation_request/:transaction_id",auth.userGuard, async(req,res)=>{
  const transaction_id = req.params.transaction_id;
  const user_id = req.userInfo._id;
  const feedback = req.body.feedback;
  const refund_reason = req.body.refund_reason;
  
  const isAvailable = await transaction.findById(transaction_id);
  const alreadyRefundRequestSent = await refund.findOne({
    transaction_id:transaction_id 
  })

  if (isAvailable == null){
    res.json({success:false, msg:"No transaction available"})
  } 
  else if(alreadyRefundRequestSent !=null){
    res.json({success:false, msg:"Refund Request Already Sent"})
  }
  else{
    const data = new refund({
      user_id: user_id,
      transaction_id: transaction_id,
      feedback: feedback,
      refund_reason: refund_reason
    })
    data.save()
    .then(()=>{
        res.json({success:true, msg:"Refund Request Sent"})}  
    )
    .catch((e)=>{
        res.json({msg:"Failed to send Refund Request"})
    })
  }
})

//view all refund requests by admin
router.get("/all_refund_request",auth.admin_guard, async(req,res)=>{
  const refund_requests = 
  await refund.find()
  .populate("user_id")
  .populate("transaction_id")
    if (!refund_requests) {
        res.status(500).json({success: false});
      } else {
        res.status(201).json(refund_requests ); 
      }
})

//router only refund request
router.delete('/delete_only_refund_request/:refund_id',auth.admin_guard, async(req,res)=>{
  const refund_id = req.params.refund_id;

refund.deleteOne({_id: refund_id}, (err) => {
  if (err) {
    // handle error
    res.status(500).send({ error: 'An error occurred while deleting the documents' });
  } else {
    res.send({ message: 'Refunded Request Deleted successfully' });
    }
  });
})


//router to delete refund request and transaction
router.delete('/refund_request/:refund_id',auth.admin_guard, async(req,res)=>{
  const refund_id = req.params.refund_id;
  const transaction_id = await refund.findOne({
    _id: refund_id
  })

  refund.deleteOne({_id: refund_id}, (err) => {
    if (err) {
      // handle error
      res.status(500).send({ error: 'An error occurred while deleting the documents' });
    } else {
      // documents deleted
      transaction.deleteOne({_id: transaction_id.transaction_id}, (err) => {
        if (err) {
          // handle error
          res.status(500).send({ error: 'An error occurred while deleting the documents' });
        } else {
          // documents deleted
          res.send({ message: 'Refunded & Transaction deleted successfully' });
        }
      });
    }
  });

})

router.patch('/update_donation_point', async (req, res) => {
  try {
    // Get the sum of all donations for each user
    const aggregateResult = await transaction.aggregate([
      {
        $group: {
          _id: '$user_id',
          totalDonationAmount: { $sum: '$donation_amount' }
        }
      }
    ]);

    // Convert the total donation amounts to donation points
    const donationPointUpdates = aggregateResult.map(item => ({
      updateOne: {
        filter: { _id: item._id },
        update: {
          $set: {
            donation_point: item.totalDonationAmount / 1000
          }
        }
      }
    }));

    // Use the bulkWrite function to update all users in a single operation
    await user.bulkWrite(donationPointUpdates);

    res.send({ message: 'Donation points updated successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;