const Client = require("../models/client")
const Restaurant = require('../models/restaurant')
const Order = require('../models/order')
const catchError = require('../utilities/catchError')
const ErrorClass = require('../utilities/errorClass')
const User = require("../models/client")

exports.addItemToCart = catchError(async (req , res , next) => {
    const client = await Client.findById(req.user.id);
    const restaurant = await Restaurant.findById(req.params.rest_id)
    let item

    for(let i of restaurant.items){
        if(JSON.stringify(i._id) == JSON.stringify(req.params.item_id)){
            item = i
        }
    }

    if(!(client._id.equals(req.params.user_id)))
       return next(new ErrorClass('You can only add items to your cart',400))
    else{
            const newOrder = await Order.create({
                clientID : client._id,
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
    let order
    if(!(client._id.equals(req.params.user_id)))
        return next(new ErrorClass('You can only remove items from your cart',400))
    else{
        let index = 0
        for(let i of client.cart){
            if(JSON.stringify(i) === JSON.stringify(req.params.order_id)){
                order = await Order.findById(i)
                client.cartCount -= 1
                client.cartTotalPrice -= order.totalPrice
                client.cart.splice(index,1)
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
    let order
    if(!(client._id.equals(req.params.user_id)))
        return next(new ErrorClass('You can only update items in your cart',400))
    else{
        for(let i of client.cart){
            if(JSON.stringify(i) === JSON.stringify(req.params.order_id)){
                order = await Order.findById(i)
                client.cartTotalPrice -= order.totalPrice
                order.quantity = req.body.new_quantity
                order.totalPrice = (order.quantity * order.unitPrice)
                await order.save()
                client.cartTotalPrice += order.totalPrice
                break
            }
        }
        await client.save()
        return res.redirect(`/user/clientDetails`)
    }
})

exports.placeOrder = catchError(async (req , res , next) => {
    const client = await Client.findById(req.user.id);
    if(!(client._id.equals(req.params.user_id)))
         return next(new ErrorClass('You can only place orders in your cart',400))
    if(client.walletAmount >= client.cartTotalPrice){
        for(let i of client.cart){
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
    if(rest.restaurantAdminID != req.user._id)
       return next(new ErrorClass('You can only access your own restaurant',400))
    res.render('showRestaurantPastOrders',{rest})
})

exports.restaurantCurrentOrders = catchError(async (req , res ,next) => {
    const rest = await Restaurant.findById(req.params.rest_id).populate('currentOrders')
    if(rest.restaurantAdminID != req.user._id)
       return next(new ErrorClass('You can only access your own restaurant',400))
    res.render('showRestaurantCurrentOrders',{rest})
})

exports.restaurantUpdateOrderStatus = catchError(async (req , res , next) => {
    const rest = await Restaurant.findById(req.params.rest_id)
    const status = req.body.status
    if(rest.restaurantAdminID != req.user._id)
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
    if(rest.restaurantAdminID != req.user._id)
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
    //console.log(req.params)
    const client = await Client.findById(req.user.id);
    const order = await Order.findById(req.params.order_id)
    if(!(client._id.equals(req.params.user_id)))
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
            return next(new ErrorClass('You cant cancel the order now',400))
    }
})

