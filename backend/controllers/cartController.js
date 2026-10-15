const User = require('../models/User')

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json(user.cartData || [])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body
    const user = await User.findById(req.user._id)
    const idx = user.cartData.findIndex(i => i.product.toString() === productId)
    if (idx > -1) {
      user.cartData[idx].quantity += quantity
    } else {
      user.cartData.push({ product: productId, quantity })
    }
    await user.save()
    res.json(user.cartData)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params
    const user = await User.findById(req.user._id)
    user.cartData = user.cartData.filter(i => i.product.toString() !== productId)
    await user.save()
    res.json(user.cartData)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.cartData = []
    await user.save()
    res.json({ message: 'Cart cleared', cart: [] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
