//---------------------------------------------------------------------------
// VARIABLE DECLARATIONS!

var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");

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


//---------------------------------------------------------------------------
// FUNCTION DECLARATIONS!

function showMeTheItems() {
	console.log("------------------------------");
	console.log("Welcome to Bamazon!\n" + 
		"Here are all of the items we have for sale:");
	connection.query("SELECT * FROM products", 
		function(err, res) {
			if (err) throw err;
			// console.log(res);
			for (var i = 0; i < res.length; i++) {
			console.log("Item #" + res[i].item_id + ") " + 
				res[i].product_name + 
				" - $" + res[i].price.toFixed(2));
		}

		console.log("------------------------------");
		wannaBuy();
});
};


function wannaBuy() {
	inquirer.prompt([
	{
		name: "wanttobuy",
		type: "list",
		message: "Would you like to buy something?",
		choices: ["Yes, please.",
			"No, thank you. I'd like to quit for now."]
	}

		]).then(function(answer) {
			if (answer.wanttobuy === "Yes, please.") {
			purchaseSomeStuff();
			}

			else if (answer.wanttobuy === "No, thank you. I'd like to quit for now.") {
				endConnection();
			}
		});
};


function wannaBuyAgain() {
	inquirer.prompt([
	{
		name: "wanttobuy",
		type: "list",
		message: "Would you like to buy something else?",
		choices: ["Yes, please.",
			"Maybe, please remind me what you have for sale again.",
			"No, thank you. I'd like to quit for now."]
	}

		]).then(function(answer) {
			if (answer.wanttobuy === "Yes, please.") {
			purchaseSomeStuff();
			}

			else if (answer.wanttobuy === "Maybe, please remind me what you have for sale again.") {
				showMeTheItems();
			}

			else if (answer.wanttobuy === "No, thank you. I'd like to quit for now.") {
				endConnection();
			}
		});
};


function purchaseSomeStuff() {
	console.log("What item would you like to purchase?");

	var purchaseSchema = {
		properties: {
			itemtobuy: {
				description: "Item ID",
				pattern: /^\d+$/,
				message: "Please enter a valid number",
				required: true
			},
			itemquantity: {
				description: "Quantity",
				pattern: /^\d+$/,
				message: "Please enter a valid number",
				required: true	
			}
		}
	};

	prompt.message = ("");

	prompt.start();

	prompt.get(purchaseSchema, function (err, result) {
		connection.query("SELECT * FROM products WHERE ?", {
			item_id: result.itemtobuy
		}, function(err, res) {
			if (err) throw err;
			// Eventually update validation to tie in to check against item_id more specifically.
			var intItemToBuy = parseInt(result.itemtobuy);
			if ((intItemToBuy < 1) || (intItemToBuy > 14)) {
				console.log(result.itemtobuy + " is not a valid item ID, please try again." +
					"\n------------------------------");
				purchaseSomeStuff();
			}

			else if (res[0].stock_quantity < result.itemquantity) {
				console.log("Insufficient quantity available! Please try again.");
				purchaseSomeStuff();
			}

			else if (res[0].stock_quantity >= result.itemquantity) {
				itemToBuy = result.itemtobuy;
				itemQuantity = result.itemquantity;
				updateDatabase();
			}
	});
	});

};


function updateDatabase() {
	connection.query("SELECT * FROM products WHERE ?", {
		item_id: itemToBuy
	}, function (err, res) {
		if (err) throw err;
		var newQuantity = (res[0].stock_quantity - itemQuantity);
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
	connection.query("SELECT * FROM products WHERE ?", {
		item_id: itemToBuy
	}, function (err, res) {
		if (err) throw err;
		var orderTotal = (res[0].price * itemQuantity);
		console.log("You have ordered " + itemQuantity + " of " + res[0].product_name + ".\nYour order total is $" + orderTotal.toFixed(2) + "!");
		wannaBuyAgain();
	});
};

function endConnection() {
	connection.end();
	console.log("------------------------------\n" + 
		"Thank you for shopping!" + 
		"\n------------------------------");
};


//---------------------------------------------------------------------------
// FUNCTION CALLS!

showMeTheItems();


//---------------------------------------------------------------------------