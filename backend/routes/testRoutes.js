const express = require('express')

const router = express.Router()

// Health check route for initial backend setup
router.get('/test', (req, res) => {
  res.send('API is running')
})

module.exports = router
