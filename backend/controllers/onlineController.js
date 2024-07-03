
const Transaction = require("../model/transaction");

async function addTransaction(req, res) {
    try {
        console.log("Request Headers:", req.headers);
        console.log("Request body:", req.body);

        let transactions = req.body;

        // If the body is not an array or is empty, return an error
        if (!Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).send({
                message: "Request body should be a non-empty array of transactions"
            });
        }

        transactions = transactions.map(transactionData => ({
            ...transactionData,
            timestamp: new Date() // Add current timestamp
        }));

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
        const transactions = await Transaction.find();
        res.status(200).send(transactions);
    } catch (error) {
        console.error("Detailed Error:", error);
        res.status(500).send({
            message: "An error occurred while fetching transactions.",
            error: error.message || error
        });
    }
}


module.exports = {
    addTransaction,
    getTransactions,
};
