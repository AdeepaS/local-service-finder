const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI

const connectDb = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not set in environment variables')
  }

  try {
    await mongoose.connect(MONGO_URI)

    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    throw error
  }
}

module.exports = connectDb
