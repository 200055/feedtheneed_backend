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