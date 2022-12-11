const res = require("express/lib/response");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './photos')
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})
const filter = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: filter
})

module.exports = upload;

// const express = require('express')

// const multer = require('multer')

// const app = express()

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './photos')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + file.originalname) //Appending extension
//     }
// })

// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//         }
//     }
// })

// const multiple = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//         }
//     }
// })


// module.exports= upload,multiple;

