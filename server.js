const express = require('express')
const app = express(); 
const connectDB = require('./config/database')
const session = require('express-session')
const { connectSessionStore ,  sessionConfig } = require('./config/session')
const cookieParser = require('cookie-parser')
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const ErrorClass = require('./utilities/errorClass.js')
const restaurants = require('./routes/restaurants.js')
const users = require('./routes/users')
const passport = require('passport')
const passportAuth = require('./middleware/passport')
const dotevConfig = require('dotenv').config()

connectDB()
connectSessionStore()

//app.use(morgan('tiny'))
app.use(session(sessionConfig))
//app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize())
app.use(passport.session())

app.get('/' , (req , res) => {
    res.redirect('/restaurants')}
)

app.use('/user',users)
app.use('/restaurants',restaurants)

app.all('*' , (req , res , next) => {
    next(new ErrorClass('PAGE NOT FOUND' , 404))
})

app.use((err , req , res , next) => {
    const {statusCode = 400 , message = "ERROR"} = err
    res.render('errorPage' , {message , statusCode})
})

app.listen(process.env.PORT , () => {
    console.log(`Server Running at port ${process.env.PORT}`);
});