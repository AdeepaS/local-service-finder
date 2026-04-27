require('dotenv').config()
const app = require('./app')
const connectDb = require('./config/db')

const PORT = process.env.PORT

if (!PORT) {
  console.error('PORT is not set in environment variables')
  process.exit(1)
}

const startServer = async () => {
  try {
    await connectDb()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
