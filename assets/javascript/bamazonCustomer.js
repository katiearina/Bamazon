// THINGS TO (EVENTUALLY) ADD/UPDATE:
// + Generate total of all items customer wants to purchase instead of
// each individual item purchase (just need to add a running total variable).

//---------------------------------------------------------------------------
// VARIABLE DECLARATIONS!

// Required NPM Packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");

// Global variables (used in multiple functions)
var itemToBuy;
var itemQuantity;

// Set up MySQL Connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "BamazonDB"
});

// Start connection
connection.connect(function(err) {
	if (err) throw err;
	// console.log("connected as id " + connection.threadId);
});

// Set up variable to handle total number of items in stock
var totalItems;


//---------------------------------------------------------------------------
// FUNCTION DECLARATIONS!

// Calculate current total number of items in stock
function totalCalculation() {

	// Select all columns from table
	connection.query("SELECT * FROM products", 

		function(err, res) {
			if (err) throw err;

			// Set totalItems variable equal to the number of items
			totalItems = parseInt(res.length);

			// Run function to display item list
			showMeTheItems();

		});
};


// Shows list of items for sale
function showMeTheItems() {

	console.log("------------------------------");
	console.log("Welcome to Bamazon!\n" + 
		"Here are all of the items we have for sale:");

	// Select all columns from table
	connection.query("SELECT * FROM products", 

		function(err, res) {
			if (err) throw err;

			// Loop through list of items in table
			for (var i = 0; i < res.length; i++) {

				// Display all items in readable fashion
				console.log("Item #" + res[i].item_id + ") " + 
					res[i].product_name + 
					" - $" + res[i].price.toFixed(2));
			}

			console.log("------------------------------");

			// Run function to see if customer wants to buy an item
			wannaBuy();

		});
};

// Gives option to buy an item
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

			// If customer wants to buy an item
			if (answer.wanttobuy === "Yes, please.") {

				// Run purchasing function
				purchaseSomeStuff();
			}

			// If customer does not want to buy anything
			else if (answer.wanttobuy === "No, thank you. I'd like to quit for now.") {

				// Run function to end database connection
				endConnection();

			}
		});
};

// Gives option to buy more than a second (or third, etc.) item
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

			// If customer wants to buy an item (after first purchase)
			if (answer.wanttobuy === "Yes, please.") {

				// Run purchasing function
				purchaseSomeStuff();

			}

			// If customer wants a reminder of items available
			else if (answer.wanttobuy === "Maybe, please remind me what you have for sale again.") {
			
				// Run function to show list of available items
				showMeTheItems();

			}

			// If customer does not want to buy anything
			else if (answer.wanttobuy === "No, thank you. I'd like to quit for now.") {

				// Run function to end database connection	
				endConnection();

			}
		});
};

// Actually runs purchasing function to validate item ID/quantity and display
// total price
function purchaseSomeStuff() {

	console.log("What item would you like to purchase?");

	// Use Prompt package to validate customer input
	var purchaseSchema = {
		properties: {

			itemtobuy: {
				description: "Item ID",
				// Digits only
				pattern: /^\d+$/,
				message: "Please enter a valid number",
				required: true
			},

			itemquantity: {
				description: "Quantity",
				// Digits only
				pattern: /^\d+$/,
				message: "Please enter a valid number",
				required: true	
			}

		}
	};

	// No message
	prompt.message = ("");

	prompt.start();

	// Run Prompt package on above-listed packageSchema variables
	prompt.get(purchaseSchema, function (err, result) {

		// Select all columns from table where..
		connection.query("SELECT * FROM products WHERE ?", {

			// Item ID is equal to user input
			item_id: result.itemtobuy

		}, function(err, res) {
			if (err) throw err;

			// Create variable to parse input as integer
			var intItemToBuy = parseInt(result.itemtobuy);

			// If input is less than 1 or greater than total number of items..
			if ((intItemToBuy < 1) || (intItemToBuy > totalItems)) {

				// Let user know their input is invalid
				console.log(result.itemtobuy + " is not a valid item ID, please try again." +
					"\n------------------------------");

				// Rerun purchasing function
				purchaseSomeStuff();

			}

			// If input is valid but stock quantity is less than input/purchase quantity
			else if (res[0].stock_quantity < result.itemquantity) {

				// Let user know there isn't enough quantity to meet demand
				console.log("Insufficient quantity available! We only have " + res[0].stock_quantity + " available. Please try again.");

				// Rerun purchasing function
				purchaseSomeStuff();
			}

			// If input is valid and stock quantity is greater than or equal to input/purchase quantity
			else if (res[0].stock_quantity >= result.itemquantity) {

				// Set itemToBuy to global variable
				itemToBuy = result.itemtobuy;

				// Set itemQuantity to global variable
				itemQuantity = result.itemquantity;

				// Update the database!
				updateDatabase();

			}
	});
	});

};

// Updates the database/table!
function updateDatabase() {

	// Select all columns from table where..
	connection.query("SELECT * FROM products WHERE ?", {

		// Item ID is equal to global variable set in purchaseSomeStuff function
		item_id: itemToBuy

	}, function (err, res) {
		if (err) throw err;

		// Calculate new quantity from original quantity minus purchased quantity
		var newQuantity = (res[0].stock_quantity - itemQuantity);

		// Update table
		connection.query("UPDATE products SET ? WHERE ?", [{

			// Set stock quantity equal to new calculated quantity
			stock_quantity: newQuantity
		}, {
			// Where item ID equals user input from purchaseSomeStuff function
			item_id: itemToBuy

		}], function (err, res) {
			if (err) throw err;

			// Run total order amount function
			totalOrderAmount();

		});
});
};

// Calculates current order total
function totalOrderAmount() {

	// Select all columns from table where..
	connection.query("SELECT * FROM products WHERE ?", {

		// Item ID is equal to user input
		item_id: itemToBuy

	}, function (err, res) {
		if (err) throw err;

		// Calculate current total from price of item and quantity set in purchaseSomeStuff function
		var orderTotal = (res[0].price * itemQuantity);

		// Let customer know their total for this purchase
		console.log("You have ordered " + itemQuantity + " of " + res[0].product_name + ".\nYour order total is $" + orderTotal.toFixed(2) + "!" +
			"\n------------------------------");
		
		// Run function to ask user if they want to make another purchase
		wannaBuyAgain();

	});
};

// Ends connection to database
function endConnection() {

	// Terminates connection
	connection.end();

	// Thanks the user
	console.log("------------------------------\n" + 
		"Thank you for shopping!" + 
		"\n------------------------------");

};

//---------------------------------------------------------------------------
// FUNCTION CALLS!

// Start by running function to calculate total number of items
totalCalculation();

//---------------------------------------------------------------------------