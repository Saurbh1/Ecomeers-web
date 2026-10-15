const express = require('express')
const router = express.Router()
const { register, login, logout, profile, updateProfile, getAllUsers, toggleBlockUser } = require('../controllers/authController')
const { protect, admin } = require('../middleware/auth')
const validation = require('../middleware/validation')
const asyncHandler = require('../middleware/asyncHandler')

router.post('/register', validation.registerValidate, asyncHandler(register))
router.post('/login', validation.loginValidate, asyncHandler(login))
router.post('/logout', logout)
router.get('/profile', protect, asyncHandler(profile))
router.put('/profile', protect, asyncHandler(updateProfile))

router.get('/users', protect, admin, asyncHandler(getAllUsers))
router.put('/users/:id/block', protect, admin, asyncHandler(toggleBlockUser))

module.exports = router
