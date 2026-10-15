const Razorpay = require('razorpay')

// Defensive Razorpay wrapper. If keys are missing, provide a mock implementation.
const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET

if (keyId && keySecret) {
  module.exports = new Razorpay({ key_id: keyId, key_secret: keySecret })
} else {
  // Mock object to keep order flows functional in development without real Razorpay
  module.exports = {
    orders: {
      create: async ({ amount, currency, receipt }) => {
        return { id: `mock_order_${Date.now()}`, amount, currency, receipt }
      }
    }
  }
}