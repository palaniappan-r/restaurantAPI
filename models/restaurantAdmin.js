const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const restaurantAdminSchema = new mongoose.Schema({
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
    }
},{timestamps: true})

restaurantAdminSchema.pre("save" , async function (next) {
    if(!(this.isModified('password'))){
        return next();
    }
    this.password = await bcrypt.hash(this.password , 10)
})

restaurantAdminSchema.methods.chkPassword = async function (sentPassword) {
    return await bcrypt.compare(sentPassword , this.password)
}

restaurantAdminSchema.methods.getToken = function () {
    return jwt.sign({id : this._id} , process.env.JWT_SECRET_KEY , {
        expiresIn : process.env.JWT_EXPIRY_TIME
    })
}

module.exports = mongoose.model("RestaurantAdmin" , restaurantAdminSchema)