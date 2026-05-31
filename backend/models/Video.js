const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ''
    },

    videoUrl: {
      type: String,
      required: true
    },

    thumbnail: {
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

module.exports = mongoose.model('Video', videoSchema)