const mongoose = require('mongoose');
const cities = require('./cities');
const { f_name, s_name, cusines , item_name1 , item_name2 } = require('./seedHelpers');
const Restaurant = require('../models/restaurant');

Restaurant.deleteMany({}) //Clearing DB

mongoose.connect('mongodb://localhost:27017/restaurantAppDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("error", console.error.bind(console, "DB Connection Error"));
mongoose.connection.once("open", () => {
    console.log("DB Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const genRandNum = (range) => (Math.floor(Math.random() * range) + 1)


const cusiArr = () => {
    let array = ['']
    for(let i = 0 ; i < 3 ; i++)
        array[i] = cusines[genRandNum(5)]
    return array
}

const seedDB = async() => {
    let veganBool = false

    for (let i = 0; i < 10; i++) {

        const randNum = genRandNum(1000);
        if(randNum % 2 == 1)
            veganBool = true
        else
            veganBool = false

        const restaurant = new Restaurant({
            name :`${sample(f_name)} ${sample(s_name)}`,
            location: `${cities[randNum].city}, ${cities[randNum].state}`,
            rating : `${genRandNum(5)}`,
            cuisines : cusiArr(),
            avgPrice : 0,
            vegan : veganBool,
            itemCount : 0
        })

        for(let i = 0 ; i < 10 ; i++){
            const priceVar = genRandNum(100);
            let itemOb = {
                name : `${item_name1[genRandNum(4)]} ${item_name2[genRandNum(4)]}`,
                price : `${priceVar}`
            }
            restaurant.items.push(itemOb)
            restaurant.itemCount += 1
            restaurant.avgPrice += priceVar
        }

        restaurant.avgPrice /= 10

        console.log(restaurant)
        await restaurant.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})