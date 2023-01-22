const {request} = require("express");
const jwt_decode = require("jwt-decode");
const {randomNumberNotInBeneficiaryCollection} = require("../helpers/number");
const {findById, findOneAndUpdate, findByIdAndUpdate} = require("../model/user");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");

async function addBeneficiary(req, res) {
    let user = jwt_decode(req.body.token);

    const beneficiaryId = await randomNumberNotInBeneficiaryCollection(user.beneficiary);

    if (
        req.body.beneficiary?.beneficiaryId === null ||
        req.body.beneficiary?.beneficiary.beneficiaryId === ""
    ) {
        req.body.beneficiary["beneficiaryId"] = beneficiaryId;
    }

    user = await User.findByIdAndUpdate(
        user.id,
        {$push: {beneficiary: req.body.beneficiary}},
        {new: true},
    );

    return res.status(200).json({user: user});
}

async function updateBeneficiary(req, res) {
    const {
        name,
        accre,
        age,
        bank,
        ben_id,
        ben_nid,
        ben_sts,
        beneficiaryId,
        branch,
        dis,
        dob,
        duration,
        f_allow,
        f_nm,
        gen,
        job,
        m_nm,
        mob,
        mob_1,
        mob_own,
        nid_sts,
        pass,
        pgm,
        r_out,
        relgn,
        score1,
        sl,
        sub_dis,
        test,
        u_nm,
        uni,
        vill,
    } = req.body.beneficiary;
    const updatedBeneficiary = await User.findOneAndUpdate(
        {"beneficiary._id": req.params.id},
        {
            $set: {
                "beneficiary.$.name": name,
                "beneficiary.$.accre": accre,
                "beneficiary.$.age": age,
                "beneficiary.$.bank": bank,
                "beneficiary.$.ben_id": ben_id,
                "beneficiary.$.ben_nid": ben_nid,
                "beneficiary.$.ben_sts": ben_sts,
                "beneficiary.$.beneficiaryId": beneficiaryId,
                "beneficiary.$.branch": branch,
                "beneficiary.$.dis": dis,
                "beneficiary.$.dob": dob,
                "beneficiary.$.duration": duration,
                "beneficiary.$.f_allow": f_allow,
                "beneficiary.$.f_nm": f_nm,
                "beneficiary.$.gen": gen,
                "beneficiary.$.job": job,
                "beneficiary.$.m_nm": m_nm,
                "beneficiary.$.mob": mob,
                "beneficiary.$.mob_1": mob_1,
                "beneficiary.$.mob_own": mob_own,
                "beneficiary.$.name": name,
                "beneficiary.$.nid_sts": nid_sts,
                "beneficiary.$.pass": pass,
                "beneficiary.$.pgm": pgm,
                "beneficiary.$.r_out": r_out,
                "beneficiary.$.relgn": relgn,
                "beneficiary.$.score1": score1,
                "beneficiary.$.sl": sl,
                "beneficiary.$.sub_dis": sub_dis,
                "beneficiary.$.test": test,
                "beneficiary.$.u_nm": u_nm,
                "beneficiary.$.uni": uni,
                "beneficiary.$.vill": vill,
            },
        },
        {new: true},
    );

    if (!updatedBeneficiary) {
        return res.status(404).json({error: "Beneficiary not found"});
    }

    return res.status(200).json({updatedBeneficiary});
}

async function deleteBeneficiary(req, res) {
    User.findOneAndUpdate({}, {$pull: {beneficiary: {_id: req.params.id}}}, (err, data) => {
        if (err) return res.status(400).send(err);
        if (!data) return res.status(404).send("Beneficiary not found");
        res.send("Beneficiary deleted successfully");
    });
}
async function addBeneficiaryInBulk(req, res) {
    let user = jwt_decode(req.body.token);
    for (let i = 0; i < req.body.beneficiary.length; i++) {
        user = await User.findByIdAndUpdate(
            user.id,
            {$push: {beneficiary: req.body.beneficiary[i]}},
            {new: true},
        );
    }

    return res.status(200).json({user: user});
}

async function saveTest(req, res) {
    let user = jwt_decode(req.body.token);

    user = (await User.findById(user.id)).toJSON();

    const beneficiaryId = await randomNumberNotInBeneficiaryCollection(user.beneficiary);

    req.body.beneficiary["beneficiaryId"] = beneficiaryId;

    let beneficiary = [...user.beneficiary, req.body.beneficiary];
    console.log(beneficiary);

    user = await User.findByIdAndUpdate(user._id, {beneficiary}, {new: true})
        .select("-_id")
        .select("-id")
        .select("-username")
        .select("-password")
        .select("-created_at")
        .select("-beneficiary.test");

    // const data = user;
    // const formatted_data = data[0]
    // // extact_data = formatted_data['beneficiary']
    //  console.log("done",user)

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
    // const {userId, beneficiaryId} = req.body;

    // const beneficiaries = (await User.findOne({userId: userId})).toJSON().beneficiary;
    // const whoLoggedIn = await User.findOne({userId: userId}).select("-beneficiary");

    // console.log("2", whoLoggedIn);
    // if (existsInArray(beneficiaries, beneficiaryId)) {
    //     const token = await getToken({userId, beneficiaryId});

    //     return res.status(200).json({beneficiaryToken: token, whoLoggedIn});
    // }

    // return res.status(400).json({error: "Credentials does not exists"});

    console.log(req.body);
    let user = await User.findOne({userId: req.body.userId});
    if (!req.body || !req.body.userId || !req.body.password) {
        return res.status(400).json({error: "Username or Password missing"});
    }
    if (!user) {
        return res.status(401).json({error: "User Not Found"});
    }
    if (user.password === req.body.password) {
        let token = await getToken(user);
        return res.status(200).json({
            message: "Login Successfully.",
            token: token,
            status: true,
        });
    }
    return res.status(500).json({message: "Something went wrong."});
}

async function addBeneficiaryScore(req, res) {
    const {userId, beneficiaryId} = req.body;
    console.log(req.body);
    let result = await User.findOneAndUpdate(
        {userId: userId, "beneficiary.beneficiaryId": beneficiaryId},
        {
            $set: {
                "beneficiary.$.score1": req.body?.score1,
                "beneficiary.$.score2": req.body?.score2,
                "beneficiary.$.duration": req.body?.duration,
            },
        },
        {new: true},
    );
    return res.status(200).json(result);
}




async function saveMultiScore(req, res) {
    const beneficiaries = req.body;
    for (let i = 0; i < beneficiaries.length; i++) {
        let beneficiary = beneficiaries[i];
        let { userId, beneficiaryId, score1, score2, duration } = beneficiary;
        let result = await User.findOneAndUpdate(
            { userId: userId, "beneficiary.beneficiaryId": beneficiaryId },
            {
                $set: {
                    "beneficiary.$.score1": score1,
                    "beneficiary.$.score2": score2,
                    "beneficiary.$.duration": duration,
                },
            },
            { new: true },
        );
    }
    return res.status(200).json({ message: "Multiple beneficiaries updated" });

}





async function benenScore(req, res) {
    const {userId, beneficiaryId} = req.body;
    const beneficiaries = (await User.findOne({userId: userId})).toJSON().beneficiary;

    let index = getBeneficiaryIndex(beneficiaries, beneficiaryId);

    if (index !== null) beneficiaries[index]["score1"] = req.body?.score1;

    if (index !== null) beneficiaries[index]["time"] = req.body?.time;

    if (index !== null) beneficiaries[index]["duration"] = req.body?.duration;

    const user = (
        await User.findOneAndUpdate({userId: userId}, {beneficiary: beneficiaries}, {new: true})
    ).toJSON();

    console.log(user);

    const whoLoggedIn = await User.findOne({userId: userId});

    if (existsInArray(beneficiaries, beneficiaryId)) {
        return res.status(200).json({whoLoggedIn});
    }

    return res.status(400).json({error: "Credentials does not exists"});
}

async function saveTestScore(req, res) {
    const data = jwt_decode(req.body.beneficiaryToken);
    const beneficiaries = (await User.findOne({userId: data.userId})).toJSON().beneficiary;

    console.log(beneficiaries);

    let index = getBeneficiaryIndex(beneficiaries, data.beneficiaryId);
    console.log(index);

    if (index) beneficiaries[index]["score1"] = req.body.score1;

    if (index) beneficiaries[index]["time"] = req.body.time;

    if (index) beneficiaries[index]["duration"] = req.body.duration;

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

module.exports = {
    addBeneficiary,
    addBeneficiaryInBulk,
    getBeneficiaries,
    beneficiaryLogin,
    benenScore,
    addBeneficiaryScore,
    saveTestScore,
    saveTest,
    updateBeneficiary,
    deleteBeneficiary,
    saveMultiScore,
};
