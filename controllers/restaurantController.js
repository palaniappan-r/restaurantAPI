const Restaurant = require('../models/restaurant');
const catchError = require('../utilities/catchError')
const ErrorClass = require('../utilities/errorClass')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const { urlencoded } = require('express')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')


exports.indexPage = catchError(async(req, res) => { 
    const rests = await Restaurant.find({});
    res.render('index' , {rests});
})

exports.newRestaurantForm = catchError(async(req , res) => { 
    res.render('new');
})

exports.showRestaurantInfo = catchError(async(req , res) => { 
    const {id} = req.params;
    const rest = await Restaurant.findById(id).populate('reviews');
    res.render('show',{rest});
})

exports.addNewItem = catchError(async(req , res) => { 
    if(!req.body.item)
        throw new ErrorClass('EMPTY REQUEST BODY' , 400)

    const {id} = req.params;
    const rest = await Restaurant.findById(id)
    
    rest.itemCount += 1
    await rest.save()

    rest.items.push(req.body.item)

    await rest.save()

    let avgP = 0
    for(let i of rest.items)
        avgP += i.price
    rest.avgPrice = (avgP/rest.itemCount)

    await rest.save()
    req.flash('success' , 'Successfully Added an Item')
    res.redirect(`/restaurants/${id}`)
})

exports.newItemForm = catchError(async(req , res) => { 
    const {id} = req.params;
    const rest = await Restaurant.findById(id);
    res.render('new_item',{id,rest})
})

exports.addNewRestaurant = catchError(async(req , res , next) => { 
    console.log(req.body)
    if(!req.body.restaurant)
        return next (new ErrorClass('EMPTY REQUEST BODY' , 404))

    const rest = await Restaurant.create(req.body.restaurant)

    if(req.body.cus1 == "on")
        rest.cuisines.push('Indian')
    if(req.body.cus2== "on")
        rest.cuisines.push('Pan-Asian')
    if(req.body.cus3 == "on")
        rest.cuisines.push('Chinese')
    if(req.body.cus4 == "on")
        rest.cuisines.push('Continental')
    if(req.body.cus5 == "on")
        rest.cuisines.push('Japanese')
    if(req.body.cus6 == "on")
        rest.cuisines.push('Korean')
    
    rest.itemCount = 0
    rest.avgPrice = 0
    await rest.save()
    req.flash('success' , 'Successfully Added a Restaurant ')
    res.redirect(`/restaurants/${rest._id}`)
})

exports.editRestaurantForm = catchError(async(req , res) => { 
    const {id} = req.params;
    const rest = await Restaurant.findById(id);
    temp = [rest.items , rest.avgPrice , rest.itemCount]
    res.render('update',{rest});
})

exports.updateRestaurantDetails = catchError(async(req , res) => { 
    await Restaurant.findByIdAndUpdate(req.params.id , req.body.restaurant)
    const rest = await Restaurant.findById(req.params.id)

    rest.cuisines = []

    if(req.body.restaurant.cus1 == "on")
        rest.cuisines.push('Indian')
    if(req.body.restaurant.cus2== "on")
        rest.cuisines.push('Pan-Asian')
    if(req.body.restaurant.cus3 == "on")
        rest.cuisines.push('Chinese')
    if(req.body.restaurant.cus4 == "on")
        rest.cuisines.push('Continental')
    if(req.body.restaurant.cus5 == "on")
        rest.cuisines.push('Japanese')
    if(req.body.restaurant.cus6 == "on")
        rest.cuisines.push('Korean')

    rest.items = temp[0]
    rest.avgPrice = temp[1]
    rest.itemCount = temp[2]
    rest.save()
    req.flash('success' , 'Successfully Updated ')
    res.redirect(`/restaurants/${rest._id}`)
})

exports.removeItem = catchError(async(req , res) => { 
    const rest_id = req.params.rest_id
    const item_id = req.params.item_id
    const rest = await Restaurant.findById(rest_id)

    for(i of rest.items){
        if(JSON.stringify(i._id) == JSON.stringify(item_id)){
            i.remove()
            rest.itemCount -= 1
        }
    }

    if(rest.itemCount != 0){
        let avgP = 0
        for(i of rest.items)
            avgP += i.price
        rest.avgPrice = (avgP/rest.itemCount)
    }
    else
        rest.avgPrice = 0

    rest.save()
    req.flash('success' , 'Successfully Deleted')
    res.redirect(`http://127.0.0.1:3000/restaurants/${rest_id}`)
})

exports.removeRestaurant = catchError(async(req , res) => {
    await Restaurant.findByIdAndDelete(req.params.id , req.body)
    res.redirect(`http://127.0.0.1:3000/restaurants/`)
})