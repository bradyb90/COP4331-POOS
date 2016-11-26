var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var manager = false;
var receptionist = false;

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	reservation : {
			startDate: { type: String, default: 'none' },
			enddate: { type: String, default: 'none'},
			occupants: { type: String, default: 'none'},
			roomtype: { type: String, default: 'none'} 
		},
	accountlevel: { type: String, default: '1' },
	status: {type: String, default: 'checkedout'}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

