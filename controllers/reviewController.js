const Restaurant = require('../models/restaurant');
const Review = require('../models/review')
const catchError = require('../utilities/catchError')
const Order = require('../models/order')
const ErrorClass = require('../utilities/errorClass');
const Client = require('../models/client')

exports.addReview = catchError(async(req , res , next) =>{ 
    const client = await Client.findById(req.session.user._id)
    const rest = await Restaurant.findById(req.params.rest_id)
        const order = await Order.findOne({'clientID' : req.session.user._id , 'status' : 'Done'})
        if(order){
            const rev = new Review(req.body.review)
            rev.client_id = client._id
            rev.client_name = client.name
            rest.reviews.push(rev)
            rev.save()
            rest.save()
            res.redirect(`/restaurants/${rest._id}`)
        }
        else
            return next(new ErrorClass('You need atleast one completed order to add a review to this restaurant' , 400))
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

exports.test = ((req,res) => {
    console.log('hello')
})