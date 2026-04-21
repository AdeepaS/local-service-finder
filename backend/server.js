const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const testRoutes = require('./routes/testRoutes')
const serviceRoutes = require('./routes/serviceRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/local-service-finder'

// Core middleware
app.use(cors())
app.use(express.json())

// API routes
app.use('/api', testRoutes)
app.use('/api/services', serviceRoutes)

const startServer = async () => {
  try {
    // Connect once at startup so controllers can use models immediately.
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
}

startServer()
