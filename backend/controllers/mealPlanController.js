const DietTarget = require('../models/DietTarget')
const DailyMealPlan = require('../models/DailyMealPlan')
const { generateAndSaveMealPlan } = require('../utils/mealPlanGenerator')

const getTodayMealPlan = async (req, res) => {
  try {
    const todayIndex = new Date().getDay()

    const dietTarget = await DietTarget.findOne({
      user: req.user._id
    })

    if (!dietTarget) {
      return res.status(404).json({
        message: 'Diet target not found'
      })
    }

    const todaysTarget =
      dietTarget.weeklyTargets.find(
        (target) => target.day === todayIndex
      ) || dietTarget.weeklyTargets[0]

    let mealPlan = await DailyMealPlan.findOne({
      user: req.user._id,
      day: todayIndex
    })

    if (!mealPlan) {
      mealPlan = await generateAndSaveMealPlan(
        req.user._id,
        todayIndex,
        todaysTarget
      )
    }

    res.json({
      mealPlan
    })
  } catch (error) {
    console.log('GET TODAY MEAL PLAN ERROR:', error)

    res.status(500).json({
      message: error.message || 'Failed to fetch today meal plan'
    })
  }
}

const regenerateTodayMealPlan = async (req, res) => {
  try {
    const todayIndex = new Date().getDay()

    const dietTarget = await DietTarget.findOne({
      user: req.user._id
    })

    if (!dietTarget) {
      return res.status(404).json({
        message: 'Diet target not found'
      })
    }

    const todaysTarget =
      dietTarget.weeklyTargets.find(
        (target) => target.day === todayIndex
      ) || dietTarget.weeklyTargets[0]

    const mealPlan = await generateAndSaveMealPlan(
      req.user._id,
      todayIndex,
      todaysTarget
    )

    res.json({
      message: 'Today meal plan regenerated',
      mealPlan
    })
  } catch (error) {
    console.log('REGENERATE MEAL PLAN ERROR:', error)

    res.status(500).json({
      message: error.message || 'Failed to regenerate today meal plan'
    })
  }
}

module.exports = {
  getTodayMealPlan,
  regenerateTodayMealPlan
}