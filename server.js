const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Restaurant = require('./models/restaurant');
const methodOverride = require('method-override');
const { urlencoded } = require('express');
const ejsMate = require('ejs-mate')

const restaurants = require('./routes/restaurants')

mongoose.connect('mongodb://localhost:27017/restaurantAppDB' , {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

mongoose.set('strictQuery', false);

mongoose.connection.on("error", console.error.bind(console, "DB Connection Error"));
mongoose.connection.once("open", () => {
    console.log("DB Connected");
});

const app = express(); 

app.use('/restaurants',restaurants)


