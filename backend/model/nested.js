const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    time: Date,
    value: String
});

const nodeSchema = new Schema({
    name: String,
    description: String,
    number: Number,
    status: String,
    lastSeen: Date,
    data: [dataSchema]
});

const siteSchema = new Schema({
    code: String,
    name: String,
    description: String,
    totalNodes: Number,
    nodes: [nodeSchema]
});

const Site = mongoose.model('site',siteSchema);
module.exports = Site;