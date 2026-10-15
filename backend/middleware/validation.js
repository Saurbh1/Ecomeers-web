const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validatePassword = (pwd) => pwd && pwd.length >= 6

const validationMiddleware = {
  registerValidate: (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || name.length < 2) return res.status(400).json({ message: 'Invalid name' })
    if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email' })
    if (!validatePassword(password)) return res.status(400).json({ message: 'Password must be 6+ chars' })
    next()
  },

  loginValidate: (req, res, next) => {
    const { email, password } = req.body
    if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email' })
    if (!password) return res.status(400).json({ message: 'Password required' })
    next()
  },

  productValidate: (req, res, next) => {
    const { title, price, category } = req.body
    if (!title || title.length < 3) return res.status(400).json({ message: 'Title required' })
    if (typeof price !== 'number' || price <= 0) return res.status(400).json({ message: 'Valid price required' })
    next()
  },

  orderValidate: (req, res, next) => {
    const { items, amount, address } = req.body
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Items required' })
    if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ message: 'Valid amount required' })
    if (!address || !address.street || !address.city) return res.status(400).json({ message: 'Valid address required' })
    next()
  }
}

module.exports = validationMiddleware
