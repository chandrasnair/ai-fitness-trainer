const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    ingredients: [String],

    instructions: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: ''
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Recipe', recipeSchema)