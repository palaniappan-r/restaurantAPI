const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Restaurant = require('../models/restaurant');
const methodOverride = require('method-override');
const { urlencoded } = require('express');
const ejsMate = require('ejs-mate')

mongoose.connect('mongodb://localhost:27017/restaurantAppDB' , {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

mongoose.set('strictQuery', false);

mongoose.connection.on("error", console.error.bind(console, "DB Connection Error"));
mongoose.connection.once("open", () => {
    console.log("DB Connected");
});

const router = express(); 

router.set('view engine', 'ejs');
router.set('views', path.join(__dirname, '../views'));
router.engine('ejs', ejsMate)

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));

router.listen(8080 , () => {
    console.log("Server Running");
});

router.get('/' , (req , res) => {
    res.send('Home');
});

router.get('/restaurants' , async (req, res) => {
    const rests = await Restaurant.find({});
    res.render('index' , {rests});
})

router.get('/restaurants/new' , async(req , res) => {
    res.render('new');
})

router.get('/restaurants/:id' , async(req , res) => {
    const {id} = req.params;
    const rest = await Restaurant.findById(id);
    res.render('show',{rest});
})

router.post('/restaurants/:id' , async(req , res) => {
    console.log(req.body)
    const {id} = req.params;
    const rest = await Restaurant.findById(id)
    rest.items.push(req.body)

    let avgP = 0
    for(i of rest.items)
        avgP += i.price
    rest.avgPrice = (avgP/rest.itemCount)

    await rest.save()
    res.redirect(`/restaurants/${id}`)
})

router.get('/restaurants/newItem/:id' , async(req , res) => {
    try{
    const {id} = req.params;
    const rest = await Restaurant.findById(id);
    rest.itemCount += 1
    res.render('new_item',{rest,id});
    }
    catch(e){
        res.send(e)
    }
})

router.post('/restaurants' , async(req , res) => {
    const rest = new Restaurant(req.body);
    res.itemsCount = 0
    await rest.save();
    res.redirect('/restaurants')
})

router.get('/restaurants/:id/update' , async(req , res) => {
    const {id} = req.params;
    const rest = await Restaurant.findById(id);
    res.render('update',{rest});
})

router.put('/restaurants/:id' , async(req , res) => {
    await Restaurant.findByIdAndUpdate(req.params.id , req.body)
    res.redirect(`/restaurants/${req.params.id}`)
})

router.get('/restaurants/:rest_id/:item_id/delete' , async(req , res) => {
    const rest_id = req.params.rest_id
    const item_id = req.params.item_id
    const rest = await Restaurant.findById(rest_id)

    for(i of rest.items){
        if(JSON.stringify(i._id) == JSON.stringify(item_id))
            i.remove()
    }

    let avgP = 0
    for(i of rest.items)
        avgP += i.price
    rest.avgPrice = (avgP/rest.itemCount)

    rest.save()
    res.redirect(`/restaurants/${rest_id}`)
})

module.exports = router 