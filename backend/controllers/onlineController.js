const User = require("../model/user");


async function transaction(req, res) {
    req.body.forEach(transaction => {
        User.findOneAndUpdate(
            {"beneficiary.beneficiaryId": transaction.beneficiaryId},
            {
                $push: {
                    "beneficiary.$.transaction": {
                        beneficiaryId: transaction.beneficiaryId,
                        beneficiaryMobile: transaction.beneficiaryMobile,
                        type: transaction.type,
                        amount: transaction.amount,
                        trxid: transaction.trxid,
                        date: transaction.date,
                        duration: transaction.duration,
                        sub_type: transaction.sub_type,
                        duration_bkash: transaction.duration_bkash,
                        sender: transaction.sender,
                        duration_nagad: transaction.duration_nagad,
                        raw_sms: transaction.raw_sms,
                        timestamp: new Date() // Add this line to store the current timestamp


                    },
                },
            },
            {new: true},
        )
            .then(user => {
                if (!user) {
                    return res.status(404).send("Beneficiary not found");
                }
            })
            .catch(error => res.status(400).send(error));
    });
    return res.status(201).send("Transactions added successfully");
}






module.exports = {
    transaction,

};
