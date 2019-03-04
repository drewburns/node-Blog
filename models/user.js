const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


var UserSchema = new mongoose.Schema({
	email: {type: String, validate: [validateEmail, "Please enter a valid email"],
		required: "Email required", unique: true},
	name: {type: String, required: "Name required", trim: true},
	passwordHash: {type: String, required: "Password required"},
	posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
	created: Date
});


UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// UserSchema.methods.validPassword = (password,user) => {
// 	console.log(bcrypt.hashSync(password,12));
// 	console.log(user.passwordHash);
// 	return bcrypt.compareSync(bcrypt.hashSync(password,12), user.passwordHash);
// 	// bcrypt.compare(bcrypt.hashSync(password,12), user.passwordHash, (err, res) => {
// 	// 	console.log(res);
// 	// 	return res;
// 	// });
// };


// UserSchema.methods.getHash = (password) => {
// 	return bcrypt.hashSync(password,12);
// }
UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});


// console.log(User);
var User = mongoose.model('User', UserSchema);
module.exports = User; 