const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    client_id : String,
    client_name : String,
    text : String,
    rating : Number
})

module.exports = mongoose.model("Review" , reviewSchema)