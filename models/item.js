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

module.exports = mongoose.model('item' , itemSchema)