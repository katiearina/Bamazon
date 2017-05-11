# Bamazon

## Overview
This is a MySQL homework project that codes out an application that replicates the Amazon.com model.  
The items in this store specifically (in the seeds file, example images, and video) are all based on product ideas suggested or created by the character Tom Haverford in the TV show *Parks & Recreation*.

## Sections
[####Part #1 - Customer View](#part-1---customer-view)
[####Part #2 - Manager View](#part-2---manager-view)

<!-- BEGIN PART 1 -->

## Part #1 - Customer View 
### Screen Shots

Enter `node bamazonCustomer.js` to start application.
![Screen Shot 1-1](https://cloud.githubusercontent.com/assets/22947371/25932096/14d066ee-35de-11e7-8420-918daa866157.png "Screen Shot 1-1")

When application is opened, list of items is shown and user is given option to purchase an item.
![Screen Shot 1-2](https://cloud.githubusercontent.com/assets/22947371/25932097/14dbb314-35de-11e7-99db-57386147c076.png "Screen Shot 1-2")

If user says yes to buying an item, they are asked for the Item ID of what they'd like to buy.
![Screen Shot 1-3](https://cloud.githubusercontent.com/assets/22947371/25932099/14dc4162-35de-11e7-8ec5-d2dccd173486.png "Screen Shot 1-3")

User is then prompted for the quantity they would like to purchase.
![Screen Shot 1-4](https://cloud.githubusercontent.com/assets/22947371/25932102/14dd7a5a-35de-11e7-98c4-0bcca798b875.png "Screen Shot 1-4")
![Screen Shot 1-5](https://cloud.githubusercontent.com/assets/22947371/25932098/14dbe7b2-35de-11e7-979b-3095657e9ace.png "Screen Shot 1-5")

Once user inputs the Item ID and quantity to purchase (assuming no errors), they are informed they have purchased a specific quantity of the item and given an order total.  
User is also prompted again to see if they would like to purchase something else.
![Screen Shot 1-6](https://cloud.githubusercontent.com/assets/22947371/25932101/14dc8e24-35de-11e7-9047-4033bafe7420.png "Screen Shot 1-6")

If user has forgotten what items are for sale, they can ask for a reminder of the available items, which will repopulate the list of items available.
![Screen Shot 1-7](https://cloud.githubusercontent.com/assets/22947371/25932100/14dc58b4-35de-11e7-91d5-d7377811c23b.png "Screen Shot 1-7")

If user is done purchasing items, they can select to quit and are thanked for their patronage.
![Screen Shot 1-8](https://cloud.githubusercontent.com/assets/22947371/25932106/14e79d78-35de-11e7-889d-0dd608898af1.png "Screen Shot 1-8")

### Error Handling

If a non-numerical Item ID is entered, user is prompted for a valid number input.
![Screen Shot 1-9](https://cloud.githubusercontent.com/assets/22947371/25932104/14e6f044-35de-11e7-9b27-84d5d014ddfe.png "Screen Shot 1-9")

If a non-valid Item ID is entered, user is prompted for a valid Item ID.
![Screen Shot 1-10](https://cloud.githubusercontent.com/assets/22947371/25932105/14e72762-35de-11e7-853e-bba7931b87ba.png "Screen Shot 1-10")

If a user requests a quantity greater than what is available, they will get a message alerting them that there is an insufficient quantity available.  
The current quantity is displayed and user is asked again for the Item ID of what they would like to purchase.
![Screen Shot 1-11](https://cloud.githubusercontent.com/assets/22947371/25932107/14e7f32c-35de-11e7-8fb5-940a5219a194.png "Screen Shot 1-11")

### Video Demonstration

#### Basic Functionality
[![Part #1-1 Video Demonstration](http://img.youtube.com/vi/r9BJwb48fm8/0.jpg)](https://www.youtube.com/watch?v=r9BJwb48fm8)

#### Error Handling
[![Part #1-2 Video Demonstration](http://img.youtube.com/vi/updwIaJtOV4/0.jpg)](https://www.youtube.com/watch?v=updwIaJtOV4)

<!-- BEGIN PART 2 -->

## Part #2 - Manager View 
### Screen Shots

Enter `node bamazonManager.js` to start application.
![Screen Shot 2-1](https://cloud.githubusercontent.com/assets/22947371/25932109/14e94a10-35de-11e7-8745-8d62f5ebefa6.png "Screen Shot 2-1")

When application is opened, list of manager options is given.
![Screen Shot 2-2](https://cloud.githubusercontent.com/assets/22947371/25932110/14f7f178-35de-11e7-8d4c-96b5cbfe0413.png "Screen Shot 2-2")

If manager selects to "View Products for Sale," a list of items, prices, and stock quantities is displayed.
![Screen Shot 2-3](https://cloud.githubusercontent.com/assets/22947371/25932113/14fb9576-35de-11e7-89b1-55901c9c5d0a.png "Screen Shot 2-3")

If manager selects to "View Low Inventory," a list of items with a stock quantity between 0 and 5 is displayed.
![Screen Shot 2-4](https://cloud.githubusercontent.com/assets/22947371/25932114/14fc62b2-35de-11e7-8c13-470c4ff6a52b.png "Screen Shot 2-4")
![Screen Shot 2-5](https://cloud.githubusercontent.com/assets/22947371/25932111/14fa5f26-35de-11e7-91e4-9e21ff562ed0.png "Screen Shot 2-5")

If manager selects to "Add to Inventory," they are prompted for the User ID of the item they are adding.
![Screen Shot 2-6](https://cloud.githubusercontent.com/assets/22947371/25932116/1506a39e-35de-11e7-9aa0-b1a65a6056c6.png "Screen Shot 2-6")

Manager is then prompted for the quantity of this item to add.
![Screen Shot 2-7](https://cloud.githubusercontent.com/assets/22947371/25932120/151205f4-35de-11e7-8a11-3b436cb3c2a8.png "Screen Shot 2-7")

Manager is then notified of the new item stock quantity and alerted that the inventory has been successfully added.
![Screen Shot 2-8](https://cloud.githubusercontent.com/assets/22947371/25932117/150e7c72-35de-11e7-8a2d-b576e3a31dff.png "Screen Shot 2-8")

If manager selects to "Add New Product," they are prompted for the product name, department, price, and quantity of the new product.
![Screen Shot 2-9](https://cloud.githubusercontent.com/assets/22947371/25932118/150ef0a8-35de-11e7-871b-5002352c44f7.png "Screen Shot 2-9")
![Screen Shot 2-10](https://cloud.githubusercontent.com/assets/22947371/25932119/151162f2-35de-11e7-85be-f089e8aed22d.png "Screen Shot 2-10")
![Screen Shot 2-11](https://cloud.githubusercontent.com/assets/22947371/25932121/1518da8c-35de-11e7-86d3-a18096e0a7cb.png "Screen Shot 2-11")
![Screen Shot 2-12](https://cloud.githubusercontent.com/assets/22947371/25932122/151947a6-35de-11e7-9c6b-e79d97818260.png "Screen Shot 2-12")

Manager is then alerted that the product has been added successfully.
![Screen Shot 2-13](https://cloud.githubusercontent.com/assets/22947371/25932752/305bfee8-35e1-11e7-9b1d-b6b6011ffb21.png "Screen Shot 2-13")

If Manager wants to view a list of current products after updating inventory and adding new products, the inventory update and new products appear (in this image, item ID #12 now has a stock quantity of 65 and item #15 is the one we just added).
![Screen Shot 2-14](https://cloud.githubusercontent.com/assets/22947371/25932123/151973d4-35de-11e7-80a7-480829751ac9.png "Screen Shot 2-14")

If Manager is finished, they can select to quit and are thanked.
![Screen Shot 2-15](https://cloud.githubusercontent.com/assets/22947371/25932886/068b4ec4-35e2-11e7-82a8-fd64fb7eb5c8.png "Screen Shot 2-15")
![Screen Shot 2-16](https://cloud.githubusercontent.com/assets/22947371/25932887/068c09a4-35e2-11e7-9c7f-d31c66564b39.png "Screen Shot 2-16")

### Error Handling

If manager selects to "View Low Inventory" and no item has low inventory, manager is notified.
![Screen Shot 2-17](https://cloud.githubusercontent.com/assets/22947371/25932888/068e67bc-35e2-11e7-8b5b-5bd29c01e4fd.png "Screen Shot 2-17")

*Note:* If a non-valid Item ID or quantity are entered, the same error handling applies as in Part #1.


### Video Demonstration

[![Part #1-1 Video Demonstration](http://img.youtube.com/vi/NcuTtWfHb90/0.jpg)](https://www.youtube.com/watch?v=NcuTtWfHb90)


## Contributors
[@katiearina](https://github.com/katiearina/) :gift_heart: