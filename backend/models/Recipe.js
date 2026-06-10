const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['written', 'video'],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    ingredients: {
      type: String,
      default: ''
    },

    instructions: {
      type: String,
      default: ''
    },

    image: {
  type: String,
  default: ''
  },

    videoUrl: {
      type: String,
      default: ''
    },
   
  thumbnail: {
  type: String,
  default: ''
},

    duration: {
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