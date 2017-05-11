//---------------------------------------------------------------------------
// VARIABLE DECLARATIONS!

var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");

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
				default:
					console.log("How did you break this one?");
			}
		});
};


function viewProducts() {
	connection.query("SELECT * FROM products",
		function (err, res) {
			if (err) throw err;
			for (var i = 0; i < res.length; i++) {
				console.log("Item #" + res[i].item_id + " || " +
					res[i].product_name + " || " +
					// "Department: " + res[i].department_name + " || " +
					"Price: $" + res[i].price.toFixed(2) + " || " +
					"Current Stock Quantity: " + res[i].stock_quantity);
			}
		console.log("------------------------------");
		doSomethingElse();
		});
};


function viewLowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN ? AND ?",
		[0, 5],
		function (err, res) {
			if (err) throw err;
			for (var i = 0; i < res.length; i++) {
				console.log("Item #" + res[i].item_id + " || " +
					res[i].product_name + 
					" || Stock Remaining: " + res[i].stock_quantity);
			}
		if (res[0] === undefined) {
			console.log("Everything looks great! No low inventory found.");
		}
		console.log("------------------------------");
		doSomethingElse();
		});

};


function addToInventory() {

	var currentQuantity = 0;
	var newQuantity = 0;

	console.log("What item would you like to add to inventory?");

	var inventoryAdditionSchema = {
		properties: {
			itemtoadd: {
				description: "Item ID",
				pattern: /^\d+$/,
				message: "Please enter a valid number",
				required: true
			},
			quantitytoadd: {
				description: "Quantity to Add",
				pattern: /^\d+$/,
				message: "Please enter a valid number",
				required: true	
			}
		}
	};

	prompt.message = ("");

	prompt.start();

	prompt.get(inventoryAdditionSchema, function (err, result) {
		connection.query("SELECT stock_quantity FROM products WHERE ?", {
			item_id: result.itemtoadd 
			}, function (err, res) {
				var intItemToAdd = parseInt(result.itemtoadd);
				if ((intItemToAdd < 1 || intItemToAdd > 14)) {
					console.log(result.itemtoadd + " is not a valid item ID, please try again." +
						"\n------------------------------");
					addToInventory();
				}

				else {
					currentQuantity = parseInt(res[0].stock_quantity);
					// console.log("Original Quantity: " + currentQuantity);
					newQuantity = parseInt(result.quantitytoadd) + parseInt(res[0].stock_quantity);
					console.log("New Quantity: " + newQuantity);

					connection.query("UPDATE products SET ? WHERE ?", [{
						stock_quantity: newQuantity
					}, {
						item_id: result.itemtoadd
					}], function(err, res) {
						if (err) throw err;
						// console.log(res);
						console.log("Inventory Successfully Added!" + 
							"\n------------------------------");
						doSomethingElse();
						});
				}
			});
	});
};


function addNewProduct() {

var newProductName;
var newProductDepartment;
var newProductPrice;
var newProductQuantity;

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
				pattern: /^[1-5]$/,
				message: "Please enter a valid department selection",
				required: true	
			},
			price: {
				description: "Price of Item",
				pattern: /^\d+$/,
				message: "Please enter a valid price",
				required: true	
			},
			quantity: {
				description: "Quantity to Add",
				pattern: /^\d+$/,
				message: "Please enter a valid quantity",
				required: true	
			}
		}
	};

	prompt.message = ("");

	prompt.start();

	prompt.get(newProductSchema, function (err, result) {
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
			default:
				console.log("How did you break this one?");
		}
		newProductName = result.productname;
		newProductPrice = parseInt(result.price);
		newProductQuantity = parseInt(result.quantity);

		connection.query("INSERT INTO products SET ?", {
			product_name: newProductName,
			department_name: newProductDepartment,
			price: newProductPrice.toFixed(2),
			stock_quantity: newProductQuantity
		}, function (err, res) {
			if (err) throw err;
			// console.log(res);
			console.log("New Product Successfully Added!" + 
				"\n------------------------------");
			doSomethingElse();
		});
	});
};


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
				case "Yes, please.":
					managerMenu();
					break;
				case "No, thank you. Please quit.":
					endConnection();
					break;
				default:
					console.log("How did you break this one?");
			}
		});
};


function endConnection() {
	connection.end();
	console.log("------------------------------\n" + 
		"Thank you!" + 
		"\n------------------------------");
};


//---------------------------------------------------------------------------
// FUNCTION CALLS!

managerMenu();

//---------------------------------------------------------------------------