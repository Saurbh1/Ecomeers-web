const cloudinary = require('cloudinary').v2

// Defensive cloudinary wrapper: if env variables are missing, provide a mock
const cfg = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
}

if (cfg.cloud_name && cfg.api_key && cfg.api_secret) {
  cloudinary.config(cfg)
  module.exports = cloudinary
} else {
  // Minimal mock to avoid throwing in upload flows when Cloudinary not configured
  module.exports = {
    uploader: {
      upload: async (filePath, options) => {
        return { secure_url: `file://${filePath}` }
      }
    }
  }
}
