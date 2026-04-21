const Service = require('../models/Service')

// Return all services for the initial listing page.
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 })
    res.status(200).json(services)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services', error: error.message })
  }
}

// Create a single service document from request body.
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json(service)
  } catch (error) {
    res.status(400).json({ message: 'Failed to create service', error: error.message })
  }
}

// Temporary helper to seed sample records for local development.
const seedServices = async (req, res) => {
  try {
    const sampleServices = [
      {
        title: 'QuickFix Plumbing',
        category: 'Plumbing',
        description: 'Leak repair, pipe installation, and emergency plumbing support.',
        location: 'Downtown',
        priceRange: '$$',
      },
      {
        title: 'BrightSpark Electricians',
        category: 'Electrical',
        description: 'Home wiring, lighting upgrades, and electrical safety checks.',
        location: 'West End',
        priceRange: '$$$',
      },
      {
        title: 'FreshHome Cleaning',
        category: 'Cleaning',
        description: 'Regular home cleaning and deep-clean packages for apartments.',
        location: 'North Side',
        priceRange: '$$',
      },
    ]

    await Service.deleteMany({})
    const created = await Service.insertMany(sampleServices)

    res.status(201).json({ message: 'Sample services seeded', count: created.length })
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed services', error: error.message })
  }
}

module.exports = {
  getAllServices,
  createService,
  seedServices,
}