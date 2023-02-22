const Client = require("../models/client")
const RestaurantAdmin = require('../models/restaurantAdmin')
const Restaurant = require('../models/restaurant')
const Order = require('../models/order')
const errorClass = require("../utilities/errorClass")
const catchError = require('../utilities/catchError')
const createCookieToken = require('../utilities/createCookieToken')
const sendMail = require('../utilities/sendMail')

exports.signupClientForm = ((req , res , next) => {
    res.render('../views/new_client.ejs')
})

exports.signupClient = catchError(async (req, res, next) => {
    const {name , password , email} = req.body;

    if(!name || !password || !email)
        return next(new errorClass('Name/Email/Password Missing' , 400))

    const newClient = await Client.create(req.body)
    newClient.cartCount = 0
    newClient.cartTotalPrice = 0
    newClient.walletAmount = 0
    newClient.createdAt = Date.now(0)
    newClient.save()
   // sendMail(newClient.email , 'restaurantAPI' , 'A new user has been registered with this email id')
    createCookieToken(newClient , res)
})

exports.clientLoginForm = ((req , res , next) => {
    res.render('../views/client_login.ejs')
 })

exports.clientLogin = catchError(async (req , res , next) => {
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

exports.clientLoginGoogle = catchError(async (req , res , next) => {
    const client = await Client.findOne({email : req.user._json.email})
    if(client){
        createCookieToken(client , res)
    }
    else{
        const newClient = await Client.create({
          name : req.user._json.name,
          email : req.user._json.email,
          googleID : req.user.id,
          cartCount : 0,
          cartTotalPrice : 0,
          walletAmount : 0,
        })
       // sendMail(newClient.email , 'restaurantAPI' , 'A new user has been registered with this email id')
        createCookieToken(newClient , res)
    }
})

exports.signupRestaurantAdminForm = ((req , res , next) => {
    res.render('../views/new_restaurant_admin.ejs')
})

exports.signupRestaurantAdmin = catchError(async (req, res, next) => {
    const {name , email , password} = req.body;

    if(!name || !password || !email)
        return next(new errorClass('Name/Email/Password Missing' , 400))

    const newRestaurantAdmin = await RestaurantAdmin.create(req.body)
    //sendMail(newRestaurantAdmin.email , 'restaurantAPI' , 'A new restaurant admin has been registered with this email id')
    createCookieToken(newRestaurantAdmin , res)
})

exports.restaurantAdminLoginForm = ((req , res , next) => {
    res.render('../views/restaurant_admin_login.ejs')
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

exports.restaurantAdminLoginGoogle = catchError(async (req , res , next) => {
    const restaurantAdmin = await RestaurantAdmin.findOne({email : req.user._json.email})
    if(restaurantAdmin){
        createCookieToken(restaurantAdmin , res)
    }
    else{
        const newRestaurantAdmin = await RestaurantAdmin.create({
          name : req.user._json.name,
          email : req.user._json.email,
          googleID : req.user.id,
        })
      //  sendMail(newRestaurantAdmin.email , 'restaurantAPI' , 'A new restaurant admin has been registered with this email id')
        createCookieToken(newRestaurantAdmin , res)
    }
})

exports.logout = catchError(async (req , res , next) => {
    res.cookie('token' , null , {
        expires : new Date(Date.now()),
        httpOnly : true
    })
    req.session = null
    res.redirect('/')
})

exports.restaurantAdminLogout = catchError(async (req , res , next) => {
    res.cookie('token' , null , {
        expires : new Date(Date.now()),
        httpOnly : true
    })
    req.session = null
    res.redirect('/')
})

exports.clientDetails =  catchError(async (req, res , next) => {
    const userInfo = await Client.findById(req.session.user._id).populate('cart');
    res.status(200).render('../views/client_details',{userInfo})
})

exports.clientCurrentOrders = catchError(async (req, res , next) => {
    const query = {'clientID' : req.session.user._id ,  $or: [ { 'status': 'Confirmed'}, { 'status': 'Cooking' },{ 'status': 'Received' }  ] }
    const orders = await Order.find(query)
    console.log(orders)
    res.render('../views/clientCurrentOrders' , {orders})
})

exports.clientPastOrders = catchError(async (req , res , next) => {
    const query = {'clientID' : req.session.user._id ,  $or: [ { 'status': 'Done'}, { 'status': 'Cancelled' } ] }
    const orders = await Order.find(query)
    res.render('../views/clientPastOrders' , {orders}).status(123)
})

exports.restaurantAdminHome = catchError(async(req , res) => {
    const userInfo = req.session.user
    const rests = await Restaurant.find({"restaurantAdminID" : userInfo._id});
    res.render('../views/restaurantAdminHome' , {userInfo , rests})
})

exports.addFundsToWallet = catchError(async (req , res , next) => {
    const client = await Client.findById(req.session.user._id);
    client.walletAmount += parseInt(req.body.addFunds)
    client.save()
    return res.redirect('/user/clientDetails')
}) 
