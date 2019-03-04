const express = require("express");
// const router = express.Router();



module.exports =  {
	loggedInOnly : (req,res,next) => {
		if (req.isAuthenticated()) next();
		else res.redirect('/');
	},


	loggedOutOnly : (req, res, next) => {
	  if (req.isUnauthenticated()) next();
	  else res.redirect("/");
	}
}

// module.exports = {
//     sum: function(a,b) {
//         return a+b
//     },
//     multiply: function(a,b) {
//         return a*b
//     }
// };