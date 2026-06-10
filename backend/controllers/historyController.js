const fs = require('fs')
const path = require('path')

const WorkoutHistory = require('../models/WorkoutHistory')

const getWorkoutHistory = async (req, res) => {
  try {
    const history = await WorkoutHistory.find({
      user: req.user._id
    }).sort({ createdAt: -1 })

    res.json(history)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getRecentActivity = async (req, res) => {
  try {
    const recent = await WorkoutHistory.find({
      user: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(3)

    res.json(recent)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getWorkoutStats = async (req, res) => {
  try {
    const history = await WorkoutHistory.find({
      user: req.user._id
    })

    const totalWorkouts = history.length

    const totalReps = history.reduce((sum, item) => {
      return sum + Number(item.reps_completed || 0)
    }, 0)

    const totalCalories = history.reduce((sum, item) => {
      return sum + Number(item.calories_burned || 0)
    }, 0)

    const uniqueWorkoutDates = [
      ...new Set(
        history
          .map((item) => {
            const dateValue = item.date_time || item.createdAt
            return new Date(dateValue).toISOString().split('T')[0]
          })
          .filter(Boolean)
      )
    ].sort((a, b) => new Date(b) - new Date(a))

    let dayStreak = 0
    const today = new Date()

    for (let i = 0; i < uniqueWorkoutDates.length; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)

      const expectedDate = checkDate.toISOString().split('T')[0]

      if (uniqueWorkoutDates.includes(expectedDate)) {
        dayStreak++
      } else {
        break
      }
    }

    res.json({
      dayStreak,
      totalWorkouts,
      totalReps,
      totalCalories: Number(totalCalories.toFixed(2))
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}
const saveWorkoutHistory = async (req, res) => {
  try {
    const {
      exercise,
      reps_completed,
      calories_burned,
      duration,
      accuracy
    } = req.body

    if (!exercise) {
      return res.status(400).json({
        message: 'Exercise name is required'
      })
    }

    const workout = await WorkoutHistory.create({
      user: req.user._id,
      exercise,
      reps_completed,
      calories_burned,
      duration,
      accuracy,
      date_time: new Date().toISOString()
    })

    res.status(201).json({
      message: 'Workout history saved',
      workout
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const syncLatestWorkoutHistory = async (req, res) => {
  try {
    const historyPath = path.join(
      __dirname,
      '..',
      '..',
      'database',
      'workout_history.json'
    )

    if (!fs.existsSync(historyPath)) {
      return res.status(404).json({
        message: 'No workout history file found'
      })
    }

    const fileData = fs.readFileSync(historyPath, 'utf8')

    if (!fileData.trim()) {
      return res.status(404).json({
        message: 'Workout history file is empty'
      })
    }

    const history = JSON.parse(fileData)

    if (!history.length) {
      return res.status(404).json({
        message: 'No workout history found'
      })
    }

    const latest = history[history.length - 1]
    const alreadySynced = await WorkoutHistory.findOne({
  user: req.user._id,
  source_date_time: latest.date_time
})

if (alreadySynced) {
  return res.status(400).json({
    message: 'This workout result is already synced'
  })
}

    const workout = await WorkoutHistory.create({
      user: req.user._id,
      exercise: latest.exercise,
      reps_completed: latest.reps_completed,
      calories_burned: latest.calories_burned,
      duration: latest.duration || '',
      accuracy: latest.accuracy || 90,
      date_time: latest.date_time,
      source_date_time: latest.date_time
    })

    res.status(201).json({
      message: 'Latest workout synced to MongoDB',
      workout
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}
const calculateAiScore = (data) => {
  if (!data.totalWorkouts || data.totalWorkouts === 0) {
    return 0
  }

  let score = 50

  if (data.totalWorkouts >= 5) score += 10
  if (data.totalWorkouts >= 10) score += 10
  if (data.dayStreak >= 3) score += 10
  if (data.dayStreak >= 7) score += 10
  if (data.totalCalories >= 1000) score += 10

  return Math.min(score, 100)
}

const getProgressSummary = async (req, res) => {
  try {
    const history = await WorkoutHistory.find({
      user: req.user._id
    }).sort({ createdAt: -1 })

    const totalWorkouts = history.length

    const totalReps = history.reduce((sum, item) => {
      return sum + Number(item.reps_completed || 0)
    }, 0)

    const totalCaloriesRaw = history.reduce((sum, item) => {
      return sum + Number(item.calories_burned || 0)
    }, 0)

    const totalCalories = Number(totalCaloriesRaw.toFixed(2))

    const uniqueWorkoutDates = [
      ...new Set(
        history
          .map((item) => {
            const dateValue = item.date_time || item.createdAt
            return new Date(dateValue).toISOString().split('T')[0]
          })
          .filter(Boolean)
      )
    ].sort((a, b) => new Date(b) - new Date(a))

    let dayStreak = 0
    const today = new Date()

    for (let i = 0; i < uniqueWorkoutDates.length; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)

      const expectedDate = checkDate.toISOString().split('T')[0]

      if (uniqueWorkoutDates.includes(expectedDate)) {
        dayStreak++
      } else {
        break
      }
    }

    const aiScore = calculateAiScore({
      totalWorkouts,
      totalReps,
      totalCalories,
      dayStreak
    })

    const accuracyValues = history
      .map((item) => Number(item.accuracy || 0))
      .filter((value) => value > 0)

    const postureScore =
      accuracyValues.length > 0
        ? Math.round(
            accuracyValues.reduce((sum, value) => sum + value, 0) /
              accuracyValues.length
          )
        : aiScore

    const repsGoal =
      totalReps <= 50
        ? 100
        : Math.ceil(totalReps / 100) * 100

    const repsGoalPercent = Math.min(
      Math.round((totalReps / repsGoal) * 100),
      100
    )

    const bestReps =
      history.length > 0
        ? Math.max(...history.map((item) => Number(item.reps_completed || 0)))
        : 0

    const uniqueExerciseCount = new Set(
      history.map((item) => item.exercise).filter(Boolean)
    ).size

    const recentActivity = history.slice(0, 5)

    const graphData = [...history]
      .slice(0, 7)
      .reverse()
      .map((item) => ({
        exercise: item.exercise,
        reps_completed: Number(item.reps_completed || 0),
        calories_burned: Number(item.calories_burned || 0),
        date_time: item.date_time || item.createdAt
      }))

    const recommendations = [
      {
        title: 'Improve Consistency',
        text:
          totalWorkouts >= 5
            ? 'Maintain your current rhythm for better results.'
            : 'Maintain a regular workout streak for better results.',
        reason:
          totalWorkouts >= 5
            ? 'This is suggested because your workout count shows that you are already building a routine. Staying consistent helps maintain progress.'
            : 'This is suggested because your total workout sessions are still low. Regular sessions will improve your progress score and long-term fitness habit.',
        tone: 'olive',
        iconType: 'dumbbell'
      },
      {
        title: 'Focus on Form',
        text:
          aiScore >= 70
            ? 'Your form looks stable. Keep movements controlled.'
            : 'Perfect your form to prevent injuries and build strength.',
        reason:
          aiScore >= 70
            ? 'Your AI consistency score is stable, so the goal is to maintain controlled movement and avoid rushing reps.'
            : 'Your AI consistency score can improve. Controlled posture and slower reps help the AI detect better form and reduce workout mistakes.',
        tone: 'blue',
        iconType: 'shield'
      },
      {
        title: 'Build Workout Streak',
        text:
          dayStreak > 0
            ? `Current streak: ${dayStreak} day(s). Keep going.`
            : 'Keep your streak alive and stay disciplined.',
        reason:
          dayStreak > 0
            ? `This is suggested because you already have a ${dayStreak} day streak. Continuing it will improve consistency.`
            : 'This is suggested because no active streak is visible now. Building a streak encourages regular workout behavior.',
        tone: 'green',
        iconType: 'calendar'
      },
      {
        title: 'Increase Reps Gradually',
        text:
          totalReps > 0
            ? 'Progressive overload leads to continuous gains.'
            : 'Start small and increase reps gradually.',
        reason:
          totalReps > 0
            ? `This is suggested because you have completed ${totalReps} reps. Gradually increasing reps can improve endurance without overloading too fast.`
            : 'This is suggested because your rep count is low. Starting with small goals and increasing slowly is safer and more sustainable.',
        tone: 'gold',
        iconType: 'trending'
      },
      {
        title: 'Burn More Calories',
        text:
          totalCalories >= 100
            ? 'Your calorie burn is improving. Keep your workout intensity steady.'
            : 'Add short active sessions to improve calorie burn.',
        reason:
          totalCalories >= 100
            ? `This is suggested because you have burned ${totalCalories} kcal so far. Maintaining workout intensity will help improve results.`
            : 'This is suggested because your total calorie burn is still low. Short regular sessions can increase calorie burn over time.',
        tone: 'gold',
        iconType: 'flame'
      },
      {
        title: 'Track Weekly Growth',
        text:
          totalWorkouts >= 3
            ? 'You have enough activity to start comparing weekly progress.'
            : 'Complete more sessions to unlock better progress patterns.',
        reason:
          totalWorkouts >= 3
            ? `This is suggested because you have completed ${totalWorkouts} workout sessions. Tracking weekly growth can show improvement clearly.`
            : 'This is suggested because more workout sessions are needed before weekly patterns become meaningful.',
        tone: 'blue',
        iconType: 'chart'
      }
    ]

    res.json({
      stats: {
        totalCalories,
        totalReps,
        totalWorkouts,
        dayStreak,
        aiScore,
        postureScore,
        repsGoal,
        repsGoalPercent,
        bestReps,
        uniqueExerciseCount,
        insightConfidence: aiScore
      },
      recentActivity,
      graphData,
      recommendations
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = {
  saveWorkoutHistory,
  syncLatestWorkoutHistory,
  getWorkoutHistory,
  getRecentActivity,
  getWorkoutStats,
  getProgressSummary
}