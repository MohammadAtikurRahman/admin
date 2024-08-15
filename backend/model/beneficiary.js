const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Beneficiary schema
const beneficiarySchema = new Schema(
    {
        beneficiaryId: {type: Number, required: true, unique: true},
        userId: {type: mongoose.Types.ObjectId}, // Reference to the User model
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
        installed_time: Date,
        loggedin_time: Date,
    },
    {timestamps: true}
);

// Create the Beneficiary model
const Beneficiary = mongoose.model('beneficiaries', beneficiarySchema);

module.exports = Beneficiary;
