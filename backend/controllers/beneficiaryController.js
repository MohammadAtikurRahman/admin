const { request } = require("express");
const jwt_decode = require("jwt-decode");
const { randomNumberNotInBeneficiaryCollection } = require("../helpers/number");
const User = require("../model/user");

const jwt = require("jsonwebtoken");
const fs = require("fs");
const moment = require('moment-timezone');
const Beneficiary = require("../model/beneficiary");

async function addBeneficiary(req, res) {
    let user = jwt_decode(req.body.token);

    const beneficiaryId = await randomNumberNotInBeneficiaryCollection(user.beneficiary);

    req.body.beneficiary["userId"] = user.id;

    if (!req.body.beneficiary.beneficiaryId) {
        req.body.beneficiary["beneficiaryId"] = beneficiaryId;
    }

    try {
        const createdBeneficiary = await Beneficiary.create(req.body.beneficiary)
        return res.status(200).json({ 'message': 'Successfully created beneficiary', 'beneficiary': createdBeneficiary });
    } catch (e) {
        return res.status(400).json({ 'message': 'Failed to create beneficiary: ' + e.message });
    }
}

async function updateBeneficiary(req, res) {
    const beneficiary = request.body.beneficiary;

    const updatedBeneficiary = await Beneficiary.findOneAndUpdate(
        { "beneficiaryId": req.params.id },
        beneficiary
    );

    if (!updatedBeneficiary) {
        return res.status(404).json({ error: "Beneficiary not found" });
    }

    return res.status(200).json({ 'message': 'Successfully updated beneficiary', updatedBeneficiary });
}

async function deleteBeneficiary(req, res) {
    try {
        const beneficiaryId = req.params.id;
        await Beneficiary.findOneAndDelete({ 'beneficiaryId': beneficiaryId })
        return res.status(200).json({ 'message': 'Deleted beneficiary successfully.' })
    } catch (e) {
        return res.status(500).json({ 'message': 'Failed to delete beneficiary' });
    }
}

async function addBeneficiaryInBulk(req, res) {
    let user = jwt_decode(req.body.token);
    try {
        user = await User.findByIdAndUpdate(
            user.id,
            { $push: { beneficiary: { $each: req.body.beneficiary } } },
            { new: true },
        );
        return res.status(200).json({ user: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}


async function saveTest(req, res) {
    let user = jwt_decode(req.body.token);

    user = (await User.findById(user.id)).toJSON();

    const beneficiaryId = await randomNumberNotInBeneficiaryCollection(user.beneficiary);

    req.body.beneficiary["beneficiaryId"] = beneficiaryId;

    let beneficiary = [...user.beneficiary, req.body.beneficiary];
    console.log(beneficiary);

    user = await User.findByIdAndUpdate(user._id, { beneficiary }, { new: true })
        .select("-_id")
        .select("-id")
        .select("-username")
        .select("-password")
        .select("-created_at")
        .select("-beneficiary.test");

    return res.status(200).json({ user: user });
}

async function getBeneficiaries(req, res) {
    try {
        const user = await jwt_decode(req.headers?.token);
        let beneficiaries = (await Beneficiary.find({ userId: user.id }).limit(10).exec());
        return res.status(200).json({ beneficiaries });
    } catch (e) {
        return res.status(401).send({ message: e.message });
    }
}

async function searchBeneficiaries(req, res) {
    const keyword = req.params.keyword;

    try {
        const searchConditions = [
            { name: { $regex: keyword, $options: 'i' } }
        ];
        // If the keyword is numeric, add the beneficiaryId condition
        if (!isNaN(keyword)) {
            searchConditions.push({ beneficiaryId: Number(keyword) });
        }

        const beneficiaries = await Beneficiary.find({
            $or: searchConditions
        }).limit(100);

        return res.status(200).json({
            message: `Found ${beneficiaries.length} beneficiaries`,
            beneficiaries
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function getToken({ beneficiaryId, userId }) {
    let token = await jwt.sign({ beneficiaryId, userId }, "shhhhh11111", { expiresIn: "1d" });
    console.log(token);
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
    console.log(req.body);
    let user = await User.findOne({ userId: req.body.userId });
    if (!req.body || !req.body.userId || !req.body.password) {
        return res.status(400).json({ error: "Username or Password missing" });
    }
    if (!user) {
        return res.status(401).json({ error: "User Not Found" });
    }
    if (user.password === req.body.password) {
        let token = await getToken(user);
        return res.status(200).json({
            message: "Login Successfully.",
            token: token,
            status: true,
        });
    }
    return res.status(401).json({ message: "Something went wrong." });
}




async function newlogin(req, res) {
    const beneficiaryId = parseInt(req.body.beneficiaryId);
    const mob = req.body.mob;

    // Find a user document with a matching beneficiaryId and mob within the array
    User.findOne(
        { "beneficiary": { $elemMatch: { "beneficiaryId": beneficiaryId, "mob": mob } } },
        (err, user) => {
            if (err) {
                // Handle error
                res.status(500).send({ error: err });
            } else {
                if (user) {
                    // Find the index of the matching beneficiary
                    const beneficiaryIndex = user.beneficiary.findIndex(ben => ben.beneficiaryId === beneficiaryId);

                    if (beneficiaryIndex !== -1) {
                        // Check if loggedin_time is not set
                        if (!user.beneficiary[beneficiaryIndex].loggedin_time) {
                            const loggedin_time = moment().utc().add(6, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                            const updatePath = {
                                [`beneficiary.${beneficiaryIndex}.loggedin_time`]: loggedin_time
                            };

                            User.updateOne(
                                { _id: user._id },
                                { $set: updatePath },
                                (updateErr, updateResult) => {
                                    if (updateErr) {
                                        // Handle error
                                        res.status(500).send({ error: updateErr });
                                    } else {
                                        // loggedin_time updated
                                        res.status(200).send({
                                            message: "Login successful, loggedin_time set for the first time",
                                            loggedin_time: loggedin_time
                                        });
                                    }
                                }
                            );
                        } else {
                            // loggedin_time is already set, login successful without updating loggedin_time
                            res.status(200).send({
                                message: "Login successful, loggedin_time not updated",
                                loggedin_time: user.beneficiary[beneficiaryIndex].loggedin_time
                            });
                        }
                    } else {
                        // Beneficiary not found
                        res.status(404).send({ message: "Beneficiary not found" });
                    }
                } else {
                    // Login failed
                    res.status(401).send({ message: "Invalid beneficiaryId or mob" });
                }
            }
        }
    );
}


async function addBeneficiaryScore(req, res) {
    const { beneficiaryId } = req.body;
    console.log(req.body);

    let user = await User.findOne({ "beneficiary.beneficiaryId": beneficiaryId });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    let beneficiary = user.beneficiary.find(b => b.beneficiaryId == beneficiaryId);

    if (!beneficiary) {
        return res.status(400).json({ message: "Beneficiary not found" });
    }

    let result = await User.updateOne(
        { "beneficiary.beneficiaryId": beneficiaryId },
        {
            $set: {
                "beneficiary.$.score1": req.body?.score1,
                "beneficiary.$.observation": req.body?.observation,
                "beneficiary.$.duration": req.body?.duration,
                "beneficiary.$.whotaketheexam": req.body?.userId,
                "beneficiary.$.observation_new": req.body?.observation_new
            },
        }
    );

    if (result.nModified == 0) {
        return res.status(400).json({ message: "Failed to update beneficiary score" });
    }

    return res.status(200).json({ message: "Beneficiary score & observation saved" });
}


async function examStatus(req, res) {
    const { beneficiaryId } = req.body;
    console.log(req.body);
    let user = await User.findOne({ "beneficiary.beneficiaryId": beneficiaryId });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    let beneficiary = user.beneficiary.find(b => b.beneficiaryId == beneficiaryId);
    if (!beneficiary) {
        return res.status(400).json({ message: "Beneficiary not found" });
    }
    let result = await User.updateOne(
        { "beneficiary.beneficiaryId": beneficiaryId },
        {
            $set: {
                "beneficiary.$.test_status": req.body?.test_status,
                "beneficiary.$.excuses": req.body?.excuses,
            },
        },
    );
    if (result.nModified == 0) {
        return res.status(400).json({ message: "Failed to update " });
    }
    return res.status(200).json({ message: "Beneficiary test status and excuess saved" });
}

async function enumeratorObservation(req, res) {
    const { beneficiaryId, observation_new } = req.body;

    console.log(req.body);

    let user = await User.findOne({ "beneficiary.beneficiaryId": beneficiaryId });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    let beneficiary = user.beneficiary.find(b => b.beneficiaryId == beneficiaryId);
    if (!beneficiary) {
        return res.status(400).json({ message: "Beneficiary not found" });
    }

    let result = await User.updateOne(
        { "beneficiary.beneficiaryId": beneficiaryId },
        {
            $set: {
                "beneficiary.$.enumerator_observation": req.body?.enumerator_observation,
                "beneficiary.$.excuses": req.body?.excuses,
                "beneficiary.$.test_status": req.body?.test_status,
                "beneficiary.$.whotaketheexam": req.body?.userId,
                "beneficiary.$.observation_new": observation_new   // added this line
            }
        }
    );

    if (result.nModified == 0) {
        return res.status(400).json({ message: "Failed to update" });
    }

    return res.status(200).json({ message: "enumerator observation saved" });
}


async function lastPagetext(req, res) {
    try {
        const user = await User.findOne({ "beneficiary.beneficiaryId": req.params.beneficiaryId })
            .select("-username")
            .select("-password")
            .select("-id")
            .select("-_id")
            .select("-userId")
            .select("-createdAt")
            .select("-updatedAt")
            .select("-__v")
            .select("-beneficiary._id")
            .select("-beneficiary.ben_nid")
            .select("-beneficiary.ben_id")
            .select("-beneficiary.sl")
            .select("-beneficiary.age")
            .select("-beneficiary.dis")

            .select("-beneficiary.relgn")
            .select("-beneficiary.job")
            .select("-beneficiary.test")
            .select("-beneficiary.createdAt")

            .select("-beneficiary.mob")
            .select("-beneficiary.pgm")
            .select("-beneficiary.pass")
            .select("-beneficiary.bank")
            .select("-beneficiary.branch")
            .select("-beneficiary.r_out")
            .select("-beneficiary.transaction")

            .select("-beneficiary.mob_1")
            .select("-beneficiary.ben_sts")
            .select("-beneficiary.nid_sts")
            .select("-beneficiary.a_sts")

            .select("-beneficiary.accre")
            .select("-beneficiary.f_allow")
            .select("-beneficiary.mob_own")
            .select("-beneficiary.updatedAt")
            .select("-beneficiary.m_nm")
            .select("-beneficiary.f_nm")
            .select("-beneficiary.dob")
            .select("-beneficiary.sub_dis")
            .select("-beneficiary.uni")
            .select("-beneficiary.vill")
            .select("-beneficiary.gen")
            .select("-beneficiary.duration")
            .select("-beneficiary.score1");












        if (!user) {
            return res.status(404).send("Beneficiary not found");
        }

        const beneficiary = user.beneficiary.find(b => b.beneficiaryId == req.params.beneficiaryId);
        if (!beneficiary) {
            return res.status(404).send("Beneficiary not found");
        }
        res.send(beneficiary);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


async function saveMultiScore(req, res) {
    const beneficiaries = req.body;

    for (let i = 0; i < beneficiaries.length; i++) {
        let beneficiary = beneficiaries[i];
        let { userId, beneficiaryId, score1, observation, duration, observation_new } = beneficiary;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        let result = await User.findOneAndUpdate(
            { "beneficiary.beneficiaryId": beneficiaryId },
            {
                $set: {
                    "beneficiary.$.score1": score1,
                    "beneficiary.$.observation": observation,
                    "beneficiary.$.duration": duration,
                    "beneficiary.$.whotaketheexam": userId,
                    "beneficiary.$.observation_new": observation_new
                },
            },
            { new: true },
        );
    }
    return res.status(200).json({ message: "Multiple beneficiaries updated" });
}


async function saveMultiObservation(req, res) {
    const beneficiaries = req.body;
    for (let i = 0; i < beneficiaries.length; i++) {
        let beneficiary = beneficiaries[i];
        let { userId, beneficiaryId, enumerator_observation, test_status } = beneficiary;
        let result = await User.findOneAndUpdate(
            { "beneficiary.beneficiaryId": beneficiaryId },
            {
                $set: {
                    "beneficiary.$.enumerator_observation": enumerator_observation,
                    "beneficiary.$.test_status": test_status,
                    "beneficiary.$.whotaketheexam": req.body?.userId,

                },
            },
            { new: true },
        );
    }
    return res.status(200).json({ message: "Multiple enumerator observation and ofline after data updated" });
}


async function benenScore(req, res) {
    const { userId, beneficiaryId } = req.body;
    const beneficiaries = (await User.findOne({ userId: userId })).toJSON().beneficiary;

    let index = getBeneficiaryIndex(beneficiaries, beneficiaryId);

    if (index !== null) beneficiaries[index]["score1"] = req.body?.score1;

    if (index !== null) beneficiaries[index]["time"] = req.body?.time;

    if (index !== null) beneficiaries[index]["duration"] = req.body?.duration;

    const user = (
        await User.findOneAndUpdate({ userId: userId }, { beneficiary: beneficiaries }, { new: true })
    ).toJSON();

    console.log(user);

    const whoLoggedIn = await User.findOne({ userId: userId });

    if (existsInArray(beneficiaries, beneficiaryId)) {
        return res.status(200).json({ whoLoggedIn });
    }

    return res.status(400).json({ error: "Credentials does not exists" });
}

async function saveTestScore(req, res) {
    const data = jwt_decode(req.body.beneficiaryToken);
    const beneficiaries = (await User.findOne({ userId: data.userId })).toJSON().beneficiary;

    console.log(beneficiaries);

    let index = getBeneficiaryIndex(beneficiaries, data.beneficiaryId);
    console.log(index);

    if (index) beneficiaries[index]["score1"] = req.body.score1;

    if (index) beneficiaries[index]["time"] = req.body.time;

    if (index) beneficiaries[index]["duration"] = req.body.duration;

    console.log("at index", beneficiaries[index]);

    const user = (
        await User.findOneAndUpdate(
            { userId: data.userId },
            { beneficiary: beneficiaries },
            { new: true },
        )
    ).toJSON();

    console.log(user);

    return res.json({ message: "score saved", beneficiary: user.beneficiary[index] });
}
const SECRET = 'shhhhh11111';  // Your JWT secret

async function addobservation(req, res) {
    try {
        // Decode the JWT and extract the userId
        const decodedToken = jwt.verify(req.body.beneficiaryToken, SECRET);
        const userId = decodedToken.userId;

        if (!userId) {
            return res.status(401).send('Invalid token.');
        }

        // Find the user containing the specific beneficiaryId
        let user = await User.findOne({ "beneficiary.beneficiaryId": req.body.beneficiaryId });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        let beneficiary = user.beneficiary.find(b => b.beneficiaryId == req.body.beneficiaryId);
        if (!beneficiary) {
            return res.status(400).json({ message: "Beneficiary not found" });
        }

        // Update the observation_new field for that beneficiary
        let result = await User.updateOne(
            { "beneficiary.beneficiaryId": req.body.beneficiaryId },
            {
                $set: {
                    "beneficiary.$.observation_new": req.body.observation_new
                },
            }
        );

        if (result.nModified == 0) {
            return res.status(400).json({ message: "Failed to update observation" });
        }

        return res.status(200).json({ message: "Observation added successfully", beneficiary });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send('Invalid token.');
        }
        console.error('Error updating observation:', error);
        res.status(500).send('Internal server error.');
    }
}



module.exports = {
    addBeneficiary,
    addBeneficiaryInBulk,
    getBeneficiaries,
    searchBeneficiaries,
    beneficiaryLogin,
    benenScore,
    addBeneficiaryScore,
    saveTestScore,
    saveTest,
    updateBeneficiary,
    deleteBeneficiary,
    saveMultiScore,
    newlogin,
    examStatus,
    enumeratorObservation,
    lastPagetext,
    saveMultiObservation,
    addobservation,
};
