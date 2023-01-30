const Restaurant = require('../models/restaurant');
const Review = require('../models/review')
const catchError = require('../utilities/catchError')

exports.addReview = catchError(async(req , res) =>{ 
    const rest = await Restaurant.findById(req.params.id)
    const rev = new Review(req.body.review)
    console.log(rev)
    rest.reviews.push(rev)
    rev.save()
    rest.save()
    res.redirect(`/restaurants/${rest._id}`)
})

exports.deleteReview = catchError(async(req , res) =>{  
    const {rest_id , review_id} = req.params
    await Restaurant.findByIdAndUpdate(rest_id , { $pull : { reviews: review_id}})
    await Review.findByIdAndDelete(review_id)
    const rest = await Restaurant.findById(rest_id)
    rest.save()
    res.redirect(`/restaurants/${rest._id}`)
})