const DietTarget = require('../models/DietTarget')
const { generateAndSaveMealPlan } = require('../utils/mealPlanGenerator')

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.465,
  active: 1.55,
  very_active: 1.725
}

const normalizeGoal = (goal) => {
  if (!goal) return 'maintain'

  const value = Array.isArray(goal)
    ? goal.join(' ').toLowerCase()
    : String(goal).toLowerCase()

  if (
    value.includes('fat') ||
    value.includes('loss') ||
    value.includes('weight loss') ||
    value.includes('strength & fat loss')
  ) {
    return 'fat_loss'
  }

  if (
    value.includes('gain') ||
    value.includes('muscle') ||
    value.includes('bulk')
  ) {
    return 'muscle_gain'
  }

  return 'maintain'
}
const normalizeGender = (gender) => {
  const value = String(gender || '').toLowerCase()

  if (value.includes('female')) return 'female'
  if (value.includes('male')) return 'male'

  return 'female'
}

const getUserProfileNumbers = (user) => {
  const age = Number(user.age || 25)
  const height = Number(user.height || user.heightCm || 165)
  const weight = Number(user.weight || user.weightKg || 60)
  const gender = normalizeGender(user.gender)

  const activityLevel =
    user.activityLevel ||
    user.activity ||
    'moderate'

  const rawGoal =
  user.goal ||
  user.fitnessGoal ||
  user.fitnessGoals ||
  user.weightGoal ||
  'maintain'

const goal = Array.isArray(rawGoal)
  ? rawGoal.join(' ')
  : rawGoal

  return {
    age,
    height,
    weight,
    gender,
    activityLevel,
    goal: normalizeGoal(goal)
  }
}

const calculateBMR = ({ age, height, weight, gender }) => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }

  return 10 * weight + 6.25 * height - 5 * age - 161
}

const calculateTargetFromProfile = (user, day, selectedOption = null) => {
  const profile = getUserProfileNumbers(user)

  console.log('DIET PROFILE USED:', profile)

  const bmr = calculateBMR(profile)

  const multiplier =
    activityMultipliers[profile.activityLevel] ||
    activityMultipliers.moderate

  const maintenanceCalories = Math.round(bmr * multiplier)

  let targetCalories = maintenanceCalories
  let expectedRate = 'Maintain weight'
  let healthNote = 'Target is based on your profile.'
  let goal = profile.goal
  let goalIntensity = selectedOption || 'auto'

  if (selectedOption === 'maintain') {
    goal = 'maintain'
    targetCalories = maintenanceCalories
    expectedRate = 'Maintain weight'
    healthNote = 'This target is estimated to maintain your current weight.'
  }

  else if (selectedOption === 'mild_fat_loss') {
    goal = 'fat_loss'
    targetCalories = maintenanceCalories - 250
    expectedRate = 'Mild fat loss · around 0.25 kg/week'
    healthNote = 'A mild calorie deficit is used for gradual fat loss.'
  }

  else if (selectedOption === 'fat_loss') {
    goal = 'fat_loss'
    targetCalories = maintenanceCalories - 500
    expectedRate = 'Fat loss· 0.5 kg/week'
    healthNote = 'A moderate calorie deficit is used for safer fat loss.'
  }

  else if (selectedOption === 'muscle_gain') {
    goal = 'muscle_gain'
    targetCalories = maintenanceCalories + 250
    expectedRate = 'Muscle gain'
    healthNote = 'A small calorie surplus is used for muscle gain.'
  }

  else {
    if (profile.goal === 'fat_loss') {
      targetCalories = maintenanceCalories - 500
      expectedRate = 'Fat loss· 0.5 kg/week'
      healthNote = 'A moderate calorie deficit is used for safer fat loss.'
      goalIntensity = 'fat_loss'
    }

    if (profile.goal === 'muscle_gain') {
      targetCalories = maintenanceCalories + 250
      expectedRate = 'Muscle gain'
      healthNote = 'A small calorie surplus is used for muscle gain.'
      goalIntensity = 'muscle_gain'
    }

    if (profile.goal === 'maintain') {
      targetCalories = maintenanceCalories
      expectedRate = 'Maintain weight'
      goalIntensity = 'maintain'
    }
  }

  const hardMinimum = 1200
  const maxSafeDeficit = 750

  const minAllowedCalories = Math.max(
    hardMinimum,
    maintenanceCalories - maxSafeDeficit
  )

  if (targetCalories < minAllowedCalories) {
    targetCalories = minAllowedCalories
    healthNote =
      'Target was adjusted because the calculated deficit was too low for a normal fitness plan.'
  }

  const proteinMultiplier =
    goal === 'maintain' ? 1.2 : 1.6

  const protein = Math.round(profile.weight * proteinMultiplier)

  const water = Math.max(2, profile.weight * 0.035).toFixed(1)

  return {
    day,
    goal,
    goalIntensity,
    calories: String(targetCalories),
    protein: `${protein}g`,
    water: `${water}L`,
    meals: '4',
    maintenanceCalories,
    minAllowedCalories,
    expectedRate,
    healthNote,
    isCustom: false
  }
}

const createDefaultWeeklyTargets = (user) => {
  return [0, 1, 2, 3, 4, 5, 6].map((day) =>
    calculateTargetFromProfile(user, day)
  )
}

const getDietTargets = async (req, res) => {
  try {
    console.log('GET DIET TARGET ROUTE HIT')
    console.log('USER FROM TOKEN:', req.user)
    let dietTarget = await DietTarget.findOne({
      user: req.user._id
    })

    if (!dietTarget) {
      dietTarget = await DietTarget.create({
        user: req.user._id,
        weeklyTargets: createDefaultWeeklyTargets(req.user)
      })
    }

    res.json(dietTarget)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch diet targets'
    })
  }
}

const updateTodayDietTarget = async (req, res) => {
  try {
    const { day, calories, protein, water, meals } = req.body

    if (
      day === undefined ||
      !calories ||
      !protein ||
      !water ||
      !meals
    ) {
      return res.status(400).json({
        message: 'All target fields are required'
      })
    }

    const numericCalories = Number(calories)

    if (Number.isNaN(numericCalories)) {
      return res.status(400).json({
        message: 'Calories must be a number'
      })
    }

    let dietTarget = await DietTarget.findOne({
      user: req.user._id
    })

    if (!dietTarget) {
      dietTarget = await DietTarget.create({
        user: req.user._id,
        weeklyTargets: createDefaultWeeklyTargets(req.user)
      })
    }

    const calculatedTarget = calculateTargetFromProfile(
      req.user,
      Number(day)
    )

    if (numericCalories < calculatedTarget.minAllowedCalories) {
      return res.status(400).json({
        message: `This calorie target is too low for your profile. Minimum safe target is ${calculatedTarget.minAllowedCalories} kcal/day.`
      })
    }

    const targetIndex = dietTarget.weeklyTargets.findIndex(
      (target) => target.day === Number(day)
    )

    const updatedTarget = {
      day: Number(day),
      goal: calculatedTarget.goal,
      calories: String(numericCalories),
      protein,
      water,
      meals,
      maintenanceCalories: calculatedTarget.maintenanceCalories,
      minAllowedCalories: calculatedTarget.minAllowedCalories,
      expectedRate:
        numericCalories < calculatedTarget.maintenanceCalories
          ? 'Custom fat loss target'
          : numericCalories > calculatedTarget.maintenanceCalories
            ? 'Custom muscle gain target'
            : 'Maintain weight',
      healthNote:
        'Custom target saved after safety validation.',
      isCustom: true
    }

    if (targetIndex === -1) {
      dietTarget.weeklyTargets.push(updatedTarget)
    } else {
      dietTarget.weeklyTargets[targetIndex] = updatedTarget
    }

    await dietTarget.save()

const mealPlan = await generateAndSaveMealPlan(
  req.user._id,
  Number(day),
  updatedTarget
)

res.json({
  message: 'Diet target updated successfully',
  dietTarget,
  mealPlan
})
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update diet target'
    })
  }
}

const regenerateDietTargets = async (req, res) => {
  try {
    console.log('REGENERATE ROUTE HIT')
    console.log('USER GOAL:', req.user.fitnessGoal)

    const weeklyTargets = createDefaultWeeklyTargets(req.user)

    console.log('NEW WEEKLY TARGETS:', weeklyTargets)

    let dietTarget = await DietTarget.findOne({
      user: req.user._id
    })

    if (!dietTarget) {
      dietTarget = await DietTarget.create({
        user: req.user._id,
        weeklyTargets
      })
    } else {
      dietTarget.weeklyTargets = weeklyTargets
      await dietTarget.save()
    }

    const todayIndex = new Date().getDay()

const todaysTarget =
  weeklyTargets.find((target) => target.day === todayIndex) ||
  weeklyTargets[0]

const mealPlan = await generateAndSaveMealPlan(
  req.user._id,
  todayIndex,
  todaysTarget
)

res.json({
  message: 'Diet targets regenerated from profile',
  dietTarget,
  mealPlan
})
  } catch (error) {
    console.log('REGENERATE ERROR:', error)

    res.status(500).json({
      message: error.message || 'Failed to regenerate diet targets'
    })
  }
}
const updateTargetByGoalOption = async (req, res) => {
  try {
    const { day, option } = req.body

    if (day === undefined || !option) {
      return res.status(400).json({
        message: 'Day and goal option are required'
      })
    }

    const allowedOptions = [
      'maintain',
      'mild_fat_loss',
      'fat_loss',
      'muscle_gain'
    ]

    if (!allowedOptions.includes(option)) {
      return res.status(400).json({
        message: 'Invalid goal option'
      })
    }

    let dietTarget = await DietTarget.findOne({
      user: req.user._id
    })

    if (!dietTarget) {
      dietTarget = await DietTarget.create({
        user: req.user._id,
        weeklyTargets: createDefaultWeeklyTargets(req.user)
      })
    }

    const updatedTarget = calculateTargetFromProfile(
      req.user,
      Number(day),
      option
    )

    const targetIndex = dietTarget.weeklyTargets.findIndex(
      (target) => target.day === Number(day)
    )

    if (targetIndex === -1) {
      dietTarget.weeklyTargets.push(updatedTarget)
    } else {
      dietTarget.weeklyTargets[targetIndex] = updatedTarget
    }

    await dietTarget.save()

const mealPlan = await generateAndSaveMealPlan(
  req.user._id,
  Number(day),
  updatedTarget
)

res.json({
  message: 'Goal option saved successfully',
  dietTarget,
  selectedTarget: updatedTarget,
  mealPlan
})
  } catch (error) {
    console.log('GOAL OPTION ERROR:', error)

    res.status(500).json({
      message: error.message || 'Failed to save goal option'
    })
  }
}

module.exports = {
  getDietTargets,
  updateTodayDietTarget,
  regenerateDietTargets,
  updateTargetByGoalOption
}