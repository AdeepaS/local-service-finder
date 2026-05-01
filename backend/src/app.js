const express = require('express')
const cors = require('cors')
const serviceRoutes = require('./routes/serviceRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/services', serviceRoutes)
app.use('/api/reviews', reviewRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app

