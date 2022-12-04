const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth');
const contact = require('../models/contactUsModel');

router.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
     });

// Admin register
router.post('/admin/register',(req,res)=>{
    const email = req.body.email;
    admin.findOne({email:email})
    .then((a_email)=>{
        if(a_email != null){
            return res.json({msg:"Email already exists"});
        } 

        const username = req.body.username;
        const password = req.body.password;
        const picture = req.body.picture;

        bcryptjsjs.hash(password, 10, (e, hashed_pw)=>{
            const data = new admin({
                username : username,
                email : email,
                password : hashed_pw,
                picture : picture,
            })
            data.save()
            .then(()=>{
                res.json({msg:"Registered successfully"})
            })
            .catch((e)=>{
                res.json({msg:"Something went wrong"})
            })
        }) 

    })
    .catch() 
})


// for admin login
router.post('/admin/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    admin.findOne({email:email})
    .then((a_data)=>{
        if (a_data == null){
            return res.json({msg: "Invalid Credentials"});
        }
        bcryptjs.compare(password, a_data.password, (e,result)=>{
            if (result == false){
                return res.json({msg:"Invalid Credentials"})
            }
            
            // creates token for logged in user
            // The token stores the logged in user id
            const token = jwt.sign({adminId : a_data._id}, "##0a9ajdjd92saSda@342!2#$90");
            res.json({token : token});

        })
    })
    .catch()

})

router.post("/admin/changepassword", auth.admin_guard, async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const adminId = req.adminInfo._id;
    let errors = [];
  
    //Check required fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      errors.push({ msg: "Please fill in all fields." });
    }
  
    //Check passwords match
    if (newPassword !== confirmNewPassword) {
      errors.push({ msg: "New passwords do not match." });
    }
  
    //Check password length
    if (newPassword.length < 6 || confirmNewPassword.length < 6) {
      errors.push({ msg: "Password should be at least six characters." });
    }
  
    if (errors.length > 0) {
      res.render("changepassword", {
        errors,
        username: req.user.username,
      });
    } else {
      //VALIDATION PASSED
      //Ensure current password submitted matches
  
      admin.findOne({ adminId: adminId }).then(async (admin) => {
        //encrypt newly submitted password
        // async-await syntax
        const isMatch = await bcryptjs.compare(currentPassword, admin.password);
  
        if (isMatch) {
          console.log(admin.password);
          //Update password for admin with new password
          bcryptjs.genSalt(10, (err, salt) =>
            bcryptjs.hash(newPassword, salt, (err, hash) => {
              if (err) throw err;
              admin.password = hash;
              admin.save();
            })
          );
          res.json({msg:"Password successfully updated!"})
        } else {
          //Password does not match
          errors.push({ msg: "Current password is not a match." });
          res.render("changepassword", {
            errors,
            username: req.admin.username,
          });
        }
      });
    }
  });


// dashboard for admin
router.get('/admin/dashboard',auth.admin_guard,(req,res)=>{
    res.json({
        username : req.adminInfo.username,
        email : req.adminInfo.email
    })
})


module.exports = router;


