const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const { urlencoded } = require('express')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ErrorClass = require('./utilities/ErrorClass.js')
const restaurants = require('./routes/restaurants.js')
const reviews = require('./routes/reviews.js')

mongoose.set("strictQuery", false)
mongoose.connect('mongodb://127.0.0.1:27017/restaurantApp' , {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
mongoose.connection.on("error", console.error.bind(console, "DB Connection Error"));
mongoose.connection.once("open", () => {
    console.log("DB Connected");
})

const sessionConfig = {
    secret : 'secret',
    resave : 'false',
    saveUnintialized : 'true',
    //store : add mongo/redis store later
    cookie : {
        expires : Date.now() + (1000 * 60 * 60 * 24),
        maxAge : (1000 * 60 * 60 * 24)
    }
}

const app = express(); 

app.use(morgan('tiny'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)
app.use(urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session(sessionConfig))
app.use(flash())

app.use((req , res , next) => {
    res.locals.success  = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/restaurants',restaurants)
app.use('/restaurants/reviews',reviews)

app.all('*' , (req , res , next) => {
    next(new ErrorClass('PAGE NOT FOUND' , 404))
})

app.use((err , req , res , next) => {
    const {statusCode = 400 , message = "ERROR"} = err
    res.render('errorPage' , {message , statusCode})
})

app.listen(3000 , () => {
    console.log("Server Running");
});