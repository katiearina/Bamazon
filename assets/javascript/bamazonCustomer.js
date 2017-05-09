var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");
var colors = require("colors/safe");

var itemToBuy;
var itemQuantity;

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "BamazonDB"
});

connection.connect(function(err) {
	if (err) throw err;
	// console.log("connected as id " + connection.threadId);
});

function showMeTheItems() {
	console.log("------------------------------");
		console.log("Welcome to Bamazon!\n" + 
			"Here are all of the items we have for sale:");
		connection.query("SELECT * FROM products", 
			function(err, res) {
				if (err) throw err;
				// console.log(res);
				for (var i = 0; i < res.length; i++) {
				console.log(res[i].item_id + ") " + res[i].product_name + " - $" + res[i].price.toFixed(2));
			}

			console.log("------------------------------");

			inquirer.prompt([
			{
				name: "wanttobuy",
				type: "list",
				message: "Would you like to buy something?",
				choices: ["Yes, please.",
					// "Maybe, please remind me what you have for sale again.",
					"No, thank you. I'd like to quit for now."]
			}

				]).then(function(answer) {
					if (answer.wanttobuy === "Yes, please.") {
					console.log("What item would you like to purchase?");
					purchaseSomeStuff();
					}

					// else if (answer.wanttobuy === "Maybe, please remind me what you have for sale again.") {
					// 	showMeTheItems();
					// }

					else if (answer.wanttobuy === "No, thank you. I'd like to quit for now.") {
						connection.end();
						console.log("Thank you for shopping!");
					}
				});
			});
};

function purchaseSomeStuff() {
	inquirer.prompt([
	{
		name: "itemtobuy",
		message: "What is the ID number of the item you'd like to purchase?"
	},
	{
		name: "itemquantity",
		message: "How many would you like?"
	}

	]).then(function(answer) {
		connection.query("SELECT * FROM products WHERE ?", {
			item_id: answer.itemtobuy
		}, function(err, res) {
			if (err) throw err;
			// Update validation to tie in to check against item_id more specifically.
			var intItemToBuy = parseInt(answer.itemtobuy);
			if ((intItemToBuy < 1) || (intItemToBuy > 14) || (typeof intItemToBuy !== "number")) {
				console.log(answer.itemtobuy);
				console.log("That is not a valid item ID, please try again.");
				purchaseSomeStuff();
			}

			// Validate quantity ordered to confirm type is number
			else if (res[0].stock_quantity < answer.itemquantity) {
				console.log("Insufficient quantity available! Please try again.");
				purchaseSomeStuff();
			}

			else if (res[0].stock_quantity >= answer.itemquantity) {
				console.log("Cool!");
				itemToBuy = answer.itemtobuy;
				itemQuantity = answer.itemquantity;
				updateDatabase();
			}
	});
});
};

function updateDatabase() {
	console.log(itemToBuy);
	console.log(itemQuantity);
	connection.query("SELECT * FROM products WHERE ?", {
		item_id: itemToBuy
	}, function (err, res) {
		if (err) throw err;
		var newQuantity = (res[0].stock_quantity - itemQuantity);
		console.log(newQuantity);
		connection.query("UPDATE products SET ? WHERE ?", [{
			stock_quantity: newQuantity
		}, {
			item_id: itemToBuy
		}], function (err, res) {
			if (err) throw err;
			totalOrderAmount();
		});
});
};

function totalOrderAmount() {
	connection.query("SELECT price FROM products WHERE ?", {
		item_id: itemToBuy
	}, function (err, res) {
		if (err) throw err;
		var orderTotal = (res[0].price * itemQuantity);
		console.log("Your order total is $" + orderTotal.toFixed(2) + "!");
	});
};

showMeTheItems();