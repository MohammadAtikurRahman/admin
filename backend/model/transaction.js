const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        beneficiaryId: Number,
        beneficiaryMobile: {
            type: String,
            required: true,
        },
        type: String,
        amount: Number,
        duration: Number,
        trxid: String,
        sub_type: String,
        date: String,
        duration_bkash: Number,
        sender: String,
        duration_nagad: Number,
        raw_sms: String,
        timestamp: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
