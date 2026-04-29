const express = require('express')
const {
  getServices,
  getServiceById,
  createService,
} = require('../controllers/serviceController')

const router = express.Router()

router.get('/:id', getServiceById)
router.get('/', getServices)
router.post('/', createService)

module.exports = router