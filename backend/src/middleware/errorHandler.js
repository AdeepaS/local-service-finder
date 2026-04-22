const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found' })
}

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal server error'

  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  })
}

module.exports = {
  notFoundHandler,
  errorHandler,
}
