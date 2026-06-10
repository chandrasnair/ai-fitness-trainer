const mongoose = require('mongoose')

const dayTargetSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true
    },

    goal: {
      type: String,
      default: 'maintain'
    },

    goalIntensity: {
  type: String,
  default: 'auto'
},

    calories: {
      type: String,
      required: true
    },

    protein: {
      type: String,
      required: true
    },

    water: {
      type: String,
      required: true
    },

    meals: {
      type: String,
      required: true
    },

    maintenanceCalories: {
      type: Number,
      default: 0
    },

    minAllowedCalories: {
      type: Number,
      default: 1200
    },

    expectedRate: {
      type: String,
      default: 'maintenance'
    },

    healthNote: {
      type: String,
      default: ''
    },

    isCustom: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
)

const dietTargetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    weeklyTargets: {
      type: [dayTargetSchema],
      default: []
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('DietTarget', dietTargetSchema)