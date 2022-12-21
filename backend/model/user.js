var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const beneficiarySchema = new Schema(
    {
        name: String,
        fatherName: String,
        nid: String,
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

