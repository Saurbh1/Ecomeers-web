const express = require('express')
const router = express.Router()
const prod = require('../controllers/productController')
const { protect, admin } = require('../middleware/auth')
const validation = require('../middleware/validation')
const asyncHandler = require('../middleware/asyncHandler')

router.get('/', asyncHandler(prod.getProducts))
router.get('/:id', asyncHandler(prod.getProductById))
router.post('/', protect, admin, validation.productValidate, asyncHandler(prod.createProduct))
router.put('/:id', protect, admin, validation.productValidate, asyncHandler(prod.updateProduct))
router.delete('/:id', protect, admin, asyncHandler(prod.deleteProduct))

router.post('/:id/reviews', protect, asyncHandler(prod.createReview))
router.delete('/:id/reviews/:reviewId', protect, asyncHandler(prod.deleteReview))

module.exports = router
