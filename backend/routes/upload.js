const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { uploadImage } = require('../controllers/uploadController')
const { protect, admin } = require('../middleware/auth')
const asyncHandler = require('../middleware/asyncHandler')

const fs = require('fs')
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

router.post('/', protect, admin, upload.array('images', 6), asyncHandler(uploadImage))

module.exports = router
