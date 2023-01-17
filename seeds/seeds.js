const mongoose = require('mongoose');
const { f_name, s_name, cusines , item_name1 , item_name2  , city_name , area_name} = require('./seedHelpers');
const Restaurant = require('../models/restaurant');

Restaurant.deleteMany({}) //Clearing DB

mongoose.connect('mongodb://localhost:27017/restaurantApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("error", console.error.bind(console, "DB Connection Error"));
mongoose.connection.once("open", () => {
    console.log("DB Connected");
});

const genRandNum = (range) => (Math.floor(Math.random() * range) + 1)

const shuffled = cusines.sort(() => 0.5 - Math.random());
const cusiArr = (n) => shuffled.slice(0,n)

const seedDB = async() => {
    let veganBool = false

    for (let i = 0; i < 10; i++) {

        const randNum = genRandNum(1000);
        if(randNum % 2 == 1)
            veganBool = true
        else
            veganBool = false

        const restaurant = new Restaurant({
            name :`${f_name[genRandNum(7)]} ${s_name[genRandNum(7)]}`,
            location: `${area_name[genRandNum(7)]},${city_name[genRandNum(7)]} `,
            rating : `${genRandNum(5)}`,
            cuisines : cusiArr(genRandNum(8)),
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
        await restaurant.save();
    }
    console.log('DB Populated')
}

seedDB().then(() => {
    mongoose.connection.close();
})