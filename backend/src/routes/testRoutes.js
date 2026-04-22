const express = require('express')
const { getHealth } = require('../controllers/testController')

const router = express.Router()

// Health check route for initial backend setup
router.get('/test', getHealth)

module.exports = router
