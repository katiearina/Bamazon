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
					"No, please remind me what you have for sale again."]
			}

				]).then(function(answer) {
					if (answer.wanttobuy === "Yes, please.") {
					console.log("Welcome to Bamazon!\n" + 
						"What item would you like to purchase?");
					// purchaseSomeStuff();
					}

					else if (answer.wanttobuy === "No, please remind me what you have for sale again.") {
						showMeTheItems();
					}
					purchaseSomeStuff();
				});
			});
};

function purchaseSomeStuff() {
	inquirer.prompt([
	{
		name: "itemtobuy",
		message: "Please enter the ID number of the item you would like to purchase"
	},
	{
		name: "itemquantity",
		message: "How many would you like?"
	}

	]).then(function(answer) {
		connection.query("SELECT * FROM products",
			function(err, res) {
				if (err) throw err;
		// switch (parseInt(answer.itemtobuy)) {
		// 	case 1:
		// 		console.log(res[0].product_name);
		// 		howManyToBuy();
		// 		break;
		// 	case 2:
		// 		output += 'What ';
		// 		output += 'Is ';
		// 		break;
		// 	case 3:
		// 		output += 'Your ';
		// 		break;
		// 	case 4:
		// 		output += 'Name';
		// 		break;
		// 	case 5:
		// 		output += '?';
		// 		console.log(output);
		// 		break;
		// 	case 6:
		// 		output += '!';
		// 		console.log(output);
		// 		break;
		// 	case 7:
		// 		output += '!';
		// 		console.log(output);
		// 		break;
		// 	case 8:
		// 		output += '!';
		// 		console.log(output);
		// 		break;
		// 	case 9:
		// 		output += '!';
		// 		console.log(output);
		// 		break;
		// 	case 10:
		// 		output += '!';
		// 		console.log(output);
		// 		break;
		// 	case 11:
		// 		output += '!';
		// 		console.log(output);
		// 		break;
		// 	case 12:
		// 		output += '!';
		// 		console.log(output);
		// 		break;
		// 	case 13:
		// 		output += '!';
		// 		console.log(output);
		// 		break;
		// 	case 14:
		// 		output += '!';
		// 		console.log(output);
		// 		break;
		// 	default:
		// 		console.log("Please enter an Item ID between 1 and 14.");
		}
	});
});

};

function howManyToBuy() {
	console.log("DOLLA DOLLA BILLZ Y'ALL!");
};

showMeTheItems();