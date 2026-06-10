const express = require('express')

const {
  saveWorkoutHistory,
  syncLatestWorkoutHistory,
  getWorkoutHistory,
  getRecentActivity,
  getWorkoutStats,
  getProgressSummary
} = require('../controllers/historyController')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, saveWorkoutHistory)

router.post('/sync-latest', protect, syncLatestWorkoutHistory)

router.get('/', protect, getWorkoutHistory)

router.get('/recent', protect, getRecentActivity)

router.get('/stats', protect, getWorkoutStats)

router.get('/progress-summary', protect, getProgressSummary)

module.exports = router