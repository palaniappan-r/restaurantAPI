const express = require('express')
const router = express.Router()
const { urlencoded } = require('express');
const methodOverride = require('method-override');
const {validateRestaurant , validateItem} = require('../utilities/schemaValidations.js');
const { clientIsLoggedIn , restaurantAdminIsLoggedIn } = require('../middleware/validatePermissions')

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
    showRestaurantAdminInfo
} = require("../controllers/restaurantController")

const {
    restaurantCurrentOrders, restaurantUpdateOrderStatus, restaurantPastOrders
} = require('../controllers/orderController')

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));

//GET Route for Index Page
router.route('/').get(clientIsLoggedIn , indexPage)

//GET Route for new restaurant form
router.route('/new').get(restaurantAdminIsLoggedIn , newRestaurantForm)

//GET Route to display info about a specific restaurant
router.route('/:id').get(clientIsLoggedIn , showRestaurantClientInfo)

//GET Route to display info about a specific restaurant for the owner
router.route('/admin/:id').get(restaurantAdminIsLoggedIn , showRestaurantAdminInfo)

//POST Route to add a new item
router.route('/:id' , validateItem).post(restaurantAdminIsLoggedIn , addNewItem)

//GET Route for new item form
router.route('/newItem/:id').get(restaurantAdminIsLoggedIn , newItemForm)

//POST Route to add a Restaurant
router.route('/' , validateRestaurant).post(restaurantAdminIsLoggedIn , addNewRestaurant)

//GET Route for edit restaurant form
router.route('/:id/update').get(restaurantAdminIsLoggedIn , editRestaurantForm)

//PUT Route to update restaurant details
router.route('/:id' , validateRestaurant).put(restaurantAdminIsLoggedIn , updateRestaurantDetails)

//DELETE Route to remove an item
router.route('/items/:rest_id/:item_id').delete(restaurantAdminIsLoggedIn , removeItem)

//DELETE Route to remove a restaurant
router.route('/:id').delete(restaurantAdminIsLoggedIn , removeRestaurant)

router.route('/:rest_id/currentOrders').get(restaurantAdminIsLoggedIn , restaurantCurrentOrders)

router.route('/:rest_id/pastOrders').get(restaurantAdminIsLoggedIn , restaurantPastOrders)

router.route('/:rest_id/:order_id/updateStatus').get(restaurantAdminIsLoggedIn , restaurantUpdateOrderStatus)

router.use((err , req , res , next) => {
    const {statusCode = 400 , message = "ERROR"} = err
    res.render('errorPage' , {statusCode , message})
})

module.exports = router
