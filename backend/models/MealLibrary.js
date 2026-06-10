const mongoose = require('mongoose')

const mealLibrarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'snack', 'dinner'],
      required: true
    },

    calories: {
      type: Number,
      required: true
    },

    protein: {
      type: Number,
      required: true
    },

    image: {
      type: String,
      default: ''
    },

    description: {
      type: String,
      default: ''
    },

    isDefault: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('MealLibrary', mealLibrarySchema)