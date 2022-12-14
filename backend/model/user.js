var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema({

	username: String,
	password: String,
	country: String,
	created_at: { type: Date, required: true, default: Date.now }


}),
	user = mongoose.model('user', userSchema);

module.exports = user;