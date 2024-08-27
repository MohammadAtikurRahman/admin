const Transaction = require("../model/transaction");
const luxon = require("luxon");
const {Parser} = require('json2csv');
const TIMEZONE = 'Asia/Dhaka';

function utcDateTime(startDate, endDate) {
    let DateTime = luxon.DateTime;
    let start = DateTime.fromISO(startDate, {zone: TIMEZONE}).startOf('day').setZone('GMT');
    let end = DateTime.fromISO(endDate, {zone: TIMEZONE}).endOf("day").setZone('GMT')

    console.log('startTime', start, 'endtime', end);

    return {startTime: start, endTime: end};
}

async function exportTransactionCsv(req, res) {
    try {
        let transactions = await Transaction.find({
            'trxid': {
                $in: [null, 0, "", " "]
            }
        }, {}).sort({'createdAt': 'desc'}).exec();

        transactions = transactions.map(transaction => transaction.toJSON())
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(transactions);

        const now = luxon.DateTime.now().setZone('Asia/Dhaka').toFormat('yyyy-MM-dd_HH-mm-ss');
        const fileName = `pings_${now}.csv`;

        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'text/csv');

        return res.status(200).end(csv);
    } catch (e) {
        return res.status(401).send({message: e.message});
    }

}
async function pingData(req, res) {
    try {
        const {fromDate, toDate} = req.params;
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 10;
        const {startTime, endTime} = utcDateTime(fromDate, toDate);

        const skip = (page - 1) * limit;

        const totalTransctions = await Transaction.countDocuments({
            'createdAt': {
                $gte: startTime,
                $lte: endTime
            },
            'trxid': {
                $in: [null, 0, "", " "]
            }
        }).exec();

        const transactions = await Transaction.find({
            'createdAt': {
                $gte: startTime,
                $lte: endTime
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
            transactions,
            time: {startTime, endTime}
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
        let page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 10;
        const searchingKeyword = req.params.searchingKeyword;
        const skip = (page - 1) * limit;
        const {startTime, endTime} = utcDateTime(fromDate, toDate);

        let searchConditions = [];

        if (searchingKeyword.length >= 10) {
            searchConditions.push({beneficiaryMobile: {$regex: searchingKeyword, $options: 'i'}});
        } else {
            searchConditions.push({beneficiaryId: Number(searchingKeyword)});
        }

        const totalTransctions = await Transaction.countDocuments({
            'createdAt': {
                $gte: startTime,
                $lte: endTime
            },
            'trxid': {
                $in: [null, 0, "", " "]
            },
            $or: searchConditions,
        }).exec();

        const totalPages = Math.ceil(totalTransctions / limit)
        if (page > totalPages) {
            page = 1;
        }

        const transactions = await Transaction.find({
            'createdAt': {
                $gte: startTime,
                $lte: endTime
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
            totalPages,
            transactions,
            time: {startTime, endTime}
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
    exportTransactionCsv,
    addTransaction,
    searchPingData,
    getLastXDaysTransactions,
    getTransactionBasedOnBeneficiary
};
