var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");
var colors = require("colors/safe");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "BamazonDB"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	showMeTheItems();
});

function showMeTheItems() {
	console.log(colors.black.underline.bgWhite("Welcome to Bamazon!\n" + 
		"Here are all of the items we have for sale"));
	connection.query("SELECT * FROM products", 
		function(err, res) {
			if (err) throw err;
			// console.log(res);
			for (var i = 0; i < res.length; i++) {
			console.log(colors.black.bgWhite(res[i].item_id + ") " + res[i].product_name + " - $" + res[i].price.toFixed(2)));
		}
		});
	purchaseSomeStuff();
};

function purchaseSomeStuff() {
	console.log(colors.black.underline.bgWhite("Welcome to Bamazon!\n" + 
		"What item would you like to purchase?"));
};