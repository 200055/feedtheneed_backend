const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const user = require('../models/userModel');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth');
const upload = require('../fileupload/fileupload');


// register
router.post("/user/insert", (req,res)=>{
    const email = req.body.email;
    // make email unique
    user.findOne({email : email})
    .then((user_data)=>
    {
        if(user_data!=null){
            res.json({msg: "Email already exists"});
            return;
        }
        const phone = req.body.phone;
        const password = req.body.password;

        //encrypt password in database
        bcryptjs.hash(password,10,(e, hashed_pw)=>{
            const data = new user({
                phone : phone,
                email : email,            
                password : hashed_pw,
            })
            data.save()
            .then(()=>{
                res.json({msg: "user registered"})
            })
            .catch((e)=>{
                res.json({msg:"user registration failed"})
            });
        });
    })
    .catch();
})

// login
router.post("/user/login", (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    user.findOne({email: email})
    .then((user_data)=>{
        if(user_data == null){
            res.json({msg : "Invalid Credentials"}) 
            return;
        }
        bcryptjs.compare(password, user_data.password, (e, result)=>{
            if (result == false){
                res.json({msg: "Invalid Credentials"});
                return;
            }
            //creates token for logged in users
            // this token stores logged in user id
            const token = jwt.sign({userId: user_data._id}, "##0a9ajdjd92saSda@342!2#$90user"); // secret key as extra auth (database_signature)
            res.json({msg:"Success",token: token});
        })
    })
    .catch();
})

// view profile
router.get("/user/profile", auth.userGuard, upload.single('picture'), (req,res)=>{
    res.json({
        picture: req.userInfo.picture,
        firstname : req.userInfo.firstname,
        lastname : req.userInfo.lastname,
        username: req.userInfo.username,
        email: req.userInfo.email,
        phone: req.userInfo.phone,
        address: req.userInfo.address,
        dob: req.userInfo.dob,
    })
})

//User update route
router.put("/user/update", auth.userGuard,upload.single('picture'), (req, res) => {
    const id = req.userInfo._id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const phone = req.body.phone;
    const address = req.body.address;
   
    const password = req.body.password;
    const email = req.body.email;
    const dob = req.body.dob;
    console.log(req.file)
    if (req.file == undefined) {
        user.updateOne({
            _id: id
        }, {
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            username:username,
            address:address,
            phone: phone,
            password:password,
            email:email,
            dob:dob,

        })
        .then(() => {
            res.json({ message: "updated sucessfully" })
        })
        .catch((e) => {
            res.json({ message: "invalid" })
        })
    }else{
    user.updateOne({
            _id: id
        }, {
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            username:username,
            address:address,
           
            password:password,
            email:email,
            dob : dob,
            picture:req.file.filename
        })
        .then(() => {
            res.json({ message: "updated sucessfully" })
        })
        .catch((e) => {
            res.json({ message: "invalid" })
        })
    }
})

router.post("/user/changepassword", auth.userGuard, async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.userInfo._id;
    console.log(userId);
    let errors = [];
  
    //Check required fields
    // if (!currentPassword || !newPassword || !confirmNewPassword) {
    //   // errors.push({ msg: "Please fill in all fields." });
    //   res.send( {msg:"Please fill in all fields"});
    // }
  
    //Check passwords match
    if (newPassword !== confirmNewPassword) {
      // errors.push({ msg: "New passwords do not match." });
      res.send( {msg:"New passwords do not match"});
      return;
    }
  
    //Check password length
    if (newPassword.length < 6 || confirmNewPassword.length < 6) {
      // errors.push({ msg: "Password should be at least six characters." });
       res.send({msg:"Password should be at least six characters"});
       return;
    }
    if(currentPassword == newPassword){
      res.send( {msg:"New Password Cannot Be Same To Old"});
      return;
    }
  
    if (errors.length > 0) {
       res.send({msg:"Field cannot be empty"});
       return;
    } else {
      //VALIDATION PASSED
      //Ensure current password submitted matches
  
      user.findOne({ _id: userId }).then(async (user) => {
        //encrypt newly submitted password
        // async-await syntax
        const isMatch = await bcryptjs.compare(currentPassword, user.password);
        console.log(await bcryptjs.compare(currentPassword, user.password))
        console.log(user.password)
        if (isMatch) {
          console.log(user.password);
          //Update password for user with new password
          bcryptjs.genSalt(10, (err, salt) =>
            bcryptjs.hash(newPassword, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.save();
            })
          );
          res.send( {msg:"Password successfully updated!"});
          return;
        } 
        else {
          //Password does not match
          res.send({msg: "Current password is not a match"})
          return;
          // errors.push({ msg: "Current password is not a match." });
        }
      });
    }
  });



module.exports = router;