const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    client_id : String,
    client_name : String,
    text : String,
    rating : Number
},{timestamps: true})

module.exports = mongoose.model("Review" , reviewSchema)