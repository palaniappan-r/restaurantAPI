const errorClass = require('../utilities/errorClass')
const jwt = require('jsonwebtoken')
const catchError = require('../utilities/catchError')
const Client = require("../models/client")
const RestaurantAdmin = require("../models/restaurantAdmin")

exports.clientIsLoggedIn = catchError(async (req , res , next) => {
   // const token = req.cookies.token || req.header('Authorization').replace('Bearer ','')
    const token = req.cookies.token
    if(!token){
        req.session.destroy()
        return next(new errorClass("Login to Access Site" , 401))
    }
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
    if(req.session.user){
        const userInfo = await Client.findById(decoded.id)
        if(userInfo)
            return next()
        else
            return next(new errorClass("Wrong Credentials" , 401))
    }
    else{
        const userInfo = await Client.findById(decoded.id)
        if(!userInfo){
            req.session.destroy()
            return next(new errorClass("Login as Client to Access Site" , 401))
        }
        userInfo.password = undefined
        req.session.user = userInfo
        return next()
    }
    
})

exports.restaurantAdminIsLoggedIn = catchError(async (req , res , next) => {
    // const token = req.cookies.token || req.header('Authorization').replace('Bearer ','')
    const token = req.cookies.token
    if(!token){
        req.session.destroy()
        return next(new errorClass("Login to Access Site" , 401))
    }
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
    if(req.session.user){
        const userInfo = await RestaurantAdmin.findById(decoded.id)
        if(userInfo)
            return next()
        else
            return next(new errorClass("Wrong Credentials" , 401))
    }
    else{
        const userInfo = await RestaurantAdmin.findById(decoded.id)
        if(!userInfo){
            req.session.destroy()
            return next(new errorClass("Login as Client to Access Site" , 401))
        }
        userInfo.password = undefined
        req.session.user = userInfo
        return next()
     }
 })

 //The following code is for session based auth without jwt cookie tokens

 exports.clientIsLoggedIn_noToken = catchError(async (req , res , next) => {
    // const token = req.cookies.token || req.header('Authorization').replace('Bearer ','')
     if(req.session.user){
         console.log('Exists')
         const userInfo = await Client.findById(req.session.user._id)
         if(userInfo)
             return next()
         else
             return next(new errorClass("No Client Found" , 401))
     }
     
 })
 
 exports.restaurantAdminIsLoggedIn_noToken = catchError(async (req , res , next) => {
     // const token = req.cookies.token || req.header('Authorization').replace('Bearer ','')
     if(req.session.user){
         console.log('resExists')
         const userInfo = await RestaurantAdmin.findById(req.session.user._id)
         if(userInfo)
             return next()
         else
             return next(new errorClass("No User Found" , 401))
     }
  })