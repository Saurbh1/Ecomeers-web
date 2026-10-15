const Product = require('../models/Product')
const { mockProducts } = require('../data/mockData')
const { ensureProducts, ensureProductImages, normalizeCategory } = require('../utils/productImages')

// Helper to check if MongoDB is connected
const isDBConnected = (app) => {
  return app && app.locals && app.locals.dbConnected
}

exports.getProducts = async (req, res) => {
  const { page = 1, limit = 12, category, q, sort } = req.query

  try {
    // Try database first if connected
    if (isDBConnected(req.app)) {
      const query = {}
      if (category) query.category = normalizeCategory(category)
      if (q) query.title = { $regex: q, $options: 'i' }
      const skip = (page - 1) * limit
      const products = await Product.find(query).skip(skip).limit(Number(limit)).sort(sort || '-createdAt')
      const total = await Product.countDocuments(query)
      return res.json({ products: ensureProducts(products.map((p) => p.toObject?.() || p)), total })
    }
    
    throw new Error('MongoDB not connected, using fallback')
  } catch (err) {
    // Fallback to mock data
    console.log('Using fallback mock products')
    let filtered = [...mockProducts]
    
    if (category) {
      const target = normalizeCategory(category)
      filtered = filtered.filter((p) => normalizeCategory(p.category) === target)
    }
    
    if (q) {
      const query = q.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    }
    
    if (sort === '-price') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sort === 'price') {
      filtered.sort((a, b) => a.price - b.price)
    } else {
      filtered.reverse()
    }
    
    const skip = (page - 1) * limit
    const products = filtered.slice(skip, skip + limit)
    const total = filtered.length
    
    return res.json({ products: ensureProducts(products), total })
  }
}

exports.getProductById = async (req, res) => {
  try {
    // Try database first if connected
    if (isDBConnected(req.app)) {
      const product = await Product.findById(req.params.id)
      if (product) return res.json(ensureProductImages(product.toObject?.() || product))
    }
    
    throw new Error('Product not found in database')
  } catch (err) {
    // Fallback to mock data
    const product = mockProducts.find(p => p._id === req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(ensureProductImages(product))
  }
}

exports.createProduct = async (req, res) => {
  try {
    if (!isDBConnected(req.app)) {
      return res.status(503).json({ message: 'Database unavailable. Cannot create product in fallback mode.' })
    }
    const data = req.body
    const product = await Product.create(data)
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    if (!isDBConnected(req.app)) {
      return res.status(503).json({ message: 'Database unavailable. Cannot update product in fallback mode.' })
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    if (!isDBConnected(req.app)) {
      return res.status(503).json({ message: 'Database unavailable. Cannot delete product in fallback mode.' })
    }
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.createReview = async (req, res) => {
  try {
    if (!isDBConnected(req.app)) {
      return res.status(503).json({ message: 'Cannot add review in fallback mode' })
    }
    const { rating, comment } = req.body
    if (!rating || !comment) return res.status(400).json({ message: 'Rating and comment required' })
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' })
    }

    const review = {
      userId: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    }

    product.reviews.push(review)
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added', product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteReview = async (req, res) => {
  try {
    if (!isDBConnected(req.app)) {
      return res.status(503).json({ message: 'Cannot delete review in fallback mode' })
    }
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const reviewIdx = product.reviews.findIndex(
      (r) => r._id.toString() === req.params.reviewId
    )

    if (reviewIdx === -1) {
      return res.status(404).json({ message: 'Review not found' })
    }

    const review = product.reviews[reviewIdx]
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    product.reviews.splice(reviewIdx, 1)
    product.ratings =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length
        : 0

    await product.save()
    res.json({ message: 'Review deleted', product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
