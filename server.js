const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const { urlencoded } = require('express');
const ejsMate = require('ejs-mate')

const restaurants = require('./routes/restaurants.js')

mongoose.connect('mongodb://localhost:27017/restaurantApp' , {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

mongoose.set('strictQuery', false);

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

