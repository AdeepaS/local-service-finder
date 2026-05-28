const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(helmet())
app.use(cors({
  origin: 'http://localhost:5173', // Update this based on frontend URL
  credentials: true, // Allow cookies to be sent
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/reviews', reviewRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app

