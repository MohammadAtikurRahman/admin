var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const beneficiarySchema = new Schema({
	name: String ,
	created_at: { type: Date, required: true, default: Date.now },

})

const userSchema = new Schema({
	username: String,
	password: String,
	country: String,
	created_at: { type: Date, required: true, default: Date.now },
	beneficiary: [beneficiarySchema]
}),
	




user = mongoose.model('user', userSchema);

module.exports = user;