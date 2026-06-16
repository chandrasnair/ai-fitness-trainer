const express = require('express')

const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  downloadMyData,
  deleteMyAccount,
  getUserCount
} = require('../controllers/userController')
const {
  protect,
  adminOnly
} = require('../middleware/authMiddleware')



const router = express.Router()
router.get('/count', protect, adminOnly, getUserCount)

router.get('/profile', protect, getUserProfile)

router.put('/profile', protect, updateUserProfile)
router.put('/change-password', protect, changePassword)
router.get('/download-data', protect, downloadMyData)
router.delete('/delete-account', protect, deleteMyAccount)

module.exports = router