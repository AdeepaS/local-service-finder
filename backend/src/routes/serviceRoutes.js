const express = require('express')
const {
  getAllServices,
  createService,
} = require('../controllers/serviceController')

const router = express.Router()

router.get('/', getAllServices)
router.post('/', createService)

module.exports = router