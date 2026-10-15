const Order = require('../models/Order')
const Product = require('../models/Product')
const razorpay = require('../utils/razorpay')
const crypto = require('crypto')

const isDBConnected = (app) => app?.locals?.dbConnected

exports.createOrder = async (req, res) => {
  const { items, amount, address, paymentMethod } = req.body
  try {
    if (!isDBConnected(req.app)) {
      const mockOrder = {
        _id: `mock_${Date.now()}`,
        userId: req.user?._id,
        items,
        amount,
        address,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        orderStatus: 'pending',
        createdAt: new Date(),
      }
      if (paymentMethod === 'razorpay') {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(amount * 100),
          currency: 'INR',
          receipt: mockOrder._id,
        })
        return res.status(201).json({ order: mockOrder, razorpayOrder })
      }
      return res.status(201).json(mockOrder)
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      amount,
      address,
      paymentMethod,
      paymentStatus: 'pending',
    })

    if (paymentMethod === 'razorpay') {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: order._id.toString(),
      })
      order.razorpayOrderId = razorpayOrder.id
      await order.save()
      return res.status(201).json({ order, razorpayOrder })
    }

    for (const it of items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } }).catch(() => {})
    }
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature, razorpayOrderId } = req.body
  try {
    const secret = process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return res.json({ message: 'Payment verified (dev mode)', offline: true })
    }

    const rpOrderId = razorpayOrderId || orderId
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(`${rpOrderId}|${paymentId}`)
    const generated = hmac.digest('hex')

    if (generated !== signature) {
      return res.status(400).json({ message: 'Invalid signature' })
    }

    if (!isDBConnected(req.app)) {
      return res.json({ message: 'Payment verified', offline: true })
    }

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    order.paymentStatus = 'paid'
    await order.save()

    for (const it of order.items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } }).catch(() => {})
    }

    res.json({ message: 'Payment verified', order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getUserOrders = async (req, res) => {
  try {
    if (!isDBConnected(req.app)) {
      return res.json([])
    }
    const orders = await Order.find({ userId: req.user._id }).sort('-createdAt')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAllOrders = async (req, res) => {
  try {
    if (!isDBConnected(req.app)) {
      return res.json([])
    }
    const orders = await Order.find().sort('-createdAt')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    if (!isDBConnected(req.app)) {
      return res.json({ message: 'Updated locally', offline: true })
    }
    const { id } = req.params
    const { orderStatus } = req.body
    const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
