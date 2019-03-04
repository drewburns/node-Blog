var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
require("../models/User");
var User = mongoose.model("User");
var bodyParser = require("body-parser");
const Auth = require("../middleware/auth");





function authenticate(passport) {
	router.use(bodyParser.urlencoded({
    	extended: true
	}));
	router.use(bodyParser.json());
	router.get('/show/:id', (req,res) => {
		User.findById(req.body.id, (err,doc) => {
		// check if user exists
		// console.log(doc);
			res.json(doc);
		});
	});


	router.get("/login", Auth.loggedOutOnly, (req,res) => {
		res.render("users/login");
	});

	router.get("/register", Auth.loggedOutOnly, (req,res) => {
		res.render("users/register");
	});


	// router.post("/login", Auth.loggedOutOnly, passport.authenticate("local", {
	// 	successRedirect: "/",
	// 	failureRedirect: "/users/login",
	// 	failureFlash: false
	// }));

	  router.post(
	    "/login",
	    passport.authenticate("local", {
	      successRedirect: "/",
	      failureRedirect: "/users/login",
	      failureFlash: false
	    })
	  );

	router.all("/logout", Auth.loggedInOnly, (req, res) => {
		req.logout();
    	res.redirect("/");
	});

	router.post("/register", Auth.loggedOutOnly, (req,res) => {
		const {email, name, password} = req.body;
		var newUser = new User({email: email, name: name, password:password});
		// newUser.passwordHash = newUser.getHash(password);
		newUser.save()
			.then(user => {
				req.login(user, err => {
					if (err) next(err);
					else res.send("Created!")
				});
			})
			.catch(err => {
				if (err.name === "ValidationError") {
					res.json(err);
				} else next(err);
			});
	});

	return router;

}

module.exports = authenticate;

