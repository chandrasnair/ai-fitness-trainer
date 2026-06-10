const express = require('express')

const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  downloadMyData,
  deleteMyAccount
} = require('../controllers/userController')
const {
  protect
} = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/profile', protect, getUserProfile)

router.put('/profile', protect, updateUserProfile)
router.put('/change-password', protect, changePassword)
router.get('/download-data', protect, downloadMyData)
router.delete('/delete-account', protect, deleteMyAccount)

module.exports = router