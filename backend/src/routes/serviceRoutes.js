const express = require('express')
const {
  getAllServices,
  getServiceById,
  createService,
} = require('../controllers/serviceController')

const router = express.Router()

router.get('/:id', getServiceById)
router.get('/', getAllServices)
router.post('/', createService)

module.exports = router