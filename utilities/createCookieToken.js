const createCookieToken = (user , res) => {
    console.log('pika')
    const token = user.getToken()
    console.log(token)
    const options = {
        expires : new Date(
            Date.now() + (process.env.COOKIE_EXPIRY_TIME * 24 * 60 * 60 * 1000)
        ),
        httpOnly : true
    }
    console.log('COOOOOOKIEE')
    res.cookie('token' , token , options).redirect('/restaurants')
}

module.exports = createCookieToken