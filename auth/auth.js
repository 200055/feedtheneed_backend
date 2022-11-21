const jwt = require('jsonwebtoken');
const user = require('../models/userModel')
// const admin = require('../models/adminModel')

//USER GUARD
module.exports.userGuard = (req,res,next)=> {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, "##0a9ajdjd92saSda@342!2#$90");
        // iat is expiry date
        console.log(data);
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

// Admin Guard
// module.exports.adminGuard = (req,res,next)=> {
//     try{
//         const token = req.headers.authorization.split(" ")[1];
//         const data = jwt.verify(token, "database_signature");
//         // iat is expiry date
//         console.log(data);
//         admin.findOne({_id: data.adminId})
//         .then((udata)=>{
//            req.adminInfo = udata;
//            next(); 
//         })
//         .catch((e)=>{
//             res.json({msg: "Invalid Token"});
//         })

//     }
//     catch(e){
//         res.json({msg: "Invalid Token"});
//     }
// }
