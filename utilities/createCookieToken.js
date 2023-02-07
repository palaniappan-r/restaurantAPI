const createCookieToken = (user , res) => {
    const token = user.getToken()
    const options = {
        expires : new Date(
            Date.now() + (process.env.COOKIE_EXPIRY_TIME * 24 * 60 * 60 * 1000)
        ),
        httpOnly : true
    }
    return res.cookie('token' , token , options).redirect('/restaurants')
}

module.exports = createCookieToken