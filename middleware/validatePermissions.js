const errorClass = require('../utilities/errorClass')
const jwt = require('jsonwebtoken')
const catchError = require('../utilities/catchError')
const Client = require("../models/client")
const RestaurantAdmin = require("../models/restaurantAdmin")

exports.clientIsLoggedIn = catchError(async (req , res , next) => {
   // const token = req.cookies.token || req.header('Authorization').replace('Bearer ','')
   const token = req.cookies.token
    if(!token)
        return next(new errorClass("Login to access site" , 401))
    
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
    req.user = await Client.findById(decoded.id)
    next()
})

exports.restaurantAdminIsLoggedIn = catchError(async (req , res , next) => {
    // const token = req.cookies.token || req.header('Authorization').replace('Bearer ','')
    const token = req.cookies.token
     if(!token)
         return next(new errorClass("Login to access site" , 401))
     
     const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
     req.user = await RestaurantAdmin.findById(decoded.id)
     next()
 })