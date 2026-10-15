const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const { sanitizeInput } = require('./sanitize')

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 20,
  message: { message: 'Too many auth attempts, please try again later.' },
})

const applySecurity = (app) => {
  app.set('trust proxy', 1)

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  )

  app.use(hpp())
  app.use(cookieParser())
  app.use(mongoSanitize())
  app.use(sanitizeInput)
  app.use('/api/auth', authLimiter)
  app.use('/api', generalLimiter)
}

module.exports = { applySecurity, authLimiter, generalLimiter }
