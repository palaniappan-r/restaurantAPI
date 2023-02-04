const Restaurant = require('../models/restaurant');
const Review = require('../models/review')
const catchError = require('../utilities/catchError')
const Order = require('../models/order')
const ErrorClass = require('../utilities/errorClass');

exports.addReview = catchError(async(req , res , next) =>{ 
    client = req.session.user
    if(!(client._id.equals(req.params.user_id)))
       return next(new ErrorClass('You can only add reviews from your account',400))
    else{
        const rest = await Restaurant.findById(req.params.rest_id)
        const orders = await Order.findOne({'clientID' : req.session.user._id , 'status' : 'Done'})
        if(orders){
            const rev = new Review(req.body.review)
            rev.client_id = req.session.user._id
            rev.client_name = req.session.user.name
            rest.reviews.push(rev)
            rev.save()
            rest.save()
            res.redirect(`/restaurants/${rest._id}`)
        }
        else
            return next(new ErrorClass('You need atleast one completed order to add a review to this restaurant' , 400))
    }
})

exports.deleteReview = catchError(async(req , res) =>{  
    const rest = await Restaurant.findById(req.params.rest_id)
    if(rest.restaurantAdminID != req.session.user._id)
       return next(new ErrorClass('You can only access your own restaurant',400))
    else{
        await Restaurant.findByIdAndUpdate(req.params.rest_id , { $pull : { reviews: req.params.review_id}})
        await Review.findByIdAndDelete(req.params.review_id)
        rest.save()
        res.redirect(`/restaurants/admin/${rest._id}`)
    }
})