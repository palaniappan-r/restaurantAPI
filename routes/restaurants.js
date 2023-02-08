const express = require('express')
const router = express.Router()
const { urlencoded } = require('express');
const methodOverride = require('method-override');
const {validateRestaurant , validateItem} = require('../utilities/schemaValidations.js');
var { clientIsLoggedIn , restaurantAdminIsLoggedIn} = require('../middleware/validatePermissions')

const {
    indexPage, 
    newRestaurantForm, 
    addNewItem, 
    newItemForm, 
    addNewRestaurant, 
    editRestaurantForm, 
    updateRestaurantDetails, 
    removeItem, 
    removeRestaurant,
    showRestaurantClientInfo, 
    showRestaurantAdminInfo,
    getTotalRevenue
} = require("../controllers/restaurantController")

const {
    restaurantCurrentOrders, 
    restaurantUpdateOrderStatus, 
    restaurantPastOrders, 
    restaurantCancelOrder
} = require('../controllers/orderController')

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));

//GET Route for Index Page
router.route('/').get(clientIsLoggedIn , indexPage)

//GET Route for new restaurant form
router.route('/new').get(restaurantAdminIsLoggedIn , newRestaurantForm)

//GET Route to display info about a specific restaurant for the client
router.route('/client/:rest_id').get(clientIsLoggedIn , showRestaurantClientInfo)

//GET Route to display info about a specific restaurant for the owner
router.route('/:rest_id').get(restaurantAdminIsLoggedIn , showRestaurantAdminInfo)

//GET Route to get total revenue of a restaurant
router.route('/:rest_id/totalRevenue').get(restaurantAdminIsLoggedIn , getTotalRevenue)

//POST Route to add a Restaurant
router.route('/' , validateRestaurant).post(restaurantAdminIsLoggedIn , addNewRestaurant)

//GET Route for edit restaurant form
router.route('/:rest_id/update').get(restaurantAdminIsLoggedIn , editRestaurantForm)

//PUT Route to update restaurant details
router.route('/:rest_id' , validateRestaurant).put(restaurantAdminIsLoggedIn , updateRestaurantDetails)

//DELETE Route to remove a restaurant
router.route('/:rest_id/removeRestaurant').delete(restaurantAdminIsLoggedIn , removeRestaurant)

//POST Route to add a new item
router.route('/:rest_id/newItem' , validateItem).post(restaurantAdminIsLoggedIn , addNewItem)

//GET Route for new item form
router.route('/:rest_id/newItem').get(restaurantAdminIsLoggedIn , newItemForm)

//DELETE Route to remove an item
router.route('/:rest_id/:item_id/removeItem').delete(restaurantAdminIsLoggedIn , removeItem)

//GET Route to view current orders
router.route('/:rest_id/currentOrders').get(restaurantAdminIsLoggedIn , restaurantCurrentOrders)

//GET Route to view past orders
router.route('/:rest_id/pastOrders').get(restaurantAdminIsLoggedIn , restaurantPastOrders)

//PUT Route to update order status
router.route('/:rest_id/:order_id').put(restaurantAdminIsLoggedIn , restaurantUpdateOrderStatus)

//DELETE Route to cancel order
router.route('/:rest_id/:order_id').delete(restaurantAdminIsLoggedIn , restaurantCancelOrder)

module.exports = router
