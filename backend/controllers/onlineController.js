
const Transaction = require("../model/transaction");

async function addTransaction(req, res) {
    try {
        console.log("Request Headers:", req.headers);

        console.log("Res Headers:", res);


        const phone = req.headers['phone'];
        const beneficiaryId = req.headers['beneficiaryid'];

        // Ensure headers are provided
        if (!phone || !beneficiaryId) {
            return res.status(400).send({
                message: "Missing 'phone' or 'BeneficiaryId' header"
            });
        }

        let transactions = req.body;

        // If the body is not an array or is empty, create a default transaction
        if (!Array.isArray(transactions) || transactions.length === 0) {
            transactions = [{
                beneficiaryId: Number(beneficiaryId),
                beneficiaryMobile: phone,
                type: "default",
                amount: 0,
                duration: 0,
                trxid: "N/A",
                sub_type: "N/A",
                date: new Date().toISOString(),
                duration_bkash: 0,
                sender: "N/A",
                duration_nagad: 0,
                raw_sms: "N/A",
                timestamp: new Date() // Add current timestamp
            }];
        } else {
            transactions = transactions.map(transactionData => ({
                ...transactionData,
                beneficiaryId: Number(beneficiaryId),
                beneficiaryMobile: phone,
                timestamp: new Date() // Add current timestamp
            }));
        }

        const transactionPromises = transactions.map(async transactionData => {
            const newTransaction = new Transaction(transactionData);
            await newTransaction.save();
        });

        await Promise.all(transactionPromises);

        res.status(201).send("Transactions added successfully");
    } catch (error) {
        console.error("Detailed Error:", error);
        res.status(400).send({
            message: "An error occurred while processing transactions.",
            error: error.message || error
        });
    }
}


async function getTransactions(req, res) {
    try {
        const phone = req.headers['phone'];
        const beneficiaryId = req.headers['beneficiaryid'];

        let query = {};
        if (phone) {
            query.beneficiaryMobile = phone;
        }
        if (beneficiaryId) {
            query.beneficiaryId = Number(beneficiaryId);
        }

        const transactions = await Transaction.find(query);
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Detailed Error:", error);
        res.status(400).send({
            message: "An error occurred while retrieving transactions.",
            error: error.message || error
        });
    }
}

module.exports = {
    addTransaction,
    getTransactions,
};
