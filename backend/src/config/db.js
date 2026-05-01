const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI)

    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    throw error
  }
}

module.exports = connectDb
