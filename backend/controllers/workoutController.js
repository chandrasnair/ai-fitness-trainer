const { exec } = require('child_process')
const path = require('path')

const startWorkout = (req, res) => {
  const { exercise } = req.body
  const exerciseMap = {
  'push-ups': 'pushup',
  'pushups': 'pushup',
  'push-up': 'pushup',
  'pushup': 'pushup',
  'squats': 'squat',
  'squat': 'squat'
}

const normalizedExercise = exerciseMap[exercise.toLowerCase()] || exercise

  if (!exercise) {
    return res.status(400).json({
      message: 'Exercise name is required'
    })
  }

  const projectRoot = path.join(__dirname, '..', '..')

  const command = `start cmd /k "cd /d ${projectRoot} && python -m ai_model.workout_launcher ${normalizedExercise}"`
  exec(command, (error) => {
    if (error) {
      console.error('Workout start error:', error)
    }
  })

  res.json({
    message: `${normalizedExercise} workout started`
  })
}

module.exports = {
  startWorkout
}