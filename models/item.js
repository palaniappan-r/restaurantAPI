const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

const itemSchema = new Schema({
    name : {
        type : String,
    },

    price : {
        type : Number,
    },

    description : {
        type : String
    },

    image : {
        type : [imageSchema]
    },

    restaurantID : {
        type : String
    }
},{timestamps: true})


module.exports = mongoose.model("Item" , itemSchema)