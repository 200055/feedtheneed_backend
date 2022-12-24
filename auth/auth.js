const jwt = require('jsonwebtoken');
const user = require('../models/userModel')
const staff = require('../models/staffModel');
const admin = require('../models/adminModel')
// const admin = require('../models/adminModel')

//USER GUARD
module.exports.userGuard = (req,res,next)=> {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, "##0a9ajdjd92saSda@342!2#$90user");
        // iat is expiry date
        // console.log(data);
        user.findOne({_id: data.userId})
        .then((udata)=>{
            // console.log(udata)
           req.userInfo = udata;
           next(); 
        })
        .catch((e)=>{
            res.json({msg: "Invalid Token"});
        })

    }
    catch(e){
        res.json({msg: "Invalid Token"});
    }
}

module.exports.staff_guard = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, "##0a9ajdjd92saSda@342!2#$90staff");
        // res.json({msg:data});

        staff.findOne({_id : data.staffId})
        .then((s_data)=>{
            // res.json({msg : c_data})
            req.staffInfo = s_data;
            next();
        })
        .catch((e)=>{
            res.status(201).json({msg:"Invalid Token"})
        })


    }
    catch(e){
        res.status(201).json({msg:"Invalid Token"})
    }
}


module.exports.admin_guard = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, "##0a9ajdjd92saSda@342!2#$90admin");
        // res.json({msg:data});

        admin.findOne({_id : data.adminId})
        .then((a_data)=>{
            // res.json({msg : c_data})
            req.adminInfo = a_data;
            next();
        })
        .catch((e)=>{
            res.status(201).json({msg:"Invalid Token"})
        })


    }
    catch(e){
        res.status(201).json({msg:"Invalid Token"})
    }
}