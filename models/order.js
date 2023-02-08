const mongoose = require('mongoose')

const clientOrder = new mongoose.Schema({
    itemID : {
        type : String
    },
    itemName : {
        type : String
    },
    unitPrice : {
        type : Number
    },
    quantity : {
        type : Number
    }
})

const orderSchema = new mongoose.Schema({
    clientID : {
        type : String,
    },
    restaurantID : {
        type : String,
    },
    restaurantName : {
        type : String,
    },
    items : [clientOrder],
    totalPrice : {
        type : Number,
    },
    status : {
        type : String,
        enum : ['Received','Confirmed','Cooking','Done','Cancelled']
    }
},{timestamps: true})


module.exports = mongoose.model("Order" , orderSchema)