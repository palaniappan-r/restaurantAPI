const express = require('express')
const router = express.Router()
const { urlencoded } = require('express');
const methodOverride = require('method-override');
var { clientIsLoggedIn , restaurantAdminIsLoggedIn} = require('../middleware/validatePermissions')

const { 
    addReview, 
    deleteReview, 
    test
} = require('../controllers/reviewController');

const {
    signupClient , 
    signupRestaurantAdmin, 
    signupClientForm, 
    clientLoginForm , 
    clientLogin, 
    logout, 
    signupRestaurantAdminForm, 
    restaurantAdminLogin, 
    restaurantAdminLoginForm, 
    clientDetails, 
    restaurantAdminHome,
    addFundsToWallet,
    clientCurrentOrders,
    clientPastOrders,
} = require('../controllers/userController');

const {
    addItemToCart,
    removeItemFromCart,
    updateItemCartQuantity,
    placeOrder,
    clientCancelOrder
} = require('../controllers/orderController')

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));

router.route('/clientLogin').get(clientLoginForm)

router.route('/clientLogin').post(clientLogin)

router.route('/clientSignup').get(signupClientForm)

router.route('/clientSignup').post(signupClient)

router.route('/clientDetails').get(clientIsLoggedIn , clientDetails)

router.route('/currentOrders').get(clientIsLoggedIn , clientCurrentOrders)

router.route('/pastOrders').get(clientIsLoggedIn , clientPastOrders)

router.route('/restaurantAdminLogin').get(restaurantAdminLoginForm)

router.route('/restaurantAdminLogin').post(restaurantAdminLogin)

router.route('/restaurantAdminSignup').get(signupRestaurantAdminForm)

router.route('/restaurantAdminSignup').post(signupRestaurantAdmin)

router.route('/restaurantAdminHome').get(restaurantAdminIsLoggedIn , restaurantAdminHome)

router.route('/addToCart/:rest_id/:item_id').post(clientIsLoggedIn , addItemToCart)

router.route('/removeFromCart/:order_id').delete(clientIsLoggedIn , removeItemFromCart)

router.route('/updateCartQuantity/:order_id').put(clientIsLoggedIn , updateItemCartQuantity)

router.route('/addFundsToWallet').post(clientIsLoggedIn , addFundsToWallet)

router.route('/placeOrder').get(clientIsLoggedIn , placeOrder)

router.route('/cancelOrder/:order_id').delete(clientIsLoggedIn , clientCancelOrder)

router.route('/addReview/:rest_id').post(addReview)

router.route('/removeReview/:rest_id/:review_id').delete(restaurantAdminIsLoggedIn,deleteReview)

router.route('/logout').get(logout)

router.use((err , req , res , next) => {
    const {statusCode = 400 , message = "ERROR"} = err
    res.render('errorPage' , {statusCode , message})
})

module.exports = router 