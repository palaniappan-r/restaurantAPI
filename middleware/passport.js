const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

require('dotenv').config()

passport.use('clientLogin',
    new GoogleStrategy(
        {
            clientID : process.env.GOOGLE_PASSPORT_ID,
            clientSecret : process.env.GOOGLE_PASSPORT_SECRET,
            callbackURL : process.env.GOOGLE_PASSPORT_CLIENT_CALLBACKURL,
            scope : ['email' , 'profile']
        },
        (function (accessToken , profileToken , profile , next) {
          return next(null , profile)
        })
    )
)

passport.use('restaurantAdminLogin',
    new GoogleStrategy(
        {
            clientID : process.env.GOOGLE_PASSPORT_ID,
            clientSecret : process.env.GOOGLE_PASSPORT_SECRET,
            callbackURL : process.env.GOOGLE_PASSPORT_RESADMN_CALLBACKURL,
            scope : ['email' , 'profile']
        },
        (function (accessToken , profileToken , profile , next) {
            return next(null , profile)
        })
    )
)

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});