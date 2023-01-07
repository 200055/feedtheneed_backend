const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const staff = require('../models/staffModel');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth');
const upload = require('../fileUpload/fileUpload');
const partner = require('../models/partnerModel');
const blog = require('../models/blogModel');
const map = require('../models/mapsModel');
const contact = require('../models/contactUsModel');


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

// for staff login
router.post('/staff/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    staff.findOne({email:email})
    .then((a_data)=>{
        if (a_data == null){
            return res.json({msg: "Invalid Credentials"});
        }
        bcryptjs.compare(password, a_data.password, (e,result)=>{
            if (result == false){
              return res.status(201).json({msg:"Invalid Credentials"})
                // return res.json({msg:"Invalid Credentials"})
            }
            
            // creates token for logged in user
            // The token stores the logged in user id
            const token = jwt.sign({staffId : a_data._id}, "##0a9ajdjd92saSda@342!2#$90staff");
            res.json({token : token});

        })
    })
    .catch()

})

router.post("/staff/changepassword", auth.staff_guard, async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const staffId = req.staffInfo._id;
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

    staff.findOne({ _id: staffId }).then(async (staff) => {
      //encrypt newly submitted password
      // async-await syntax
      const isMatch = await bcryptjs.compare(currentPassword, staff.password);

      
      if (isMatch) {
        console.log(staff.password);
        //Update password for staff with new password
        bcryptjs.genSalt(10, (err, salt) =>
          bcryptjs.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            staff.password = hash;
            staff.save();
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


// dashboard for staff
router.get('/staff/dashboard',auth.staff_guard,(req,res)=>{
    res.json({
        username : req.staffInfo.username,
        email : req.staffInfo.email
    })
})



//blog 
// route for inserting blog
router.post('/blog/insert/staff/',auth.staff_guard,upload.fields([{name:'blog_image',maxCount: 1},{name:'donor_image',maxCount: 1}]),(req,res)=>{
  if(req.files == undefined){
      return res.json({msg:"Invalid file format"})
  }

  const blog_name = req.body.blog_name;
  const short_desc = req.body.short_desc;
  const blog_desc = req.body.blog_desc;
  const blog_category = req.body.blog_category;
  const donor_name = req.body.donor_name;
  const blog_price = req.body.blog_price
  // const blog_category_name = req.body.blog_category_name;
  const blog_image = req.files['blog_image'][0].filename;
  const donor_image = req.files['donor_image'][0].filename;

  const data = new blog({
      blog_name : blog_name,
      short_desc : short_desc,
      blog_desc : blog_desc,
      blog_category : blog_category,
      blog_price: blog_price,
      donor_name: donor_name,
      // blog_category_name : blog_category_name,
      blog_image : blog_image,
      donor_image: donor_image
  })

  data.save()
  .then(()=>{
      res.json({success:true, msg:"Inserted"})}  
  )
  .catch((e)=>{
      res.json({msg:"Failed"})
  })
})

// router for updating blog
router.put('/staff/blog/update/:id', auth.staff_guard,upload.fields([{name:'blog_image',maxCount: 1},{name:'donor_image',maxCount: 1}]) , (req,res)=>{
  const  _id = req.params.id;
  const blog_name = req.body.blog_name;
  const short_desc = req.body.short_desc;
  const blog_desc = req.body.blog_desc;
  const blog_category = req.body.blog_category;
  const donor_name = req.body.donor_name;
  const blog_price = req.body.blog_price
  // const blog_category_name = req.body.blog_category_name;
  // const blog_image = req.file.filename;

  if(req.files['blog_image'] == undefined && req.files['donor_image'] == undefined){
      blog.updateOne({
          _id: _id
      },{
          blog_name : blog_name,
          short_desc : short_desc,
          blog_desc : blog_desc,
          blog_category : blog_category,
          donor_name:donor_name,
          blog_price,blog_price
          // blog_category_name : blog_category_name,
      })
      .then(()=>{
          res.json({success:true, msg:"Updated"})}  
      )
      .catch((e)=>{
          res.json({msg:"Failed to update blog"})
      })
  } else if(req.files['blog_image'] == undefined){
      blog.updateOne({
          _id: _id
      },{
          blog_name : blog_name,
          short_desc : short_desc,
          blog_desc : blog_desc,
          blog_category : blog_category,
          donor_name:donor_name,
          blog_price,blog_price,
          donor_image: req.files['donor_image'][0].filename
      })
      .then(()=>{
          res.json({success:true, msg:"Updated"})}  
      )
      .catch((e)=>{
          res.json({msg:"Failed to update blog"})
      })
  } else if(req.files['donor_image'] == undefined){
      blog.updateOne({
          _id: _id
      },{
          blog_name : blog_name,
          short_desc : short_desc,
          blog_desc : blog_desc,
          blog_category : blog_category,
          donor_name:donor_name,
          blog_price,blog_price,
          blog_image: req.files['blog_image'][0].filename
      })
      .then(()=>{
          res.json({success:true, msg:"Updated"})}  
      )
      .catch((e)=>{
          res.json({msg:"Failed to update blog"})
      })
  }
  else{
      blog.updateOne({
          _id: _id
      },{
          blog_name : blog_name,
          short_desc : short_desc,
          blog_desc : blog_desc,
          blog_category : blog_category,
          donor_name:donor_name,
          blog_price,blog_price,
          blog_image: req.files['blog_image'][0].filename,
          donor_image: req.files['donor_image'][0].filename
      })
      .then(()=>{
          res.json({success:true, msg:"Updated"})}  
      )
      .catch((e)=>{
          res.json({msg:"Failed to update blog"})
      })
  }
})

//router to delete blog
router.delete('/blog/staff/:id',auth.staff_guard, (req,res)=>{
  const id = req.params.id;
  blog.deleteOne({_id: id})
  .then(()=>{
      res.json({success:true, msg: "blog deleted successfully"})
  })
  .catch((e)=>{
      res.json(e)
  })

})


// partner

// route for inserting partner
router.post('/partner/staff/insert',auth.staff_guard,upload.fields([{name:'partner_image',maxCount: 1},{name:'banner_image',maxCount: 1}]),(req,res)=>{
  console.log(req.files)
  if(req.files == undefined){
      return res.json({msg:"Invalid file format"})
  }
  const partner_name = req.body.partner_name;
  const partner_category = req.body.partner_category;

  const partner_image = req.files['partner_image'][0].filename;
  const banner_image = req.files['banner_image'][0].filename;

  const data = new partner({
      partner_name : partner_name,
      partner_category : partner_category,
      partner_image : partner_image,
      banner_image: banner_image
  })

  data.save()
  .then(()=>{
      res.json({success:true, msg:"Inserted"})}  
  )
  .catch((e)=>{
      res.json({msg:"Failed"})
  })
})

// router for updating partner
router.put('/partner/staff/update/:id', auth.staff_guard, upload.fields([{name:'partner_image',maxCount: 1},{name:'banner_image',maxCount: 1}]), (req,res)=>{
  const  _id = req.params.id;
  const partner_name = req.body.partner_name;
  const partner_category = req.body.partner_category;

  if(req.files['banner_image'] == undefined && req.files['partner_image'] == undefined){
      partner.updateOne({
          _id: _id
      },{
          partner_name : partner_name,
          partner_category : partner_category,
      })
      .then(()=>{
          res.json({success:true, msg:"Updated"})}  
      )
      .catch((e)=>{
          res.json({msg:"Failed to update partner"})
      })
  } else if (req.files['partner_image'] == undefined){
      partner.updateOne({
          _id: _id
      },{
          partner_name : partner_name,
          partner_category : partner_category,
          banner_image: req.files['banner_image'][0].filename

      })
      .then(()=>{
          res.json({success:true, msg:"Updated"})}  
      )
      .catch((e)=>{
          res.json({msg:"Failed to update partner"})
      })
  } else if (req.files['banner_image'] == undefined){
      partner.updateOne({
          _id: _id
      },{
          partner_name : partner_name,
          partner_category : partner_category,
          partner_image: req.files['partner_image'][0].filename
      })
      .then(()=>{
          res.json({success:true, msg:"Updated"})}  
      )
      .catch((e)=>{
          res.json({msg:"Failed to update partner"})
      })
  }
  else{
      partner.updateOne({
          _id: _id
      },{
          partner_name : partner_name,
          partner_category : partner_category,
          partner_image : req.files['partner_image'][0].filename,
          banner_image: req.files['banner_image'][0].filename

      })
      .then(()=>{
          res.json({success:true, msg:"Updated"})}  
      )
      .catch((e)=>{
          res.json({msg:"Failed to update partner"})
      })
  }
})

//router to delete partner
router.delete('/partner/staff/:id',auth.staff_guard, (req,res)=>{
  const id = req.params.id;
  partner.deleteOne({_id: id})
  .then(()=>{
      res.json({success:true, msg: "partner deleted successfully"})
  })
  .catch((e)=>{
      res.json(e)
  })

})

// view one contact us 
router.put('/staff/contact/:id', auth.staff_guard, (req,res)=>{
    const  _id = req.params.id;
    const company_name = req.body.company_name;
    const company_address = req.body.company_address;
    const company_phone = req.body.company_phone;
    const company_founded = req.body.company_founded;

        contact.updateOne({
            _id: _id
        },{
            company_name :  company_name,
            company_address : company_address,
            company_phone : company_phone,
            company_founded : company_founded,
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update contact us"})
        })
})

// view one map us 
router.put('/staff/map/:id', auth.staff_guard, (req,res)=>{
    const  _id = req.params.id;
    const lat = req.body.lat;
    const long = req.body.long;

        map.updateOne({
            _id: _id
        },{
            lat :  lat,
            long : long,
        })
        .then(()=>{
            res.json({success:true, msg:"Updated"})}  
        )
        .catch((e)=>{
            res.json({msg:"Failed to update map"})
        })
})



module.exports = router;


