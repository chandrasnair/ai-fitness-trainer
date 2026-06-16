const express = require('express')
const { askAICoach } = require('../controllers/aiCoachController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/ask', protect, askAICoach)

module.exports = router