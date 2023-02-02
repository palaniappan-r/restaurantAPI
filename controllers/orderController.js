const Client = require("../models/client")
const Restaurant = require('../models/restaurant')
const Order = require('../models/order')
const catchError = require('../utilities/catchError')
const ErrorClass = require('../utilities/errorClass')

exports.addItemToCart = catchError(async (req , res , next) => {
    const client = await Client.findById(req.user.id);
    const restaurant = await Restaurant.findById(req.params.rest_id)
    var item

    for(i of restaurant.items){
        if(JSON.stringify(i._id) == JSON.stringify(req.params.item_id)){
            item = i
        }
    }

    if(!(client._id.equals(req.params.user_id)))
       return next(new ErrorClass('Client Access Denied',400))
    else{
            const newOrder = await Order.create({
                restaurantID : req.params.rest_id,
                itemID : req.params.item_id,
                restaurantName : restaurant.name,
                itemName : item.name,
                quantity : req.body.quantity,
                unitPrice : item.price,
                totalPrice : (item.price * req.body.quantity),
            }) 
            newOrder.save()
            client.cart.push(newOrder._id)
            client.cartTotalPrice += (item.price * req.body.quantity)
            client.cartCount += 1
            client.save()
    }

})

exports.removeItemFromCart = catchError(async (req , res , next) => {
    const client = await Client.findById(req.user.id);
    var order
    if(!(client._id.equals(req.params.user_id)))
        return next(new ErrorClass('Client Access Denied',400))
    else{
        const index = 0
        for(i of client.cart){
            if(JSON.stringify(i) === JSON.stringify(req.params.order_id)){
                order = await Order.findById(i)
                client.cartCount -= 1
                client.cartTotalPrice -= order.totalPrice
                client.cart.splice(index)
                await Order.findByIdAndDelete(i)
                break
            }
            index++
        }
        client.save()
        return res.redirect(`/user/clientDetails`)
    }
})

exports.updateItemCartQuantity = catchError(async (req , res , next) => {
    const client = await Client.findById(req.user.id);
    var order
    if(!(client._id.equals(req.params.user_id)))
        return next(new ErrorClass('Client Access Denied',400))
    else{
        var index = 0
        for(i of client.cart){
            if(JSON.stringify(i) === JSON.stringify(req.params.order_id)){
                order = await Order.findById(i)
                client.cartTotalPrice -= order.totalPrice
                order.quantity = req.body.new_quantity
                order.totalPrice = (order.quantity * order.unitPrice)
                await order.save()
                client.cartTotalPrice += order.totalPrice
                break
            }
            index++
        }
        await client.save()
        return res.redirect(`/user/clientDetails`)
    }
})

exports.placeOrder = catchError(async (req , res , next) => {
    const client = await Client.findById(req.user.id);
    if(!(client._id.equals(req.params.user_id)))
         return next(new ErrorClass('Client Access Denied',400))
    if(client.walletAmount >= client.cartTotalPrice){
        client.walletAmount -= client.cartTotalPrice  
        client.cartTotalPrice = 0
        client.cart = []
        client.save()
        return res.redirect('/user/clientDetails') 
    }
    else{
        return next(new ErrorClass('Insufficient Wallet Funds',400))
    }
})