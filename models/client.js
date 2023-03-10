const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema
const Order = require('./order')

const cartSchema = new Schema({
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

const clientSchema = new Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
        validate : [validator.isEmail , 'Enter Email in correct format'],
        unique : true
    },
    password : {
        type : String,
    },
    cart :{
        type : [cartSchema]
    },
    address :{
        type  : String
    },
    cartCount : {
        type : Number,
        min : 0
    },
    cartTotalPrice : {
        type : Number,
        min : 0
    },
    walletAmount : {
        type : Number,
        min : 0
    },
    googleID : {
        type : String
    },
},{timestamps: true})

clientSchema.pre("save" , async function (next) {
    if(!(this.isModified('password'))){
        return next();
    }
    this.password = await bcrypt.hash(this.password , 10)
})

clientSchema.methods.chkPassword = async function (sentPassword) {
    return await bcrypt.compare(sentPassword , this.password)
}

clientSchema.methods.getToken = function () {
    return jwt.sign({id : this._id} , process.env.JWT_SECRET_KEY , {
        expiresIn : process.env.JWT_EXPIRY_TIME
    })
}


module.exports = mongoose.model("Client" , clientSchema)
