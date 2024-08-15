const User = require('../model/user');
const Beneficiary = require('../model/beneficiary');

async function migrateBeneficiaries(req, res) {
    try {
        const users = await User.find({}, { beneficiary: 1 });
        for (const user of users) {
            if (user.beneficiary && user.beneficiary.length > 0) {
                user.beneficiary.map(async (beneficiary) => {
                    beneficiary = beneficiary.toJSON();
                    delete beneficiary._id;
                    beneficiary.userId = user.id;
                    await Beneficiary.updateOne({ beneficiaryId: beneficiary.beneficiaryId }, { $set: beneficiary }, { upsert: true, timestamps: false });
                })
            }
            console.log('Data migration completed successfully.');
        }
        return res.status(200).json({ "beneficiaries": await Beneficiary.find() })
    } catch (error) {
        return res.status(200).json({ "error": error.message })
    }
}

module.exports = {
    migrateBeneficiaries
}
