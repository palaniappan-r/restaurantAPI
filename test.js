const express = require('express')
const session = require('express-session')
const app = express()

const sessionOptions = {secret : 'secret' , resave : 'false' , saveUninitialized : 'false'}

app.use(session(sessionOptions));

app.get('/view' , (req , res) => {
    if(req.session.countuwu){
        req.session.countuwu += 1
    }
    else
        req.session.countuwu = 1
    res.send(`${req.session.countuwu} Times`)
})

app.listen(3000)