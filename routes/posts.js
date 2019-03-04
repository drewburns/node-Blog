var express = require("express");
var posts = express.Router();
const mongoose = require('mongoose');
require("../models/User");
require("../models/Post");
var Post = mongoose.model("Post");


//middle


// const Auth = require('../middleware/auth');
const loggedInOnly = (req,res,next) => {
	if (req.isAuthenticated()) next();
	else res.redirect('/');
};


const loggedOutOnly = (req, res, next) => {
  if (req.isUnauthenticated()) next();
  else res.redirect("/");
};



// routes

posts.get("/" , (req, res) => {
	Post.find({}, null, {sort: '-created'},(err, posts) => {
		res.render("posts/index", {
			posts: posts
		})
	});
});

posts.get('/show/:id', (req,res) =>{
	Post.findById(req.params.id, (err,doc) => {
		// if (err) throw err;
		res.render("posts/show",{
			post: doc
		})
	});
});

posts.get("/new", loggedInOnly, (req,res) => {
	res.render("posts/new");
});

posts.post("/new", loggedInOnly, (req,res)=> {
	var newPost = new Post({
		title: req.body.title,
		body: req.body.body,
		created: Date.now()
	});
	newPost.save()
		.then((post) => {
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