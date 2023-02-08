const Client = require("../models/client")
const Restaurant = require('../models/restaurant')
const Order = require('../models/order')
const catchError = require('../utilities/catchError')
const ErrorClass = require('../utilities/errorClass')
const User = require("../models/client")
const Item = require("../models/item")

exports.addItemToCart = catchError(async (req , res , next) => {
    const client = await Client.findById(req.session.user._id)
    const item = await Item.findById(req.params.item_id)

    if(client.cart[0]){
        const inCart = await Item.findById(client.cart[0].itemID)
        if(inCart.restaurantID != item.restaurantID)
            return next(new ErrorClass('You cannot add items from different restaurants to the cart'))
    }

    const newCartItem = {
        itemID : item._id,
        itemName : item.name,
        unitPrice : item.price,
        quantity : req.body.quantity
    }
    client.cart.push(newCartItem)

    client.cartTotalPrice += (item.price * req.body.quantity)
    client.cartCount += 1
    client.save()
})

exports.removeItemFromCart = catchError(async (req , res , next) => {
    const client = await Client.findById(req.session.user._id)
    var index = 0
    for(let i of client.cart){
        if(JSON.stringify(i.itemID) === JSON.stringify(req.params.item_id)){
            client.cartCount -= 1
            client.cartTotalPrice -= (i.quantity * i.unitPrice)
            client.cart.splice(index,1)
            break
        }
        index++
    }
    client.save()
    return res.redirect(`/user/clientDetails`)
})

exports.updateItemCartQuantity = catchError(async (req , res , next) => {
    const client = await Client.findById(req.session.user._id)
    for(let i of client.cart){
        console.log(i)
        if(JSON.stringify(i.itemID) == JSON.stringify(req.params.item_id)){
            client.cartTotalPrice -= (i.quantity * i.unitPrice)
            i.quantity = req.body.new_quantity
            client.cartTotalPrice += (i.quantity * i.unitPrice)
            break
        }
    }
    await client.save()
    return res.redirect(`/user/clientDetails`)
})

exports.placeOrder = catchError(async (req , res , next) => {
    const client = await Client.findById(req.session.user._id)
    if(client.walletAmount >= client.cartTotalPrice){ 
        const newOrder = await Order.create({
            clientID : client._id,
        }) 
        const sampleItem = await Item.findById(client.cart[0].itemID)
        const rest = await Restaurant.findById(sampleItem.restaurantID)
        newOrder.items = client.cart
        newOrder.totalPrice  = client.cartTotalPrice

        rest.currentOrders.push(newOrder)
        rest.save()

        newOrder.status = 'Received'
        newOrder.save()
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
    if(rest.restaurantAdminID != req.session.user._id)
       return next(new ErrorClass('You can only access your own restaurant',400))
    res.render('showRestaurantPastOrders',{rest})
})

exports.restaurantCurrentOrders = catchError(async (req , res ,next) => {
    const rest = await Restaurant.findById(req.params.rest_id).populate('currentOrders')
    if(rest.restaurantAdminID != req.session.user._id)
       return next(new ErrorClass('You can only access your own restaurant',400))
    res.render('showRestaurantCurrentOrders',{rest})
})

exports.restaurantUpdateOrderStatus = catchError(async (req , res , next) => {
    const rest = await Restaurant.findById(req.params.rest_id)
    const status = req.body.status
    if(rest.restaurantAdminID != req.session.user._id)
       return next(new ErrorClass('You can only access your own restaurant',400))
    else{
        const order = await Order.findById(req.params.order_id)
        if(status == 'Confirmed' && order.status == 'Received' ){
            rest.totalRevenue += order.totalPrice
            order.status = status
        }
        else if(status == 'Cooking' && order.status == 'Confirmed')
            order.status = status
        else if(status == 'Done' && order.status == 'Cooking' ){ 
            order.status = status
            let index = 0
            for(let i of rest.currentOrders){
                if(i._id.equals(order._id)){
                    rest.currentOrders.splice(index,1)
                    rest.pastOrders.push(i)
                    break
                }
            index++
            }
        }
        else{
            return next(new ErrorClass('Order Status can only be updated sequentially in the order : Received -> Confirmed -> Cooking -> Done',400))
        }
        rest.save()
        order.save()
        res.redirect(`/restaurants/${rest._id}/currentOrders`)
    }
})

exports.restaurantCancelOrder = catchError(async (req , res ,next) => {
    const rest = await Restaurant.findById(req.params.rest_id)
    if(rest.restaurantAdminID != req.session.user._id)
       return next(new ErrorClass('You can only access your own restaurant',400))
    else{
        const order = await Order.findById(req.params.order_id)
        if(order.status == 'Confirmed' || order.status == 'Cooking')
            rest.totalRevenue -= order.totalPrice
        const user = await User.findById(order.clientID)
        user.walletAmount += order.totalPrice
        user.save()
        let index = 0
        for(let i of rest.currentOrders){
            if(i._id.equals(order._id)){
                rest.currentOrders.splice(index,1)
                rest.pastOrders.push(i)
                break
            }
            index++
        }
        order.status = 'Cancelled'
        order.save()
        rest.save()
        res.redirect(`/restaurants/${rest._id}/currentOrders`)
    }
})

exports.clientCancelOrder = catchError(async (req , res , next) => {
    const client = await Client.findById(req.session.user._id)
    const order = await Order.findById(req.params.order_id)
    if(!(client._id.equals(order.clientID)))
        return next(new ErrorClass('You can only update items in your cart',400))
    else{
        const rest = await Restaurant.findById(order.restaurantID)
        if(order.status == 'Received' || order.status == 'Confirmed'){
            const user = await User.findById(order.clientID)
            user.walletAmount += order.totalPrice
            user.save()
            let index = 0
            for(let i of rest.currentOrders){
                if(i._id.equals(order._id)){
                    rest.currentOrders.splice(index,1)
                    rest.pastOrders.push(i)
                    break
                }
                index++
            }
            order.status = 'Cancelled'
            order.save()
            rest.save()
            res.redirect(`/user/currentOrders`)
        }
        else
            return next(new ErrorClass('You cannot cancel the order now',400))
    }
})

exports.clientGetOrderStatus = catchError(async (req , res , next) => {
    const client = await Client.findById(req.session.user._id)
    const order = await Order.findById(req.params.order_id)
    if(!(client._id.equals(order.clientID)))
        return next(new ErrorClass('You can only view orders in your account',400))
    res.json(order.status)
})

