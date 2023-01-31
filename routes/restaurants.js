const express = require('express')
const router = express.Router()
const { urlencoded } = require('express');
const methodOverride = require('method-override');
const {validateRestaurant , validateItem} = require('../utilities/schemaValidations.js');
const { clientIsLoggedIn , res } = require('../middleware/validatePermissions')


const {indexPage , newRestaurantForm , showRestaurantInfo , addNewItem , newItemForm , addNewRestaurant , editRestaurantForm , updateRestaurantDetails , removeItem , removeRestaurant} = require("../controllers/restaurantController")

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));

//GET Route for Index Page
router.route('/').get(clientIsLoggedIn,indexPage)

//GET Route for new restaurant form
router.route('/new').get(newRestaurantForm)

//GET Route to display info about a specific restaurant
router.route('/:id').get(clientIsLoggedIn,showRestaurantInfo)

//POST Route to add a new item
router.route('/:id' , validateItem).post(addNewItem)

//GET Route for new item form
router.route('/newItem/:id').get(newItemForm)

//POST Route to add a Restaurant
router.route('/' , validateRestaurant).post(addNewRestaurant)

//GET Route for edit restaurant form
router.route('/:id/update').get(editRestaurantForm)

//PUT Route to update restaurant details
router.route('/:id' , validateRestaurant).put(updateRestaurantDetails)

//DELETE Route to remove an item
router.route('/items/:rest_id/:item_id').delete(removeItem)

//DELETE Route to remove a restaurant
router.route('/:id').delete(removeRestaurant)

router.use((err , req , res , next) => {

    const {statusCode = 400 , message = "ERROR"} = err
    res.render('errorPage' , {statusCode , message})
    
})

module.exports = router
