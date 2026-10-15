const express = require('express')
const router = express.Router()
const wishlist = require('../controllers/wishlistController')
const { protect } = require('../middleware/auth')
const asyncHandler = require('../middleware/asyncHandler')

router.get('/', protect, asyncHandler(wishlist.getWishlist))
router.post('/add', protect, asyncHandler(wishlist.addToWishlist))
router.delete('/remove/:productId', protect, asyncHandler(wishlist.removeFromWishlist))

module.exports = router
