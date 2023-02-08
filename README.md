# restaurantAPI

A restaurant management API in Express.js that uses MongoDB as a database and Redis as session store. A basic frontend is written in EJS.

# API Reference
Schema Validations to endpoints are done using JOI

## `/restaurants`
Prepend /restaurants to access the following routes

### `GET` - /
Get info about all the restaurants, for an index page

### `POST` - /
Add a restaurant.<br>
Will add data only if a user registered as a restaurant admin is logged in.

### `GET` - /:rest_id
Get info about a specific restaurant.

### `PUT` - /:rest_id
Update info about a specific restaurant.<br>
Will append data only if the restaurant's admin is logged in.

### `DELETE` - /:rest_id
Delete a specific restaurant.<br>
Will delete data only if the restaurant's admin is logged in.

### `GET` - /:rest_id/totalRevenue
Get info about a specific restaurant's revenue.<br>
Will send a result only if the restaurant's admin in logged in.

### `POST` - /:rest_id/items
Add an item to a restaurant.<br>
Will add data only if a user registered as a restaurant admin is logged in.

### `DELETE` - /:rest_id/items
Remove an item from a restaurant.<br>
Will add data only if a user registered as a restaurant admin is logged in.

### `GET` - /:rest_id/currentOrders
Get info about a specific restaurant's active orders.<br>
Will send a result only if the restaurant's admin in logged in.

### `GET` - /:rest_id/pastOrders
Get info about a specific restaurant's past orders.<br>
Will send a result only if the restaurant's admin in logged in.

### `PUT` - /:rest_id/order/:order_id
Update the status of an active order.<br>
The status can only be update sequentially : Received -> Confirmed -> Cooking -> Done<br>
Will send a result only if the restaurant's admin in logged in.

### `DELETE` - /:rest_id/order/:order_id
Cancel an active order.<br>
Upon cancellation, the order amount will be refunded to the customer.

<br>

## `/user`
Prepend /user to access the following routes

### `POST` - /restaurantAdminLogin
Validates the provided credentials and logs the user in.

### `POST` - /restaurantAdminSignup
Creates a new user and logs the user in.

### `GET` - /restaurantAdminLogin/google
For Google OAuth using PassportJS.

### `POST` - /clientLogin
Validates the provided credentials and logs the user in.

### `POST` - /clientSignup
Creates a new user and logs the user in.

### `GET` - /clientLogin/google
For Google OAuth using PassportJS.

### `GET` - /clientDetails
Get basic info and cart items of the currently active user.

### `POST` - /cart/:item_id
Add an item to the currently active user's cart.
Items from multiple restaurants cannot be added to the same cart.

### `PUT` - /cart/:item_id
Update quantity of an item in the currently active user's cart.

### `DELETE` - /cart/:item_id
Delete an item from the currently active user's cart.

### `POST` - /addFundsToWallet
Add funds to the currently active user's wallet.

### `GET` - /placeOrder
Place an order for the items in the user's cart.<br>
Will work only if the user's wallet funds are sufficient for the order.

### `GET` - /currentOrders
Get info about the currently active orders of the currently active user.

### `GET` - /pastOrders
Get info about the past orders of the currently active user.

### `GET` - /order/:order_id
Get the current status of an active order.<br>
Will send a response only if the user who made the order is logged in.

### `DELETE` - /order/:order_id
Remove an active order.<br>
This is possible only if the order's status is Received/Confirmed<br>
Upon cancellation, the order amount will be refunded to the customer.<br>
Will delete only if the user who made the order is logged in.

### `POST` - /review/:rest_id
Add a review to a restaurant.<br>
Will add a review only if the currently active user has at least one completed order from the restaurant.

### `DELETE` - /review/:rest_id
Remove a review from a restaurant.<br>
Will delete data only if the restaurant's admin is logged in.

### `GET` - /logout
Logs the current user out.<br>


# Environment Variables

Add the following to your  `.env` file.

`PORT`<br>
`COOKIE_EXPIRY_TIME`<br>
`JWT_EXPIRY_TIME`<br>
`JWT_SECRET_KEY`<br>
`SESSION_SECRET_KEY`<br>
`DATABASE_URL`<br>
`GOOGLE_PASSPORT_ID`<br>
`GOOGLE_PASSPORT_SECRET`<br>
`GOOGLE_PASSPORT_CLIENT_CALLBACKURL`<br>
`GOOGLE_PASSPORT_RESADMN_CALLBACKURL`<br>
`MAIL_ID`<br>
`MAIL_PASS`<br>
`MONGO_INITDB_ROOT_USERNAME`<br>
`MONGO_INITDB_ROOT_PASSWORD`<br>
`MAIL_HOST`<br>


# Postman
The workspace can be accessed in this public collection : <br>
https://elements.getpostman.com/redirect?entityId=19312206-561647fd-c7d4-49d6-ab55-144e25662c2c&entityType=collection