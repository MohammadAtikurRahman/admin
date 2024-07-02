var mongoose = require("mongoose");
var Schema = mongoose.Schema;
let nextId = 10000;
nextId = Math.floor(10000 + Math.random() * 90000);
const nextIdBen = 10000;
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
    },
    {timestamps: true},
);
const beneficiarySchema = new Schema(
    {
        beneficiaryId: Number,

        test_status: String,
        whotaketheexam: Number,

        excuses: String,

        enumerator_observation: String,

        all_observation: [String],
        observation_new: [String],

        observation: String,

        score1: Number,
        time: Date,
        duration: String,
        name: String,
        f_nm: String,
        ben_nid: String,
        sl: Number,
        ben_id: Number,
        m_nm: String,
        age: Number,
        dis: String,
        sub_dis: String,
        uni: String,
        vill: String,
        relgn: String,
        job: String,
        gen: String,

        mob: String,


        
        pgm: String,
        pass: Number,
        bank: String,
        branch: String,
        r_out: String,
        mob_1: String,
        mob_own: String,
        ben_sts: String,
        nid_sts: String,
        a_sts: String,
        u_nm: String,
        dob: Date,
        accre: Date,
        f_allow: Date,
        time: Date,
        timeanddate: String,
        installed_time: Date,
        loggedin_time: Date,

        transaction: [transactionSchema],
    },
    {timestamps: true},
);
const userSchema = new Schema(
    {
        userId: Number,
        username: String,
        password: String,
        country: String,
        beneficiary: [beneficiarySchema],
    },
    {timestamps: true},
);
const user = mongoose.model("user", userSchema);
module.exports = user;
