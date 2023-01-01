const {request} = require("express");
const jwt_decode = require("jwt-decode");
const {randomNumberNotInBeneficiaryCollection} = require("../helpers/number");
const {findById, findOneAndUpdate, findByIdAndUpdate} = require("../model/user");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

async function addBeneficiary(req, res) {
    let user = jwt_decode(req.body.token);

    user = (await User.findById(user.id)).toJSON();

    const beneficiaryId = await randomNumberNotInBeneficiaryCollection(user.beneficiary);

    req.body.beneficiary["beneficiaryId"] = beneficiaryId;

    let beneficiary = [...user.beneficiary, req.body.beneficiary];
    console.log(beneficiary);

    user = await User.findByIdAndUpdate(user._id, {beneficiary}, {new: true});

    return res.status(200).json({user: user});
}
async function getBeneficiaries(req, res) {
    const user = jwt_decode(req.headers?.token);
    let beneficiaries = (await User.findById(user.id))?.toJSON()?.beneficiary;
    return res.status(200).json({beneficiaries});
}

async function getToken({beneficiaryId, userId}) {
    let token = await jwt.sign({beneficiaryId, userId}, "shhhhh11111", {expiresIn: "1d"});
    return token;
}

function existsInArray(arr = [], x) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]?.beneficiaryId === x) {
            return true;
        }
    }
    return false;
}

function getBeneficiaryIndex(arr, beneficiaryId) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]?.beneficiaryId === beneficiaryId) {
            return i;
        }
    }
    return null;
}

async function beneficiaryLogin(req, res) {
    const {userId, beneficiaryId} = req.body;
    const beneficiaries = (await User.findOne({userId: userId})).toJSON().beneficiary;

    if (existsInArray(beneficiaries, beneficiaryId)) {
        console.log("here");
        const token = await getToken({userId, beneficiaryId});
        return res.status(200).json({beneficiaryToken: token});
    }

    return res.status(400).json({error: "Credentials does not exists"});
}

async function saveTestScore(req, res) {
    const data = jwt_decode(req.body.beneficiaryToken);
    const beneficiaries = (await User.findOne({userId: data.userId})).toJSON().beneficiary;

    console.log(beneficiaries);
    let index = getBeneficiaryIndex(beneficiaries, data.beneficiaryId);
    console.log(index);
    if (index) beneficiaries[index]["score"] = req.body.score;
    console.log("at index", beneficiaries[index]);

    const user = (
        await User.findOneAndUpdate(
            {userId: data.userId},
            {beneficiary: beneficiaries},
            {new: true},
        )
    ).toJSON();

    console.log(user);

    return res.json({message: "score saved", beneficiary: user.beneficiary[index]});
}

module.exports = {addBeneficiary, getBeneficiaries, beneficiaryLogin, saveTestScore};
