const mongoose = require('mongoose');

const Transaction = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    donation_amount:{
        type: Number,
        required: true
    },
    donation_category:{
        type: String,
        required: true
    },
    donor_name:{
        type: String,
        required: true
    },
    donor_note:{
        type: String,
    },
    donor_address:{
        type: String
    },
    idx:{
        type: String
    },
    token:{
        type: String
    },
    donation_status:{
        type: String,
        default: "Pending"
    },
    created_at: { 
        type: Date, 
        required: true, 
        default: Date.now 
    }
})

module.exports = mongoose.model('Transaction', Transaction)
