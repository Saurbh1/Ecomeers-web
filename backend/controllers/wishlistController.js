const User = require('../models/User')

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist')
    res.json(user.wishlist || [])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    if (!productId) return res.status(400).json({ message: 'Product ID required' })
    
    const user = await User.findById(req.user._id)
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId)
      await user.save()
    }
    const updatedUser = await User.findById(req.user._id).populate('wishlist')
    res.json(updatedUser.wishlist)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params
    const user = await User.findById(req.user._id)
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId)
    await user.save()
    
    const updatedUser = await User.findById(req.user._id).populate('wishlist')
    res.json(updatedUser.wishlist)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
