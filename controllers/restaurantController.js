const Restaurant = require('../models/restaurant');
const catchError = require('../utilities/catchError')
const ErrorClass = require('../utilities/errorClass')

exports.indexPage = catchError(async(req, res) => { 
    const rests = await Restaurant.find({});
    res.render('index' , {rests});
})

exports.newRestaurantForm = catchError(async(req , res) => { 
    res.render('new');
})

exports.showRestaurantClientInfo = catchError(async(req , res) => { 
    const rest = await Restaurant.findById(req.params.rest_id).populate('reviews');
    const clientid = (req.session.user._id);
    res.render('show_client',{rest,clientid});
})

exports.showRestaurantAdminInfo = catchError(async(req , res , next) => { 
    const rest = await Restaurant.findById(req.params.rest_id).populate('reviews');
    const userid = req.session.user._id
    if((rest.restaurantAdminID != req.session.user._id))
       return next(new ErrorClass('You can only access your own restaurant',400))
    else
        return res.render('show_admin',{rest,userid});
})

exports.addNewItem = catchError(async(req , res) => { 
    if(!req.body.item)
        return next (new ErrorClass('EMPTY REQUEST BODY' , 400))

    const rest = await Restaurant.findById(req.params.rest_id)
    if((rest.restaurantAdminID != req.session.user._id))
       return next(new ErrorClass('You can only access your own restaurant',400))

    rest.itemCount += 1
    await rest.save()

    rest.items.push(req.body.item)

    await rest.save()

    let avgP = 0
    for(let i of rest.items)
        avgP += i.price
    rest.avgPrice = (avgP/rest.itemCount)

    await rest.save()
   // req.flash('success' , 'Successfully Added an Item')
    return res.redirect(`/restaurants/admin/${req.params.rest_id}`)
})

exports.newItemForm = catchError(async(req , res) => { 
    const rest = await Restaurant.findById(req.params.rest_id);
    res.render('new_item',{rest})
})

exports.addNewRestaurant = catchError(async(req , res , next) => { 
    if(!req.body.restaurant)
        return next (new ErrorClass('EMPTY REQUEST BODY' , 404))
    
    const rest = await Restaurant.create(req.body.restaurant)

    if(req.body.cus1 == "on")
        rest.cuisines.push('Indian')
    if(req.body.cus2== "on")
        rest.cuisines.push('Pan-Asian')
    if(req.body.cus3 == "on")
        rest.cuisines.push('Chinese')
    if(req.body.cus4 == "on")
        rest.cuisines.push('Continental')
    if(req.body.cus5 == "on")
        rest.cuisines.push('Japanese')
    if(req.body.cus6 == "on")
        rest.cuisines.push('Korean')
    
    rest.itemCount = 0
    rest.avgPrice = 0
    rest.restaurantAdminID = req.session.user._id
    rest.restaurantOwner = req.session.user.name
    rest.totalRevenue = 0
    await rest.save()
    //req.flash('success' , 'Successfully Added a Restaurant ')
    return res.redirect(`/restaurants/admin/${rest._id}`)
})

exports.editRestaurantForm = catchError(async(req , res) => { 
    const {rest_id} = req.params;
    const rest = await Restaurant.findById(rest_id);
    let temp = [rest.items , rest.avgPrice , rest.itemCount]
    res.render('update',{rest});
})

exports.updateRestaurantDetails = catchError(async(req , res) => { 
    await Restaurant.findByIdAndUpdate(req.params.rest_id , req.body.restaurant)
    const rest = await Restaurant.findById(req.params.rest_id)
    if((rest.restaurantAdminID != req.session.user._id))
       return next(new ErrorClass('You can only access your own restaurant',400))

    rest.cuisines = []

    if(req.body.restaurant.cus1 == "on")
        rest.cuisines.push('Indian')
    if(req.body.restaurant.cus2== "on")
        rest.cuisines.push('Pan-Asian')
    if(req.body.restaurant.cus3 == "on")
        rest.cuisines.push('Chinese')
    if(req.body.restaurant.cus4 == "on")
        rest.cuisines.push('Continental')
    if(req.body.restaurant.cus5 == "on")
        rest.cuisines.push('Japanese')
    if(req.body.restaurant.cus6 == "on")
        rest.cuisines.push('Korean')

    rest.items = temp[0]
    rest.avgPrice = temp[1]
    rest.itemCount = temp[2]
    rest.save()
   // req.flash('success' , 'Successfully Updated ')
    return res.redirect(`/restaurants/admin/${rest._id}`)
})

exports.removeItem = catchError(async(req , res) => { 
    const rest_id = req.params.rest_id
    const item_id = req.params.item_id
    const rest = await Restaurant.findById(rest_id)
    if(rest.restaurantAdminID != req.session.user._id)
       return next(new ErrorClass('You can only access your own restaurant',400))

    for(let i of rest.items){
        if(JSON.stringify(i._id) == JSON.stringify(item_id)){
            i.remove()
            rest.itemCount -= 1
        }
    }

    if(rest.itemCount != 0){
        let avgP = 0
        for(let i of rest.items)
            avgP += i.price
        rest.avgPrice = (avgP/rest.itemCount)
    }
    else
        rest.avgPrice = 0

    rest.save()
    //req.flash('success' , 'Successfully Deleted')
    return res.redirect(`/restaurants/admin/${rest._id}`)
})

exports.removeRestaurant = catchError(async(req , res , next) => {
    const rest = await Restaurant.findById(req.params.rest_id)
    if((rest.restaurantAdminID != req.session.user._id))
       return next(new ErrorClass('You can only delete your own restaurant',400))
    await Restaurant.findByIdAndDelete(req.params.rest_id)
    res.redirect(`/user/restaurantAdminHome`)
})

exports.getTotalRevenue = catchError(async(req , res , next) => {
    console.log('hi')
    const rest = await Restaurant.findById(req.params.rest_id)
     if((rest.restaurantAdminID != req.session.user._id))
        return next(new ErrorClass('You can only view your own restaurant',400))
    const rev = rest.totalRevenue
    res.json(rev)
   // res.send(rest.totalRevenue)
})