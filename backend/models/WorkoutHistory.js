const mongoose = require('mongoose')

const workoutHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    exercise: {
      type: String,
      required: true
    },

    reps_completed: {
      type: Number,
      default: 0
    },

    calories_burned: {
      type: Number,
      default: 0
    },

    duration: {
      type: String,
      default: ''
    },

    accuracy: {
      type: Number,
      default: 0
    },

    date_time: {
  type: String,
  default: ''
},

source_date_time: {
  type: String,
  default: ''
}
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('WorkoutHistory', workoutHistorySchema)