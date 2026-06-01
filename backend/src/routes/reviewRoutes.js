const express = require('express')
const {
  createReview,
  getReviewsByService,
} = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createReview)
router.get('/:serviceId', getReviewsByService)

module.exports = router