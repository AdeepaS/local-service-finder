const Service = require('../models/service')

// Get all services
const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 })
    res.status(200).json(services)
  } catch (error) {
    next(error)
  }
}

// Create a new service
const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json(service)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllServices,
  createService,
}