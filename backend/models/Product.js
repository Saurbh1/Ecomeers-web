const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  subCategory: { type: String },
  images: { type: [String], default: [] },
  stock: { type: Number, default: 0 },
  sizes: { type: [String], default: [] },
  ratings: { type: Number, default: 0 },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true })

module.exports = mongoose.model('Product', ProductSchema)
