const Client = require("../models/client")
const Restaurant = require('../models/restaurant')
const Order = require('../models/order')
const catchError = require('../utilities/catchError')
const ErrorClass = require('../utilities/errorClass')
const restaurant = require("../models/restaurant")

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
        for(i of client.cart){
            const order = await Order.findById(i)
            const rest = await Restaurant.findById(order.restaurantID)
            order.status = 'Received'
            order.save()
            rest.currentOrders.push(order)
            rest.save()
        }
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

exports.restaurantPastOrders = catchError(async (req , res ,next) => {
    const rest = await Restaurant.findById(req.params.rest_id).populate('pastOrders')
    if(!(rest.restaurantAdminID == req.user._id))
       return next(new ErrorClass('You can only access your own restaurant',400))
    res.render('showRestaurantPastOrders',{rest})
})

exports.restaurantCurrentOrders = catchError(async (req , res ,next) => {
    const rest = await Restaurant.findById(req.params.rest_id).populate('currentOrders')
    if(!(rest.restaurantAdminID == req.user._id))
       return next(new ErrorClass('You can only access your own restaurant',400))
    res.render('showRestaurantCurrentOrders',{rest})
})

exports.restaurantUpdateOrderStatus = catchError(async (req , res , next) => {
    const rest = await Restaurant.findById(req.params.rest_id)
    const status = req.query.status
    if(!(rest.restaurantAdminID == req.user._id))
       return next(new ErrorClass('You can only access your own restaurant',400))
    else{
        const order = await Order.findById(req.params.order_id)
        console.log(status,'------',order.status)
        if(status == 'Confirmed' && order.status == 'Received' )
            order.status = status
        else if(status == 'Cooking' && order.status == 'Confirmed')
            order.status = status
        else if(status == 'Done' ){ 
            order.status = status
            rest.totalRevenue += order.totalPrice
            const index = 0
            for(i of rest.currentOrders){
                //console.log(rest.currentOrders)
                //console.log(order._id)
                console.log('------------------')
                if(i._id.equals(order._id)){
                    console.log('found')
                    console.log(i)
                    rest.currentOrders.splice(index,1)
                    rest.pastOrders.push(i)
                    break
                }
            index++
            }
            rest.save()
        }
        order.save()
        res.redirect(`/restaurants/${rest._id}/currentOrders`)
    }
})

