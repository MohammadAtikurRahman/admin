var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const beneficiarySchema = new Schema(
    {
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
        mob: Number,
        pgm: String,
        pass: Number,
        bank: String,
        branch: String,
      
        r_out: String,

        
        mob_1: String,
        mob_own:String,

        ben_sts: String,
        nid_sts: String,


        a_sts: String,

        
        u_nm: String,
        dob: Date,
        accre: Date,
        f_allow: Date,

    },
{ timestamps: true }
);

const userSchema = new Schema(
    {
        username: String,
        password: String,
        country: String,
        beneficiary: [beneficiarySchema],
    },
    { timestamps: true }
);

const user = mongoose.model("user", userSchema);
module.exports = user;

