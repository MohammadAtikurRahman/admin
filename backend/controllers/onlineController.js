

// const Transaction = require("../model/transaction");

// async function addTransaction(req, res) {
//     try {
//         const phone = req.headers['phone'];
//         const beneficiaryId = req.headers['beneficiaryid'];

//         // Ensure headers are provided
//         if (!phone || !beneficiaryId) {
//             return res.status(400).send({
//                 message: "Missing 'phone' or 'BeneficiaryId' header"
//             });
//         }

//         const transactions = req.body.map(transactionData => ({
//             ...transactionData,
//             beneficiaryId: Number(beneficiaryId),
//             beneficiaryMobile: phone,
//             timestamp: new Date() // Add current timestamp
//         }));

//         const transactionPromises = transactions.map(async transactionData => {
//             const newTransaction = new Transaction(transactionData);
//             await newTransaction.save();
//         });

//         await Promise.all(transactionPromises);

//         res.status(201).send("Transactions added successfully");
//     } catch (error) {
//         console.error("Detailed Error:", error);
//         res.status(400).send({
//             message: "An error occurred while processing transactions.",
//             error: error.message || error
//         });
//     }
// }

// async function getTransactions(req, res) {
//     try {
//         const phone = req.headers['phone'];
//         const beneficiaryId = req.headers['beneficiaryid'];

//         let query = {};
//         if (phone) {
//             query.beneficiaryMobile = phone;
//         }
//         if (beneficiaryId) {
//             query.beneficiaryId = Number(beneficiaryId);
//         }

//         const transactions = await Transaction.find(query);
//         res.status(200).json(transactions);
//     } catch (error) {
//         console.error("Detailed Error:", error);
//         res.status(400).send({
//             message: "An error occurred while retrieving transactions.",
//             error: error.message || error
//         });
//     }
// }

// module.exports = {
//     addTransaction,
//     getTransactions,
// };


const Transaction = require("../model/transaction");


async function addTransaction(req, res) {
    try {
        const phone = req.headers['phone'];
        const beneficiaryId = req.headers['beneficiaryid'];

        // Ensure headers are provided
        if (!phone || !beneficiaryId) {
            return res.status(400).send({
                message: "Missing 'phone' or 'BeneficiaryId' header"
            });
        }

        // Check if req.body is an array
        if (!Array.isArray(req.body)) {
            return res.status(400).send({
                message: "Request body should be an array of transactions"
            });
        }

        const transactions = req.body.map(transactionData => ({
            ...transactionData,
            beneficiaryId: Number(beneficiaryId),
            beneficiaryMobile: phone,
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
