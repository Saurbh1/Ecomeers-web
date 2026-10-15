const cloudinary = require('../utils/cloudinary')
const fs = require('fs')

const PLACEHOLDER = 'https://picsum.photos/seed/luxe-upload/600/800'

exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided' })
    }

    const uploads = []
    const useCloudinary = Boolean(
      process.env.CLOUDINARY_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_SECRET_KEY
    )

    for (const file of req.files) {
      try {
        if (useCloudinary) {
          const result = await cloudinary.uploader.upload(file.path, { folder: 'ecomm_products' })
          uploads.push(result.secure_url)
        } else {
          uploads.push(`${PLACEHOLDER}&sig=${Date.now()}_${Math.random().toString(36).slice(2)}`)
        }
      } catch {
        uploads.push(PLACEHOLDER)
      }
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
    }

    res.json({ urls: uploads })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
