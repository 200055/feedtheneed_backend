const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth');
const upload = require('../fileupload/fileupload');


// register
router.post("/user/insert", (req,res)=>{
    const email = req.body.email;
    // make email unique
    User.findOne({email : email})
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
            const data = new User({
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
    User.findOne({email: email})
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
            const token = jwt.sign({userId: user_data._id}, "##0a9ajdjd92saSda@342!2#$90"); // secret key as extra auth (database_signature)
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
        User.updateOne({
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
    User.updateOne({
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



module.exports = router;