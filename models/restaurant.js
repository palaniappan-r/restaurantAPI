const mongoose = require('mongoose');
const Order = require('./order.js');
const Schema = mongoose.Schema;
const Review = require('./review.js')
const Item = require('./item.js')

const RestaurantSchema =  new Schema({
    name : {
    type : String
    },

    rating : {
    type : Number
    },

    description : {
    type : String
    },
    
    cuisines:{
        type:Array
    },

    avgPrice:{
        type:Number
    },

    vegan : {
        type : Boolean
    },

    items : [
        {
            type : Schema.Types.ObjectId,
            ref : Item
        }
    ],

    itemCount : {
        type : Number,
        min : 0
    },

    location : {
        type : String,
    },

    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : Review
        }
    ],

    restaurantAdminID : {
        type : String
    },

    restaurantOwner : {
        type : String
    },

    currentOrders : [
        {
            type : Schema.Types.ObjectId,
            ref : Order
        }
    ],

    pastOrders : [
        {
            type : Schema.Types.ObjectId,
            ref : Order
        }
    ],

    totalRevenue : {
        type : Number,
        min : 0
    }
});

module.exports = mongoose.model('Restaurant' , RestaurantSchema)
