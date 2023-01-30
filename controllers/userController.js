const Client = require("../models/client")
const RestaurantAdmin = require('../models/restaurantAdmin')
const errorClass = require("../utilities/errorClass")
const catchError = require('../utilities/catchError')
const createCookieToken = require('../utilities/createCookieToken')


//Maybe merge both into a single fn later

exports.signupClientForm = ((req , res , next) => {
    res.render('../views/new_client.ejs')
})

exports.signupRestaurantAdminForm = ((req , res , next) => {
    res.render('../views/new_restaurant_admin.ejs')
})

exports.signupClient = catchError(async (req, res, next) => {
    const {name , password , email} = req.body;

    if(!name || !password || !email)
        return next(new errorClass('Name/Email/Password Missing' , 400))

    const newClient = await Client.create(req.body)
    createCookieToken(newClient , res)
})

exports.signupRestaurantAdmin = catchError(async (req, res, next) => {
    const {name , email , password} = req.body;

    if(!name || !password || !email)
        return next(new errorClass('Name/Email/Password Missing' , 400))

    const newRestaurantAdmin = await RestaurantAdmin.create(req.body)
    
    createCookieToken(newRestaurantAdmin , res)
})

exports.restaurantAdminLoginForm = ((req , res , next) => {
    res.render('../views/restaurant_admin_login.ejs')
})

exports.clientLogin = catchError(async (req , res , next) => {
    console.log(req.body)
    const {email , password} = req.body
    
    if(!email || !password)
        return next(new errorClass('Email/Password Missing' , 400))

    const client = await Client.findOne({email}).select('+password')

    if(!client)
        return next(new errorClass('No User Found' , 400))

    const pass = await client.chkPassword(password)

    if(!pass)
        return next(new errorClass('Wrong Password' , 400))

    createCookieToken(client , res)
})

exports.clientLoginForm = ((req , res , next) => {
    res.render('../views/client_login.ejs')
 })

exports.restaurantAdminLogin = catchError(async (req , res , next) => {
    const {email , password} = req.body
    
    if(!email || !password)
        return next(new errorClass('Email/Password Missing' , 400))

    const restaurantAdmin = await RestaurantAdmin.findOne({email}).select('+password')

    if(!restaurantAdmin)
        return next(new errorClass('No User Found' , 400))

    const pass = await restaurantAdmin.chkPassword(password)

    if(!pass)
        return next(new errorClass('Wrong Password' , 400))

    createCookieToken(restaurantAdmin , res)
})

exports.clientLogout = catchError(async (req , res , next) => {
    res.cookie('token' , null , {
        expires : new Date(Date.now()),
        httpOnly : true
    })
    res.redirect('/')
})

exports.restaurantAdminLogout = catchError(async (req , res , next) => {
    res.cookie('token' , null , {
        expires : new Date(Date.now()),
        httpOnly : true
    })
})

exports.clientDetails =  catchError(async (req, res , next) => {
    const user = await Client.findById(req.user.id);

    res.status(200).json({
         success:true,
         user
     })
})