var express = require("express");
var tags = express.Router();
const mongoose = require('mongoose');
// require("../models/User");
require("../models/post");
require("../models/tag");
var Tag = mongoose.model("Tag");
var Post = mongoose.model("Post");

//middleware
const Auth = require('../middleware/auth');


tags.get("/", (req,res) => {
	Tag.find({}, null, {sort: '-created'}, (err,doc) => {
		res.render("tags/index", {
			tags: doc
		});
	});
});

// should check if the correct user but we'll skip that for now
tags.post('/destroy', Auth.loggedInOnly, (req,res) => {
	console.log("HERE");
	console.log(req.body);
	Tag.update( {_id: req.body.tagId}, { $pullAll: {posts: [req.body.postId] } }, (err, doc) => {
		Post.update( {_id: req.body.postId}, { $pullAll: {tags: [req.body.tagId] } } , (err2,doc2) => {
			res.redirect(`/posts/show/${req.body.postId}`);
		});
	});

});


tags.get('/show/:id', (req,res) => {
	Tag.findById(req.params.id).populate("posts").populate({
			path:     'posts',			
			populate: { path:  'author',
		    model: 'User' }})
		.exec((err,doc) => {
		// console.log(doc);
		res.render("tags/show", {
			tag: doc
		});
	});
});

// tags.post("/removefrompost")
tags.post("/create", Auth.loggedInOnly, (req,res) => {
	// should chck this is the correct user but oh well for bow
	// res.send(req.body);
	const {postId, name} = req.body;
	// check if name empty
	if (!postId ) { res.redirect("/")}; // something went wrong
	if (!name ) { res.redirect(`/posts/show/${postId}`)}; // probably add a flash

	// lets first search for the tag and see if it exists
	Tag.findOne({name:name}, (err, doc) => {
		if (doc == null) {
			createTag(name, postId, (err,tag) => {
				// handle error
				// use tag
				addTagToPost(postId, tag._id, (postReturn) => {
					console.log(postReturn);
					res.redirect(`/posts/show/${postId}`)
				});
			});
		} else {
			addTagToPost(postId, doc._id, (postReturn) => {
				console.log(postReturn);
				res.redirect(`/posts/show/${postId}`)
			});
		}
	})
	// if it doesn't then create it
	// then find the post
	// and insert in if it isn't already there
})


// helpers

function addTagToPost(postId, tagId, fn) {
	// add tag to post
		Post.findOneAndUpdate({_id: postId},  {$push: {'tags': tagId}}, {new: true}, (err, result) => {
			Tag.findOneAndUpdate({_id: tagId},  {$push: {'posts': postId}}, {new: true}, (err2, result2) => {
				fn(result);
			});
        });

}

function createTag(name, postId,  fn) {
	var newTag = new Tag({
		name: name,
		created: Date.now()
	});
	newTag.save()
	.then((tag) => {
		fn(null, tag);
	})
	.catch((err) => {
		fn(err,null);
	});
}


module.exports = tags;