const mongoose = require('mongoose')

// Shared state object other modules can read
const state = { connected: false }

const connectDB = async (opts = {}) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: opts.timeout || 5000,
    })
    state.connected = true
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return state
  } catch (error) {
    state.connected = false
    console.error(`MongoDB connection failed: ${error.message}`)
    // Do not crash the process; allow server to run in fallback/mock mode
    return state
  }
}

module.exports = { connectDB, state }
