const mongoose = require('mongoose');

const Tag = new mongoose.Schema({
	name: {type: String, required: "Name required"},
	created: Date,
	posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}]
});

// middleware




mongoose.model('Tag', Tag);

module.exports = Tag;