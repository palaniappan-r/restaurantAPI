const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant');
const { urlencoded } = require('express');
const methodOverride = require('method-override');
module.exports = router; 

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));
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

    await rest.save()

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
    await rest.save()
    res.render('new_item',{id,rest});
})

router.post('/restaurants' , async(req , res) => {
    res.send('editing')
    const rest = new Restaurant(req.body);
    rest.itemCount = 0
    rest.avgPrice = 0
    await rest.save();
    console.log(rest)
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

router.delete('/restaurants/:id' , async(req , res) => {
    await Restaurant.findByIdAndDelete(req.params.id , req.body)
    res.redirect(`/restaurants`)
})

module.exports = router
