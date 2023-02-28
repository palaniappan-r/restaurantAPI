const mongoose = require('mongoose')

const connectDB = () => {
    mongoose.set("strictQuery", false)
    mongoose.connect('mongodb://root:example@mongo:27017/?authSource=admin', {
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    mongoose.connection.on("error", console.error.bind(console, "DB Connection Error"));
    mongoose.connection.once("open", () => {
        console.log("DB Connected");
    })
}

module.exports = connectDB