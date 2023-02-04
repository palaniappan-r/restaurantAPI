const errorClass = require('../utilities/errorClass')
const jwt = require('jsonwebtoken')
const catchError = require('../utilities/catchError')
const Client = require("../models/client")
const RestaurantAdmin = require("../models/restaurantAdmin")

exports.clientIsLoggedIn = catchError(async (req , res , next) => {
   // const token = req.cookies.token || req.header('Authorization').replace('Bearer ','')
    const token = req.cookies.token
    if(!token)
        return next(new errorClass("Login to Access Site" , 401))
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
    if(req.session.user)
        next()
    else{
        req.session.user = await Client.findById(decoded.id)
        if(!req.session.user)
            return next(new errorClass("Login as Client to Access Site" , 401))
        next()
    }
    
})

exports.restaurantAdminIsLoggedIn = catchError(async (req , res , next) => {
    // const token = req.cookies.token || req.header('Authorization').replace('Bearer ','')
    const token = req.cookies.token
    if(!token)
         return next(new errorClass("Login as Restaurant Admin Access Site" , 401))
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
    if(req.session.user)
        next()
     else{
         req.session.user = await RestaurantAdmin.findById(decoded.id)
        if(!req.session.user)
            return next(new errorClass("Login as Client to Access Site" , 401))
        next()
     }
 })