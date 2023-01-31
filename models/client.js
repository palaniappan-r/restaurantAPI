const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const clientSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , 'Name is required']
    },
    email : {
        type : String,
        required : [true , 'Email ID is required'],
        validate : [validator.isEmail , 'Enter Email in correct format'],
        unique : true
    },
    password : {
        type : String,
        required : [true , 'Password is required']
    }
})

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