const express = require('express')
const router = express.Router()
const { urlencoded } = require('express');
const methodOverride = require('method-override');
const { clientIsLoggedIn , restaurantAdminIsLoggedIn } = require('../middleware/validatePermissions')


const {signupClient , signupRestaurantAdmin, signupClientForm, clientLoginForm , clientLogin, logout, signupRestaurantAdminForm, restaurantAdminLogin, restaurantAdminLoginForm, clientDetails, restaurantAdminHome} = require('../controllers/userController');

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));

router.route('/clientLogin').get(clientLoginForm)

router.route('/clientLogin').post(clientLogin)

router.route('/clientSignup').get(signupClientForm)

router.route('/clientSignup').post(signupClient)

router.route('/clientDetails').get(clientIsLoggedIn,clientDetails)

router.route('/logout').get(logout)

router.route('/restaurantAdminLogin').get(restaurantAdminLoginForm)

router.route('/restaurantAdminLogin').post(restaurantAdminLogin)

router.route('/restaurantAdminSignup').get(signupRestaurantAdminForm)

router.route('/restaurantAdminSignup').post(signupRestaurantAdmin)

router.route('/restaurantAdminHome').get(restaurantAdminIsLoggedIn , restaurantAdminHome)

router.use((err , req , res , next) => {

    const {statusCode = 400 , message = "ERROR"} = err
    res.render('errorPage' , {statusCode , message})
    
})

module.exports = router 