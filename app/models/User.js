var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    facebook: {
    	id: String,
    	token: String,
    	email: String,
    	name: String,
    },
    posts: [String]
});


module.exports = mongoose.model('User', userSchema);