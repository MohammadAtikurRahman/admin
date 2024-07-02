

const Transaction = require("../model/transaction");

async function transaction(req, res) {
    try {
        const transactions = req.body;

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

module.exports = {
    transaction,
};

