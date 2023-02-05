const session = require('express-session')
const ErrorClass = require('../utilities/errorClass.js')
const {createClient} = require('redis')
const connectRedis = require('connect-redis')
const redisStore = connectRedis(session)
const redisClient = createClient({legacyMode: true})

require('dotenv').config()

const connectSessionStore = () => {
    redisClient.connect().catch(e => {throw (new ErrorClass('Redis Connection Failed' , 404))})
}

const sessionConfig = {
    path : '/',
    secret : process.env.SESSION_SECRET_KEY,
    resave : false,
    saveUnintialized : true,
     store : new redisStore({
        client : redisClient,
        prefix : 'SESSION'
    }),
}

module.exports = {connectSessionStore , sessionConfig}
