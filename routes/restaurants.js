const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant');

module.exports = router; 

router.get('/' , (req , res) => {
    res.redirect('/restaurants');
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
    const {id} = req.params;
    const rest = await Restaurant.findById(id);
    rest.itemCount += 1
    res.render('new_item',{id});
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
