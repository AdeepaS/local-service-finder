const express = require('express')
const {
  getAllServices,
  createService,
  seedServices,
} = require('../controllers/serviceController')

const router = express.Router()

router.get('/', getAllServices)
router.post('/', createService)

// Temporary route for local setup only.
router.post('/seed', seedServices)

module.exports = router