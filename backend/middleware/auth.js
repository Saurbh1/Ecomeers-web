const jwt = require('jsonwebtoken')
const User = require('../models/User')
const logger = require('../utils/logger')

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production')
  }
  return secret || 'dev_only_change_in_production'
}

const protect = async (req, res, next) => {
  let token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : null)

  if (!token) return res.status(401).json({ message: 'Not authorized' })

  try {
    const decoded = jwt.verify(token, getJwtSecret())
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'Not authorized' })
    if (req.user.isBlocked) return res.status(403).json({ message: 'Your account has been blocked' })
    next()
  } catch (error) {
    logger.debug('Auth token invalid', { error: error.message })
    return res.status(401).json({ message: 'Token invalid or expired' })
  }
}

const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next()
  return res.status(403).json({ message: 'Require admin role' })
}

module.exports = { protect, admin, getJwtSecret }
