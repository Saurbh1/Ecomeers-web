const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { path: req.path, stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined })

  let statusCode = res.statusCode === 200
    ? 500
    : res.statusCode

  let message = err.message

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {

    statusCode = 404
    message = 'Resource not found'

  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {

    statusCode = 400
    message = 'Duplicate field value entered'

  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {

    statusCode = 400
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ')

  }

  res.status(statusCode).json({
    success: false,
    message,
    stack:
      process.env.NODE_ENV === 'production'
        ? null
        : err.stack,
  })

}

module.exports = errorHandler