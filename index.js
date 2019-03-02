const express = require("express");
const app = express();
const port = 3000;


// config
app.set("view engine", "ejs")

// middleware

app.use(express.static('public'));



// server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});


app.get('/', (req,res) => {
	res.render("index");
});