const ErrorClass = require('../utilities/errorClass.js')
const joi = require('joi');

const validateRestaurant = (req , res , next) => {
    const restaurantSchema = joi.object({
        restaurant: joi.object({
            name: joi.string(),
            cus1 : joi.any(),
            cus2 : joi.any(),
            cus3 : joi.any(),
            cus4 : joi.any(),
            cus5 : joi.any(),
            cus6 : joi.any(),
            location : joi.string(),
        })
    })

    const rslt = restaurantSchema.validate(req.body)

    if(rslt.error)
        throw new ErrorClass(rslt.error , 400)
    else    
        next()
}

const validateItem = (req , res , next) => {
    const itemSchema = joi.object({
        item: joi.object({
            name: joi.string(),
            price : joi.number().min(0),
        })
    })

    const rslt = itemSchema.validate(req.body)

    if(rslt.error)
        throw new ErrorClass(rslt.error , 400)
    else
        next()

}

const validateClient = (req , res , next) => {
    const clientSchema = joi.object({
        name: joi.string(),
        email : joi.string(),
        password : joi.string(),
        cartCount : joi.number().min(0),
        cartTotalPrice : joi.number().min(0),
        walletAmount : joi.number().min(0)
    })

    const rslt = clientSchema.validate(req.body)

    if(rslt.error)
        throw new ErrorClass(rslt.error , 400)
    else
         next()
}

const validateRestaurantAdmin = (req , res , next) => {
    const restaurantAdminSchema = joi.object({
        name: joi.string(),
        email : joi.string(),
        password : joi.string()
    })

    const rslt = restaurantAdminSchema.validate(req.body)

    if(rslt.error)
        throw new ErrorClass(rslt.error , 400)
    else
        next()
}

const validateOrder = (req , res, next) => {
    const orderSchema = joi.object({
        clientID : joi.string(),
        restaurantID : joi.string(),
        restaurantName : joi.string(),
        itemID : joi.string(),
        itemName : joi.string(),
        quantity : joi.number().min(1),
        unitPrice : joi.number(),
        totalPrice : joi.number(),
        status : joi.string()
    })

    const rslt = orderSchema.validate(req.body)

    if(rslt.error)
        throw new ErrorClass(rslt.error , 400)
    else
        next()
}

const validateReview = (req , res , next) => {
    const reviewSchema = joi.object({
        review : joi.object({
        client_id : joi.string(),
        client_name : joi.string(),
        text : joi.string(),
        rating : joi.number()
        })
    })

    const rslt = reviewSchema.validate(req.body)

    if(rslt.error)
        throw new ErrorClass(rslt.error , 400)
    else
        next()
}

const validateFunds = (req , res , next) => {
    const fundsSchema = joi.object({
        addFunds : joi.number().min(1)
    })

    const rslt = fundsSchema.validate(req.body)

    if(rslt.error)
        throw new ErrorClass(rslt.error , 400)
    else
        next()
}

module.exports = {validateRestaurant , validateItem , validateClient , validateRestaurantAdmin , validateOrder , validateReview , validateFunds}