const express = require('express')
const cors = require('cors')
const testRoutes = require('./routes/testRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', testRoutes)
app.use('/api/services', serviceRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
