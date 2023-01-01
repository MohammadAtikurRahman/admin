var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let nextId = 10000;
nextId = Math.floor(10000 + Math.random() * 90000);

const nextIdBen = 10000;
const testSchema = new Schema(
    {
        Test_datetime: Date,
        Test_duration: Date,
        Test_question: Number,
        Test_input: Number,
        Test_score: Number,

        Test_correct: Boolean,
    },
    {timestamps: true},
);

const beneficiarySchema = new Schema(
    {
        beneficiaryId: Number,
        score: Number,

        name: String, // done
        f_nm: String, //done
        ben_nid: String, //done
        sl: Number, //done
        ben_id: Number, //done
        m_nm: String, //done
        age: Number, // done
        dis: String, //done
        sub_dis: String, // done
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
        mob_own: String,

        ben_sts: String,
        nid_sts: String,

        a_sts: String,

        u_nm: String,
        dob: Date,
        accre: Date,
        f_allow: Date,

        test: [testSchema],
    },
    {timestamps: true},
);

const userSchema = new Schema(
    {
        id: {type: Number, default: () => nextId++},
        userId: Number,
        username: String,
        password: String,
        country: String,
        beneficiary: [beneficiarySchema],
    },
    {timestamps: true},
);

// userSchema.method('toClient', function() {
//     var obj = this.toObject();

//     //Rename fields
//     obj.id = obj._id;
//     delete obj._id;

//     return obj;
// });

const user = mongoose.model("user", userSchema);
module.exports = user;
