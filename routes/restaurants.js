const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant');
const Review = require('../models/review')
const { urlencoded } = require('express');
const methodOverride = require('method-override');
const catchError = require('../utilities/catchError')
const {validateRestaurant , validateItem} = require('../utilities/schemaValidations.js')
module.exports = router; 

let temp

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));
router.get('/' , (req , res) => {
    res.redirect('/restaurants');
});

router.get('/restaurants' , catchError(async(req, res) => { //GET Route for Index Page

    const rests = await Restaurant.find({});
    res.render('index' , {rests});

}))

router.get('/restaurants/new' , catchError(async(req , res) => { //GET Route for new restaurant form

    res.render('new');

}))

router.get('/restaurants/:id' , catchError(async(req , res) => { //GET Route to display info about a specific restaurant

    const {id} = req.params;
    const rest = await Restaurant.findById(id).populate('reviews');
    res.render('show',{rest});

}))

router.post('/restaurants/:id' , validateItem ,catchError(async(req , res) => { //POST Route for new item
    
    const {id} = req.params;
    const rest = await Restaurant.findById(id)
    
    rest.itemCount += 1
    await rest.save()

    rest.items.push(req.body.item)

    await rest.save()

    let avgP = 0
    for(let i of rest.items)
        avgP += i.price
    rest.avgPrice = (avgP/rest.itemCount)

    await rest.save()
    res.redirect(`/restaurants/${id}`) 

}))

router.get('/restaurants/newItem/:id' , catchError(async(req , res) => { //GET Route for new item form

    const {id} = req.params;
    const rest = await Restaurant.findById(id);
    res.render('new_item',{id,rest});

}))

router.post('/restaurants' , validateRestaurant ,catchError(async(req , res) => { //POST Route to add a Restaurant

    const rest = new Restaurant(req.body.restaurant);
    if(req.body.cus1 == "on")
        rest.cuisines.push('Indian')
    if(req.body.cus2== "on")
        rest.cuisines.push('Pan-Asian')
    if(req.body.cus3 == "on")
        rest.cuisines.push('Chinese')
    if(req.body.cus4 == "on")
        rest.cuisines.push('Continental')
    if(req.body.cus5 == "on")
        rest.cuisines.push('Japanese')
    if(req.body.cus6 == "on")
        rest.cuisines.push('Korean')
    rest.itemCount = 0
    rest.avgPrice = 0
    await rest.save()
    res.redirect(`/restaurants/${rest._id}`)

}))

router.get('/restaurants/:id/update' , catchError(async(req , res) => { //GET Route for edit restaurant form

    const {id} = req.params;
    const rest = await Restaurant.findById(id);
    temp = [rest.items , rest.avgPrice , rest.itemCount]
    res.render('update',{rest});

}))

router.put('/restaurants/:id' , validateRestaurant ,catchError(async(req , res) => { //PUT Route to update restaurant details

    await Restaurant.findByIdAndUpdate(req.params.id , req.body.restaurant)
    const rest = await Restaurant.findById(req.params.id)

    rest.cuisines = []

    if(req.body.restaurant.cus1 == "on")
        rest.cuisines.push('Indian')
    if(req.body.restaurant.cus2== "on")
        rest.cuisines.push('Pan-Asian')
    if(req.body.restaurant.cus3 == "on")
        rest.cuisines.push('Chinese')
    if(req.body.restaurant.cus4 == "on")
        rest.cuisines.push('Continental')
    if(req.body.restaurant.cus5 == "on")
        rest.cuisines.push('Japanese')
    if(req.body.restaurant.cus6 == "on")
        rest.cuisines.push('Korean')

    rest.items = temp[0]
    rest.avgPrice = temp[1]
    rest.itemCount = temp[2]
    rest.save()
    res.redirect(`/restaurants/${req.params.id}`)

}))

router.post('/restaurants/:id/reviews' , catchError(async(req , res) =>{ //POST Route to add a review

    const rest = await Restaurant.findById(req.params.id)
    const rev = new Review(req.body.review)
    console.log(rev)
    rest.reviews.push(rev)
    rev.save()
    rest.save()
    res.redirect(`/restaurants/${rest._id}`)

}))

router.delete('/restaurants/items/:rest_id/:item_id' , catchError(async(req , res) => { //DELETE Route to remove an item

    const rest_id = req.params.rest_id
    const item_id = req.params.item_id
    const rest = await Restaurant.findById(rest_id)

    for(i of rest.items){
        if(JSON.stringify(i._id) == JSON.stringify(item_id)){
            i.remove()
            rest.itemCount -= 1
        }
    }

    if(rest.itemCount != 0){
        let avgP = 0
        for(i of rest.items)
            avgP += i.price
        rest.avgPrice = (avgP/rest.itemCount)
    }
    else
        rest.avgPrice = 0

    rest.save()
    res.redirect(`/restaurants/${rest_id}`)

}))

router.delete('/restaurants/reviews/:rest_id/:review_id' , catchError(async(req , res) =>{ //DELETE Route to remove a review

    const {rest_id , review_id} = req.params
    await Restaurant.findByIdAndUpdate(rest_id , { $pull : { reviews: review_id}})
    await Review.findByIdAndDelete(review_id)
    const rest = await Restaurant.findById(rest_id)
    rest.save()
    res.redirect(`/restaurants/${rest._id}`)
    
}))

router.delete('/restaurants/:id' , catchError(async(req , res) => { //DELETE Route to remove a restaurant

    await Restaurant.findByIdAndDelete(req.params.id , req.body)
    res.redirect(`/restaurants`)

}))

router.use((err , req , res , next) => {

    const {statusCode = 400 , message = "ERROR"} = err
    res.render('errorPage' , {statusCode , message})
    
})

module.exports = router
