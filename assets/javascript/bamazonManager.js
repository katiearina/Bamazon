//---------------------------------------------------------------------------
// VARIABLE DECLARATIONS!

var mysql = require("mysql");
var inquirer = require("inquirer");

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
		console.log("------------------------------");
		doSomethingElse();
		});

};

function addToInventory() {

};

function addNewProduct() {

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