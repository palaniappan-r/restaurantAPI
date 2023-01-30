const Client = require("../models/client")
const RestaurantAdmin = require('../models/restaurantAdmin')
const errorClass = require("../utilities/errorClass")
const catchError = require('../utilities/catchError')
const createCookieToken = require('../utilities/createCookieToken')

exports.clientLogin1 = ((req , res , next) => {
    res.render('../views/client_login.ejs')
 })