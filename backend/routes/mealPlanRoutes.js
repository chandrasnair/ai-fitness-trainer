const express = require('express')

const {
  getTodayMealPlan,
  regenerateTodayMealPlan
} = require('../controllers/mealPlanController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/today', protect, getTodayMealPlan)
router.post('/today/regenerate', protect, regenerateTodayMealPlan)

module.exports = router