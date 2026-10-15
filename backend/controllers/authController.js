const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getJwtSecret } = require('../middleware/auth')
const { setAuthCookie, clearAuthCookie } = require('../utils/authCookie')
const logger = require('../utils/logger')

const generateToken = (id) => jwt.sign({ id }, getJwtSecret(), { expiresIn: '7d' })

const sendAuthResponse = (res, user, token) => {
  setAuthCookie(res, token)
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  })
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'User already exists' })
    
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)
    const user = await User.create({ name, email, password: hashed })
    
    sendAuthResponse(res, user, generateToken(user._id))
  } catch (err) {
    logger.error('Register failed', { error: err.message })
    res.status(500).json({ message: err.message })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    if (user.isBlocked) return res.status(403).json({ message: 'Your account has been blocked' })
    
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })
    
    sendAuthResponse(res, user, generateToken(user._id))
  } catch (err) {
    logger.error('Login failed', { error: err.message })
    res.status(500).json({ message: err.message })
  }
}

exports.logout = async (req, res) => {
  clearAuthCookie(res)
  res.json({ message: 'Logged out' })
}

exports.profile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' })
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' })
    const { name, address } = req.body
    const user = await User.findById(req.user._id)
    if (name) user.name = name
    if (address) user.address = address
    await user.save()
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, address: user.address })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot block admin users' })
    
    user.isBlocked = !user.isBlocked
    await user.save()
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
