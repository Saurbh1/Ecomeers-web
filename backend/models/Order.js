const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number, price: Number }],
  amount: { type: Number, required: true },
  address: { type: Object },
  paymentMethod: { type: String },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending','shipped','delivered','cancelled'], default: 'pending' },
  razorpayOrderId: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema)
