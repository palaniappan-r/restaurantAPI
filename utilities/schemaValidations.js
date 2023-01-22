const ErrorClass = require('../utilities/ErrorClass.js')
const joi = require('joi');

const validateRestaurant = (req , res , next) => {
    const restaurantSchema = joi.object({
        restaurant: joi.object({
            name: joi.string().required(),
            cus1 : joi.any(),
            cus2 : joi.any(),
            cus3 : joi.any(),
            cus4 : joi.any(),
            cus5 : joi.any(),
            cus6 : joi.any(),
            location : joi.string().required(),
        }).required()
    })

    const rslt = restaurantSchema.validate(req.body)

    if(rslt.error)
        throw new ErrorClass(rslt.error , 404)
    else    
        next()
}

const validateItem = (req , res , next) => {
    const itemSchema = joi.object({
        item: joi.object({
            name: joi.string().required(),
            price : joi.number().required().min(0),
        }).required()
    })

    const rslt = itemSchema.validate(req.body)

    if(rslt.error)
        throw new ErrorClass(rslt.error , 404)
    else
        next()

}

module.exports = {validateRestaurant , validateItem}