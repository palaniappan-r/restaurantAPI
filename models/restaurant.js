const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

const itemSchema = new Schema({
    name : {
        type : String,
        required : true
    },

    price : {
        type : Number,
        required : true
    },

    veg : {
        type : Boolean,
    },

    vegan : {
        type : Boolean,
    },

    description : {
        type : String
    },

    signature : {
        type : Boolean
    },

    image : {
        type : [imageSchema]
    }
})

const RestaurantSchema =  new Schema({
    name : {
    type : String,
    required : true
    },

    rating : {
    type : Number,
    min : 0,
    max : 5
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
        type : Boolean,
    },

    items : {
        type:[itemSchema],
        required : false
    }, 

    itemCount : {
        type : Number,
        min : 0
    },

    location : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Restaurant' , RestaurantSchema)
