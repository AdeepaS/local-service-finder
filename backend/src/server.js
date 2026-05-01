const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const app = require('./app')
const connectDb = require('./config/db')

const PORT = process.env.PORT

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
