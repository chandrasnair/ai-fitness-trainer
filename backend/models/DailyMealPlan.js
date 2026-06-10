const mongoose = require('mongoose')

const mealSnapshotSchema = new mongoose.Schema(
  {
    title: String,
    mealType: String,
    type: String,
    time: String,
    calories: Number,
    protein: Number,
    image: String,
    info: String,
    sourceMealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MealLibrary'
    }
  },
  { _id: false }
)

const dailyMealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    day: {
      type: Number,
      required: true
    },

    targetCalories: {
      type: Number,
      required: true
    },

    targetProtein: {
      type: Number,
      required: true
    },

    meals: {
      breakfast: mealSnapshotSchema,
      lunch: mealSnapshotSchema,
      snack: mealSnapshotSchema,
      dinner: mealSnapshotSchema
    },

    totalCalories: {
      type: Number,
      required: true
    },

    totalProtein: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

dailyMealPlanSchema.index({ user: 1, day: 1 }, { unique: true })

module.exports = mongoose.model('DailyMealPlan', dailyMealPlanSchema)