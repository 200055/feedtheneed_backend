const express = require("express");
const app = express();

const Us = require('../models/userModel')

// app.post('/user/insert', (req,res)=>{

//     const user = req.body.username;
//     const email = req.body.email;
//     const ph = req.body.phone;
//     const pwd = req.body.password;

//     const data = new Us({
//         username: user,
//         email: email, 
//         phone: ph, 
//         password: pwd
//     })
//     data.save();
// })

module.exports = app;
