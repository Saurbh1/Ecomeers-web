const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

const { connectDB, state: dbState } = require('./config/db')
const { applySecurity } = require('./middleware/security')
const logger = require('./utils/logger')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/orders')
const uploadRoutes = require('./routes/upload')
const wishlistRoutes = require('./routes/wishlist')
const errorHandler = require('./middleware/errorHandler')

dotenv.config()

const app = express()

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
const allowedOrigins = [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      if (process.env.NODE_ENV !== 'production') return callback(null, true)
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

applySecurity(app)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

;(async () => {
  await connectDB().catch((err) => logger.warn('MongoDB connect failed', { error: err.message }))
  app.locals.dbConnected = dbState.connected
  if (!dbState.connected) logger.warn('Running in FALLBACK/MOCK mode')
})()

app.use((req, res, next) => {
  req.app.locals.dbConnected = dbState.connected
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/wishlist', wishlistRoutes)

app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Running', fallback: !dbState.connected })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: dbState.connected,
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { fallback: !dbState.connected })
})

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', { error: err.message })
})

module.exports = { app, server }
