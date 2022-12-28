var mongoose = require("mongoose");
var Schema = mongoose.Schema;




const testSchema = new Schema (



    {
        
        
        Test_datetime: Date,
        Test_duration: Date,
        Test_question: Number,
        Test_input: Number,
        Test_score: Number,

        Test_correct: Boolean




    },
    { timestamps: true }



)






const beneficiarySchema = new Schema(
    {
        name: String,  // done
      
        f_nm: String, //done
        ben_nid: String, //done
        sl: Number, //done
        ben_id: Number, //done
        m_nm: String,//done
        age: Number,// done
        dis: String,//done
        sub_dis: String,// done
        uni: String, // done
        vill: String, // done
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

        test: [testSchema],

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

