const mongoose = require('mongoose')

const connectDB = () => {
    mongoose.set("strictQuery", false)
    mongoose.connect(process.env.DATABASE_URL , {
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    mongoose.connection.on("error", console.error.bind(console, "DB Connection Error"));
    mongoose.connection.once("open", () => {
        console.log("DB Connected");
    })
}

module.exports = connectDB