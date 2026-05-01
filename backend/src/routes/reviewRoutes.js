const express = require('express')
const {
  createReview,
  getReviewsByService,
} = require('../controllers/reviewController')

const router = express.Router()

router.post('/', createReview)
router.get('/:serviceId', getReviewsByService)

module.exports = router