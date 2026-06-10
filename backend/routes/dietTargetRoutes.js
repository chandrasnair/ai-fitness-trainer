const express = require('express')

const {
  getDietTargets,
  updateTodayDietTarget,
  regenerateDietTargets,
  updateTargetByGoalOption
} = require('../controllers/dietTargetController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, getDietTargets)
router.put('/today', protect, updateTodayDietTarget)

router.put('/goal-option', protect, updateTargetByGoalOption)
router.post('/regenerate', protect, regenerateDietTargets)

module.exports = router