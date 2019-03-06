var User = require("./models/User");
require("./models/Post");
require("./models/Tag");


var express = require("express");
var app = express();
var port = 3000;
var path = require("path");
const routes = require('./routes/index')
const posts = require("./routes/posts")
const mongoose = require('mongoose');
var passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");

var tags = require("./routes/tags");



// var bodyParser = require("bodyParser");

// config
app.set("view engine", "ejs")
const logger = (req,res,next) => {
	console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
	next();
};
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true }, (err) => {
	if (err) throw err;
	console.log("Database connected!");
});


// middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({extened: false}));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
// app.use(require('express-session')({
// 	secret: "Marko is cool",
// 	resave: true,
// 	saveUninitialized: false,
// 	cookie: { maxAge: 60000 ,secure: false },
//     rolling: true
 
// }));
var cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ["marko is cool"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next) => {
	res.locals.currentUser = req.user;
  	next();
})
// passport
passport.serializeUser((user, done) => {
	console.log("serializeUser");
	done(null, user._id);
});

passport.deserializeUser((userId,done) => {
	console.log("deserializeUser");
	User.findById(userId, (err, user) => done(err,user));
});

const local = new LocalStrategy({
		usernameField: 'email',
	},
	(email,password,done) => {
	User.findOne({email})
		.then(user => {
			console.log(user);
			if (!user || !user.validPassword(password)){
				done(null, false, {message: "Invalid email/password"});
			} else {
				done(null, user);
			}
		})
		.catch(e => done(e)); 
});

passport.use("local", local);


// Routes

app.use('/', routes);
app.use('/posts', posts);
app.use('/tags', tags);

var users = require("./routes/users")(passport);
app.use('/users', users);




// Catch 404
app.use((req,res,next) => {

	var err = new Error("Not Found");
	err.status = 404;
	res.send("404");
	next(err);
});



// server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});



module.exports = app;

