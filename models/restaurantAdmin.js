const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const restaurantAdminSchema = new mongoose.Schema({
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

restaurantAdminSchema.pre("save" , async function (next) {
    if(!(this.isModified('password'))){
        return next();
    }
    this.password = await bcrypt.hash(this.password , 10)
})

restaurantSchema.methods.chkValidatedPassword = async function (sentPassword) {
    return await bcrypt.compare(sentPassword , this.password)
}

restaurantAdminSchema.methods.getToken = function () {
    return jwt.sign({id : this._id} , "secret-key" , {
        expiresIn : '2d'
    })
}

module.exports = mongoose.model("RestaurantAdmin" , restaurantAdminSchema)