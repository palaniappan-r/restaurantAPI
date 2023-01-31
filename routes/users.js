const express = require('express')
const router = express.Router()
const { urlencoded } = require('express');
const methodOverride = require('method-override');
const { clientIsLoggedIn } = require('../middleware/validatePermissions')


const {signupClient , signupRestaurantAdmin, signupClientForm, clientLoginForm , clientLogin, logout, signupRestaurantAdminForm, restaurantAdminLogin, restaurantAdminLoginForm, clientDetails} = require('../controllers/userController');

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));

// const cookieParser = require('cookie-parser');
// router.use(cookieParser());

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

router.use((err , req , res , next) => {

    const {statusCode = 400 , message = "ERROR"} = err
    res.render('errorPage' , {statusCode , message})
    
})

module.exports = router 