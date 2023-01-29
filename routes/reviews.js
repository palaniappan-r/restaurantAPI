const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant');
const Review = require('../models/review')
const catchError = require('../utilities/catchError')

router.post('/:id' , catchError(async(req , res) =>{  //POST Route to add a review

    const rest = await Restaurant.findById(req.params.id)
    const rev = new Review(req.body.review)
    console.log(rev)
    rest.reviews.push(rev)
    rev.save()
    rest.save()
    res.redirect(`/restaurants/${rest._id}`)

}))

router.delete('/:rest_id/:review_id' , catchError(async(req , res) =>{  //DELETE Route to remove a review

    const {rest_id , review_id} = req.params
    await Restaurant.findByIdAndUpdate(rest_id , { $pull : { reviews: review_id}})
    await Review.findByIdAndDelete(review_id)
    const rest = await Restaurant.findById(rest_id)
    rest.save()
    res.redirect(`/restaurants/${rest._id}`)
    
}))

module.exports = router