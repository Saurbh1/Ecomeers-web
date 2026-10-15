const express = require('express')
const router = express.Router()
const cart = require('../controllers/cartController')
const { protect } = require('../middleware/auth')
const asyncHandler = require('../middleware/asyncHandler')

router.get('/', protect, asyncHandler(cart.getCart))
router.post('/add', protect, asyncHandler(cart.addToCart))
router.delete('/remove/:productId', protect, asyncHandler(cart.removeFromCart))
router.delete('/clear', protect, asyncHandler(cart.clearCart))

module.exports = router
