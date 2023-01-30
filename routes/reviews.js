const express = require('express');
const { addReview, deleteReview } = require('../controllers/reviewController');
const { clientIsLoggedIn } = require('../middleware/validatePermissions')

const router = express.Router()

router.route('/:id').post(clientIsLoggedIn,addReview)

router.delete('/:rest_id/:review_id').delete(deleteReview)

module.exports = router