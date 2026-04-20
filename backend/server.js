const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const testRoutes = require('./routes/testRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Core middleware
app.use(cors())
app.use(express.json())

// API routes
app.use('/api', testRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
