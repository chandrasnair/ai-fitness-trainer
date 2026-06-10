const express = require('express')
const upload = require('../middleware/uploadMiddleware')

const router = express.Router()

router.post(
  '/profile',
  upload.single('profileImage'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      })
    }

    res.json({
      imagePath: `/uploads/${req.file.filename}`
    })
  }
)

module.exports = router