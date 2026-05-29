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
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : /^http:\/\/localhost:\d+$/, // Allow all localhost ports in development
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

