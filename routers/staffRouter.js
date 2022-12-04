const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const staff = require('../models/staffModel');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth');

// Staff register
router.post('/staff/register',auth.admin_guard,(req,res)=>{
    const email = req.body.email;
    staff.findOne({email:email})
    .then((s_email)=>{
        if(s_email != null){
            return res.json({msg:"Email already exists"});
        } 

        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const username = req.body.username;
        const age = req.body.age;
        const address = req.body.address;
        const gender = req.body.gender;
        const phone = req.body.phone;
        const password = req.body.password;
        const picture = req.body.picture;

        bcryptjs.hash(password, 10, (e, hashed_pw)=>{
            const data = new staff({
                firstname : firstname,
                lastname : lastname,
                username : username,
                age : age,
                address : address,
                gender : gender,
                phone : phone,
                email : email,
                password : hashed_pw,
                picture : picture,
            })
            data.save()
            .then(()=>{
                res.json({msg:"Registered successfully", success:true})
            })
            .catch((e)=>{
                res.json({msg:"Something went wrong"})
            })
        }) 

    })
    .catch() 
})

//view all staff
router.get('/staff', async (req,res)=>{
    const staff_details = await staff.find({})
    if (!staff_details) {
        res.status(500).json({success: false});
      } else {
        res.status(201).json(staff_details ); 
      }
})

//router to delete partner
router.delete('/staff/:id',auth.admin_guard, (req,res)=>{
    const id = req.params.id;
    staff.deleteOne({_id: id})
    .then(()=>{
        res.json({success:true, msg: "staff deleted successfully"})
    })
    .catch((e)=>{
        res.json(e)
    })

})



module.exports = router;


