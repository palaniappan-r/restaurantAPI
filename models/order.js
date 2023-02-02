const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    restaurantID : {
        type : String,
        required : true
    },
    restaurantName : {
        type : String,
    },
    itemID : {
        type : String,
        required : true
    },
    itemName : {
        type : String,
    },
    quantity : {
        type : Number,
        min : 1,
    },
    unitPrice : {
        type : Number,
    },
    totalPrice : {
        type : Number,
    },
})


module.exports = mongoose.model("Order" , orderSchema)