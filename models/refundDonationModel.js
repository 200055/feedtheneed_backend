const mongoose = require('mongoose');

const RefundDonation = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    transaction_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    },
    feedback:{
        type: String,
        required: true
    },
    refund_reason:{
        type: String,
        required: true
    },
    refund_status:{
        type: String,
        default:"Not Refunded",
        required: true
    },
    created_at: { 
        type: Date, 
        required: true, 
        default: Date.now 
    }
})

module.exports = mongoose.model('RefundDonation', RefundDonation)
