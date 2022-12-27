const mongoose = require('mongoose');

const RefundDonation = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    transacion_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transcation"
    },
    feedback:{
        type: String
    },
    cancel_reason:{
        type: String
    },
    created_at: { 
        type: Date, 
        required: true, 
        default: Date.now 
    }
})

module.exports = mongoose.model('RefundDonation', RefundDonation)
