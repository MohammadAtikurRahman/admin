const Transaction = require("../model/transaction");
const {endOfDay, startOfDay} = require("date-fns");

async function pingData(req, res) {
    try {
        const {fromDate, toDate} = req.params;
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 10;

        const skip = (page - 1) * limit;

        const totalTransctions = await Transaction.countDocuments({
            'createdAt': {
                $gte: startOfDay(fromDate),
                $lte: endOfDay(toDate)
            },
            'trxid': {
                $in: [null, 0, "", " "]
            }
        }).exec();

        const transactions = await Transaction.find({
            'createdAt': {
                $gte: startOfDay(fromDate),
                $lte: endOfDay(toDate)
            },
            'trxid': {
                $in: [null, 0, "", " "]
            }
        }).sort({'createdAt': 'desc'})
            .skip(skip)
            .limit(10)
            .exec();

        return res.status(200).json({
            fromDate,
            toDate,
            totalRecords: totalTransctions,
            page,
            totalPages: Math.ceil(totalTransctions / limit),
            transactions
        })
    } catch (error) {
        console.error("Detailed Error:", error);
        res.status(400).send({
            message: "An error occurred while processing transactions.",
            error: error.message || error
        });
    }
}

async function searchPingData(req, res) {
    try {
        const {fromDate, toDate} = req.params;
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 10;
        const keyword = req.params.keyword;
        const skip = (page - 1) * limit;

        let searchConditions = [];

        if (!isNaN(keyword)) { //Number
            if (keyword.length >= 10) {
                searchConditions.push({mob: {$regex: keyword, $options: 'i'}});
            } else {
                searchConditions.push({beneficiaryId: Number(keyword)});
            }
        }

        const totalTransctions = await Transaction.countDocuments({
            'createdAt': {
                $gte: startOfDay(fromDate),
                $lte: endOfDay(toDate)
            },
            'trxid': {
                $in: [null, 0, "", " "]
            },
            $or: searchConditions,
        }).exec();

        const transactions = await Transaction.find({
            'createdAt': {
                $gte: startOfDay(fromDate),
                $lte: endOfDay(toDate)
            },
            'trxid': {
                $in: [null, 0, "", " "]
            },
            $or: searchConditions,
        }).sort({'createdAt': 'desc'})
            .skip(skip)
            .limit(10)
            .exec();

        return res.status(200).json({
            fromDate,
            toDate,
            totalRecords: totalTransctions,
            page,
            totalPages: Math.ceil(totalTransctions / limit),
            transactions
        })
    } catch (error) {
        console.error("Detailed Error:", error);
        res.status(400).send({
            message: "An error occurred while processing transactions.",
            error: error.message || error
        });
    }
}


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

async function getLastXDaysTransactions(req, res) {
    try {
        const numberOfDays = req.params.numberOfDays;

        let query;
        if (numberOfDays === 'all') {
            query = {};
        } else {
            const days = parseInt(numberOfDays, 10);
            if (isNaN(days) || days <= 0) {
                query = {};
            } else {
                const targetDate = new Date();
                targetDate.setDate(targetDate.getDate() - days);
                query = {
                    createdAt: {
                        $gte: targetDate
                    }
                };
            }
        }
        const transactions = await Transaction.find(query);
        res.status(200).send(transactions);
    } catch (error) {
        console.error("Detailed Error:", error);
        res.status(500).send({
            message: "An error occurred while fetching the transactions.",
            error: error.message || error
        });
    }
}

async function getTransactionBasedOnBeneficiary(req, res) {
    try {
        const beneficiaryId = req.params.beneficiaryId;
        const transactions = await Transaction.find({beneficiaryId: beneficiaryId, trxid: {$ne: null}}).sort({createdAt: -1})
        return res.status(200).json({
            'message': `Found ${transactions.length}`,
            transactions
        })
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = {
    pingData,
    addTransaction,
    searchPingData,
    getLastXDaysTransactions,
    getTransactionBasedOnBeneficiary
};
