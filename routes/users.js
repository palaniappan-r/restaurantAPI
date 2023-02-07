const express = require('express')
const router = express.Router()
const { urlencoded } = require('express');
const methodOverride = require('method-override');
const passport = require('passport')
const { 
    clientIsLoggedIn ,
    restaurantAdminIsLoggedIn
} = require('../middleware/validatePermissions')
const { 
    addReview, 
    deleteReview, 
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
    clientLoginGoogle,
    restaurantAdminLoginGoogle
} = require('../controllers/userController');

const {
    addItemToCart,
    removeItemFromCart,
    updateItemCartQuantity,
    placeOrder,
    clientCancelOrder,
    clientGetOrderStatus
} = require('../controllers/orderController');

const { 
    validateClient, 
    validateRestaurantAdmin, 
    validateOrder, 
    validateReview,
    validateFunds
} = require('../utilities/schemaValidations');

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));

router.route('/clientLogin').get(clientLoginForm)

router.route('/clientLogin').post(validateClient , clientLogin)

router.route('/clientLogin/google').get(passport.authenticate("clientLogin" , {scope : ['email' , 'profile']}))

router.route('/clientLogin/google/redirect').get(passport.authenticate("clientLogin") , clientLoginGoogle);

router.route('/clientSignup').get(signupClientForm)

router.route('/clientSignup').post(validateClient , signupClient)

router.route('/clientDetails').get(clientIsLoggedIn , clientDetails)

router.route('/currentOrders').get(clientIsLoggedIn , clientCurrentOrders)

router.route('/pastOrders').get(clientIsLoggedIn , clientPastOrders)

router.route('/restaurantAdminLogin').get(restaurantAdminLoginForm)

router.route('/restaurantAdminLogin').post(validateRestaurantAdmin , restaurantAdminLogin)

router.route('/restaurantAdminLogin/google').get(passport.authenticate("restaurantAdminLogin" , {scope : ['email' , 'profile']}))

router.route('/restaurantAdminLogin/google/redirect').get(passport.authenticate("restaurantAdminLogin") , restaurantAdminLoginGoogle);

router.route('/restaurantAdminSignup').get(signupRestaurantAdminForm)

router.route('/restaurantAdminSignup').post(validateRestaurantAdmin , signupRestaurantAdmin)

router.route('/restaurantAdminHome').get(restaurantAdminIsLoggedIn , restaurantAdminHome)

router.route('/addToCart/:rest_id/:item_id').post(clientIsLoggedIn, validateOrder , addItemToCart)

router.route('/removeFromCart/:order_id').delete(clientIsLoggedIn , removeItemFromCart)

router.route('/updateCartQuantity/:order_id').put(clientIsLoggedIn , updateItemCartQuantity) //Add validation here

router.route('/addFundsToWallet').post(clientIsLoggedIn , validateFunds , addFundsToWallet)

router.route('/placeOrder').get(clientIsLoggedIn , placeOrder)

router.route('/getOrderStatus/:order_id').get(clientIsLoggedIn , clientGetOrderStatus)

router.route('/cancelOrder/:order_id').delete(clientIsLoggedIn , clientCancelOrder)

router.route('/addReview/:rest_id').post(validateReview , addReview)

router.route('/removeReview/:rest_id/:review_id').delete(restaurantAdminIsLoggedIn,deleteReview)

router.route('/logout').get(logout)

// router.use((err , req , res , next) => {
//     const {statusCode = 400 , message = "ERROR"} = err
//     res.render('errorPage' , {statusCode , message})
// })

module.exports = router
