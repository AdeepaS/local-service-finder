const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
}

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  let statusCode = error.statusCode || 500
  let message = error.message || 'Internal server error'

  if (error.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(', ')
  }

  if (error.name === 'CastError') {
    statusCode = 400
    message = `Invalid value for ${error.path}`
  }

  if (error.code === 11000) {
    statusCode = 409
    const field = Object.keys(error.keyPattern || {})[0] || 'field'
    message = `${field} already exists`
  }

  res.status(statusCode).json({
    success: false,
    message,
  })
}

module.exports = {
  notFoundHandler,
  errorHandler,
}
