const mongoose = require('mongoose');

const Post = new mongoose.Schema({
	title: {type: String, required: "Title required"},
	body: {type: String, required: "Please enter a body"},
	created: Date,
	author: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

// middleware


mongoose.model('Post', Post);

module.exports = Post;