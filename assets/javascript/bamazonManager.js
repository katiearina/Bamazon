//---------------------------------------------------------------------------
// VARIABLE DECLARATIONS!

// Required NPM Packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");

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

			// Run function to display manager options
			managerMenu();

		});
};

// Shows manager menu
function managerMenu() {
	console.log("------------------------------\n" + 
		"Manager Menu" + 
		"\n------------------------------");

	inquirer.prompt([
	{
		name: "manageroptions",
		type: "list",
		message: "What would you like to do?",
		choices: ["View Products for Sale",
			"View Low Inventory",
			"Add to Inventory",
			"Add New Product"]
	}

		]).then(function(answer) {

			switch(answer.manageroptions) {

				case "View Products for Sale":
					viewProducts();
					break;

				case "View Low Inventory":
					viewLowInventory();
					break;

				case "Add to Inventory":
					addToInventory();
					break;

				case "Add New Product":
					addNewProduct();
					break;

				// This is mostly a joke since there is only a list to
				// select from.
				default:
					console.log("How did you break this one?");

			}
		});
};

// Shows all products
function viewProducts() {

	// Select all columns from table
	connection.query("SELECT * FROM products",

		function (err, res) {
			if (err) throw err;

			// Loop through all products
			for (var i = 0; i < res.length; i++) {
				console.log("Item #" + res[i].item_id + " || " +
					res[i].product_name + " || " +
					// Removed department listing because the homework doesn't mention it
					// "Department: " + res[i].department_name + " || " +
					"Price: $" + res[i].price.toFixed(2) + " || " +
					"Current Stock Quantity: " + res[i].stock_quantity);
			}

		console.log("------------------------------");

		// Run function to see if manager wants to do anything else
		doSomethingElse();

		});
};

// Shows all items with low inventory
function viewLowInventory() {

	// Select all columns from table where stock quantity is between 0 and 5
	connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN ? AND ?",
		[0, 5],

		function (err, res) {
			if (err) throw err;

			// Loop through any items with inventory in this range (0-5)
			for (var i = 0; i < res.length; i++) {

				// Display all items in readable fashion
				console.log("Item #" + res[i].item_id + " || " +
					res[i].product_name + 
					" || Stock Remaining: " + res[i].stock_quantity);
			}

		// If there are no items with low inventory
		if (res[0] === undefined) {

			// Display message to that effect
			console.log("Everything looks great! No low inventory found.");

		}

		console.log("------------------------------");

		// Run function to see if manager wants to do anything else
		doSomethingElse();
		});

};

// Gives option to add to current inventory
function addToInventory() {

	// Declare function variables
	var currentQuantity;
	var newQuantity;

	console.log("What item are you adding to inventory?");

	// Use Prompt package to validate customer input
	var inventoryAdditionSchema = {
		properties: {

			itemtoadd: {
				description: "Item ID",
				// Digits only
				pattern: /^\d+$/,
				message: "Please enter a valid number",
				required: true
			},

			quantitytoadd: {
				description: "Quantity to Add",
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

	// Run Prompt package on above-listed inventoryAdditionSchema variables
	prompt.get(inventoryAdditionSchema, function (err, result) {

		// Select stock_quantity from table where..
		connection.query("SELECT stock_quantity FROM products WHERE ?", {

			// Item ID is equal to user input
			item_id: result.itemtoadd 

		}, function (err, res) {
			if (err) throw err;

			// Create variable to parse input as integer
			var intItemToAdd = parseInt(result.itemtoadd);

			// If input is less than 1 or greater than total number of items..
			if ((intItemToAdd < 1 || intItemToAdd > totalItems)) {

				// Let user know their input is invalid
				console.log(result.itemtoadd + " is not a valid item ID, please try again." +
					"\n------------------------------");

				// Rerun inventory update function
				addToInventory();

			}

			// If input is valid..
			else {

				// Set function variable currentQuantity equal to current stock quantity
				currentQuantity = parseInt(res[0].stock_quantity);

				// Set function variable newQuantity equal to inventory addition amount plus current stock quantity
				newQuantity = parseInt(result.quantitytoadd) + parseInt(res[0].stock_quantity);

				// Logs the new item quantity
				console.log("New Quantity: " + newQuantity);

				// Update table
				connection.query("UPDATE products SET ? WHERE ?", [{

					// Set stock quantity equal to new calculated quantity
					stock_quantity: newQuantity
				}, {
					// Where item ID equals user input
					item_id: result.itemtoadd

				}], function(err, res) {
					if (err) throw err;

					// Let customer know inventory has been added
					console.log("Inventory Successfully Added!" + 
						"\n------------------------------");

					// Run function to see if manager wants to do anything else
					doSomethingElse();

				});
			}
		});
	});
};

// Allows manager to add a new product
function addNewProduct() {

	// Declare function variables
	var newProductName;
	var newProductDepartment;
	var newProductPrice;
	var newProductQuantity;

	// Use Prompt package to validate customer input
	var newProductSchema = {
		properties: {

			productname: {
				description: "Product Name (Description Optional)",
				required: true
			},

			department: {
				description: "Pick a Department for this Product:" + 
					"\n1) Home Essentials" +
					"\n2) Gifts for Him" +
					"\n3) Food and Beverage" +
					"\n4) Entertainment" +
					"\n5) Miscellany" +
					"\n",
				// Numbers between 1 and 5 only
				pattern: /^[1-5]$/,
				message: "Please enter a valid department selection",
				required: true	
			},

			price: {
				description: "Price of Item",
				// Digits only
				pattern: /^\d+$/,
				message: "Please enter a valid price",
				required: true	
			},

			quantity: {
				description: "Quantity to Add",
				// Digits only
				pattern: /^\d+$/,
				message: "Please enter a valid quantity",
				required: true	
			}

		}
	};

	// No message
	prompt.message = ("");

	prompt.start();

	// Run Prompt package on above-listed newProductSchema variables
	prompt.get(newProductSchema, function (err, result) {

		// Set newProductDepartment equal to appropriate user input
		switch(parseInt(result.department)) {

			case 1:
				newProductDepartment = "Home Essentials";
				break;

			case 2:
				newProductDepartment = "Gifts for Him";
				break;

			case 3:
				newProductDepartment = "Gifts for Him";
				break;

			case 4:
				newProductDepartment = "Entertainment";
				break;

			case 5:
				newProductDepartment = "Miscellany";
				break;

			// This is mostly a joke since there is only a list to
			// select from.
			default:
				console.log("How did you break this one?");

		}

		// Set newProductName equal to user input
		newProductName = result.productname;

		// Set newProductPrice equal to user input
		newProductPrice = parseInt(result.price);

		// Set newProductQuantity equal to user input
		newProductQuantity = parseInt(result.quantity);

		// Insert into table
		connection.query("INSERT INTO products SET ?", {

			// Set columns equal to appropriate user input
			product_name: newProductName,
			department_name: newProductDepartment,
			price: newProductPrice.toFixed(2),
			stock_quantity: newProductQuantity

		}, function (err, res) {
			if (err) throw err;

			// Let manager know item has been added
			console.log("New Product Successfully Added!" + 
				"\n------------------------------");

			// Run function to see if manager wants to do anything else
			doSomethingElse();

		});
	});
};

// Asks if manager wants to do anything else
function doSomethingElse() {

	inquirer.prompt([
	{
		name: "somethingelse",
		type: "list",
		message: "Would you like to do something else?",
		choices: ["Yes, please.",
			"No, thank you. Please quit."]
	}

		]).then(function(answer) {

			switch(answer.somethingelse) {

				// If they want to do something else
				case "Yes, please.":

					// Rerun manager menu
					managerMenu();
					break;

				// If not
				case "No, thank you. Please quit.":

					// End the connection
					endConnection();
					break;

				// This is mostly a joke since there is only a list to
				// select from.
				default:
					console.log("How did you break this one?");
			}
		});
};

// Ends connection to database
function endConnection() {

	// Terminates connection
	connection.end();

	// Thanks the manager
	console.log("------------------------------\n" + 
		"Thank you!" + 
		"\n------------------------------");
};

//---------------------------------------------------------------------------
// FUNCTION CALLS!

// Start by running function to calculate total number of items
totalCalculation();

//---------------------------------------------------------------------------