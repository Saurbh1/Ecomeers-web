const express = require('express')
const router = express.Router()
const order = require('../controllers/orderController')
const { protect, admin } = require('../middleware/auth')
const validation = require('../middleware/validation')
const asyncHandler = require('../middleware/asyncHandler')

router.post('/create', protect, validation.orderValidate, asyncHandler(order.createOrder))
router.post('/verify', asyncHandler(order.verifyPayment))
router.get('/user', protect, asyncHandler(order.getUserOrders))
router.get('/admin', protect, admin, asyncHandler(order.getAllOrders))
router.put('/:id', protect, admin, asyncHandler(order.updateOrderStatus))

module.exports = router
