const Client = require("../models/client")
const RestaurantAdmin = require('../models/restaurantAdmin')
const Restaurant = require('../models/restaurant')
const errorClass = require("../utilities/errorClass")
const catchError = require('../utilities/catchError')
const createCookieToken = require('../utilities/createCookieToken')
const ErrorClass = require('../utilities/errorClass')

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
    newClient.cartCount = 0
    newClient.cartTotalPrice = 0
    newClient.save()
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

exports.logout = catchError(async (req , res , next) => {
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
    const userInfo = await Client.findById(req.user.id);
    res.status(200).render('../views/client_details',{userInfo})
})

exports.restaurantAdminHome = catchError(async(req , res) => {
    const userInfo = req.user
    const rests = await Restaurant.find({"restaurantAdminID" : userInfo._id});
    res.render('../views/restaurantAdminHome' , {userInfo , rests})
})

exports.addItemToCart = catchError(async (req , res , next) => {
    const client = await Client.findById(req.user.id);
    const restaurant = await Restaurant.findById(req.params.rest_id)
    var item

    for(i of restaurant.items){
        if(JSON.stringify(i._id) == JSON.stringify(req.params.item_id)){
            item = i
        }
    }

    if(!(client._id.equals(req.user._id)))
       return next(new ErrorClass('Client Access Denied',400))
    else{
            client.cart.push({
                restaurantID : req.params.rest_id,
                itemID : req.params.item_id,
                restaurantName : restaurant.name,
                itemName : item.name,
                quantity : req.body.quantity,
                unitPrice : item.price,
                totalPrice : (item.price * req.body.quantity),
                status : 'In Cart'
            }) 
            client.cartTotalPrice += (item.price * req.body.quantity)
            client.cartCount += 1
            client.save()
    }

})

exports.removeItemFromCart = catchError(async (req , res , next) => {
    const client = await Client.findById(req.user.id);
    if(!(client._id.equals(req.user._id)))
       return next(new ErrorClass('Client Access Denied',400))
    else{
        for(i of client.cart){
            if(JSON.stringify(i.itemID) == JSON.stringify(req.params.item_id)){
                client.cartTotalPrice -= i.totalPrice
                i.remove()
               client.cartCount -= 1
               client.save()
            }
        }
        return res.redirect(`/user/clientDetails`)
    }
})

exports.updateItemCartQuantity = catchError(async (req , res , next) => {
    const client = await Client.findById(req.user.id);
    if(!(client._id.equals(req.user._id)))
       return next(new ErrorClass('Client Access Denied',400))
    else{
        for(i of client.cart){
            if(JSON.stringify(i.itemID) == JSON.stringify(req.params.item_id)){
                client.cartTotalPrice -= i.totalPrice
               i.quantity = req.body.new_quantity
               i.totalPrice = (i.quantity * i.unitPrice)
               client.cartTotalPrice += i.totalPrice
               client.save()
            }
        }
        return res.redirect(`/user/clientDetails`)
    }
})