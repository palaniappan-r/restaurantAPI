const express = require('express');
const { addReview, deleteReview } = require('../controllers/reviewController');
const { clientIsLoggedIn,restaurantAdminIsLoggedIn } = require('../middleware/validatePermissions')

const router = express.Router()

router.route('/:id').post(clientIsLoggedIn,addReview)

router.route('/:rest_id/:review_id').delete(restaurantAdminIsLoggedIn,deleteReview)

module.exports = router