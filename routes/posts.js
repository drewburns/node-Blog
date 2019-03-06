var express = require("express");
var posts = express.Router();
const mongoose = require('mongoose');
require("../models/user");
require("../models/post");
var Post = mongoose.model("Post");


//middle


const Auth = require('../middleware/auth');


// routes


// destroy 
posts.post('/destroy/:id', Auth.loggedInOnly, (req,res) => {
	Post.findById(req.params.id, (err,doc) => {
		if (err) {res.redirect("/")};
		if (req.user._id.toString() != doc.author.toString()) {res.redirect("/")};
		// update
		console.log("Delete----------")
		Post.find({_id: doc._id}).remove((err, data) => {
			if (err) {res.json(err)};
			res.redirect("/");
		});
	});
});

// edit 
posts.get('/edit/:id', Auth.loggedInOnly,  (req,res) => {
	Post.findById(req.params.id, (err,doc) => {
		if (err) {res.redirect("/")};
		if (req.user._id.toString() != doc.author.toString()) {res.redirect("/")};
		res.render("posts/edit", {
			post: doc
		})
	});
});

// update
posts.post("/update", Auth.loggedInOnly, (req,res) => {
		const {postId, title, body} = req.body;
		Post.findById(postId, (err,doc) => {
			if (err) {res.redirect("/")};
			if (req.user._id.toString() != doc.author.toString()) {res.redirect("/")};
			// update
			console.log("Update----------")
			Post.findOneAndUpdate({_id: doc._id}, {title: title, body: body}, (err, post) => {
				if (err) {res.json(err)};
				res.redirect(`show/${post._id}`);
			});
		});
});


// index post
posts.get("/" , (req, res) => {
	Post.find({}, null, {sort: '-created'}).populate("author").exec((err, posts) => {
		res.render("posts/index", {
			posts: posts
		})
	});
});


// show post
posts.get('/show/:id', (req,res) =>{
	Post.findById(req.params.id).populate("author").populate("tags").exec( (err,doc) => {
		// if (err) throw err;
		res.render("posts/show",{
			post: doc
		})
	});
});


// new post
posts.get("/new", Auth.loggedInOnly, (req,res) => {
	res.render("posts/new");
});

// create post
posts.post("/new", Auth.loggedInOnly, (req,res)=> {
	var newPost = new Post({
		title: req.body.title,
		body: req.body.body,
		created: Date.now(),
		author: req.user
	});
	newPost.save()
		.then((post) => {
			req.user.posts.push(post);
			req.user.save();
			res.redirect("show/" + post._id);
		})
		.catch((err) => {
			if (err.name == "ValidationError") {
				var errorsArr = [];
				for (var key in err.errors) {errorsArr.push(err.errors[key])};
				errorsArr = errorsArr.map((item) => {return item.message});

				res.render("posts/new", {
					errors: errorsArr,
					post: newPost
				});
				// res.send(errorsArr);
			} else {
				res.render("posts/new",{
					errors: ["An error occurred"],
					post: newPost
				});
				// res.json(err);
            }
		});
});

module.exports = posts;