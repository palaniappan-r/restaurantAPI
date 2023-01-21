const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const { urlencoded } = require('express');
const ejsMate = require('ejs-mate')
const catchError = require('./utilities/catchError.js')
const ErrorClass = require('./utilities/ErrorClass.js')

const restaurants = require('./routes/restaurants.js')

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/restaurantApp' , {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

mongoose.connection.on("error", console.error.bind(console, "DB Connection Error"));
mongoose.connection.once("open", () => {
    console.log("DB Connected");
});

const app = express(); 

app.use('/',restaurants)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate)

app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.listen(3000 , () => {
    console.log("Server Running");
});

app.all('*' , (req , res , next) => {
    next(new ErrorClass('PAGE NOT FOUND' , 404))
})

app.use((err , req , res , next) => {
    console.log("in use")
    console.log(err)
    const {statusCode = 400 , message = "ERROR"} = err
    //res.status(status).send(msg)
    res.render('errorPage' , {message , statusCode})
})

