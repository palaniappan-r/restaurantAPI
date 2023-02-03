const express = require('express')
const connectDB = require('./config/database')
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ErrorClass = require('./utilities/errorClass.js')
const restaurants = require('./routes/restaurants.js')
const reviews = require('./routes/reviews.js')
const users = require('./routes/users')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

require('dotenv').config()

connectDB()

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

app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session(sessionConfig))
app.use(flash())

app.use((req , res , next) => {
    res.locals.success  = req.flash('success')
    res.locals.error = req.flash('error')
    return next()
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/' , (req , res) => {
    res.redirect('/restaurants')}
)

app.use('/user',users)
app.use('/restaurants',restaurants)
app.use('/restaurants/reviews',reviews)


app.all('*' , (req , res , next) => {
    next(new ErrorClass('PAGE NOT FOUND' , 404))
})

app.use((err , req , res , next) => {
    const {statusCode = 400 , message = "ERROR"} = err
    res.render('errorPage' , {message , statusCode})
})

app.listen(process.env.PORT , () => {
    console.log("Server Running");
});