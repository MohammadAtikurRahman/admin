const jwt_decode = require("jwt-decode");
const {
    findById,
    findOneAndUpdate,
    findByIdAndUpdate,
} = require("../model/user");
const User = require("../model/user");

async function addBeneficiary(req, res) {
    let user = jwt_decode(req.body.token);
    user = (await User.findById(user.id)).toJSON();

    const beneficiary = [...user.beneficiary, req.body.beneficiary];
    console.log("beneficiary", beneficiary);

    console.log("user", user);
    console.log("user.id", user._id);

    user = await User.findByIdAndUpdate(
        user._id,
        { beneficiary },
        { new: true }
    );

    return res.status(200).json({ user: user });
}

module.exports = { addBeneficiary };
