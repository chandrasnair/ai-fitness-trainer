const express = require('express')
const { startWorkout } = require('../controllers/workoutController')

const router = express.Router()

router.post('/start', startWorkout)

module.exports = router