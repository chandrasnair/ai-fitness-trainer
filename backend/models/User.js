const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    profileImage: {
      type: String,
      default: ''
    },

    gender: String,
    age: Number,
    height: Number,
    weight: Number,

    fitnessGoal: String,
    level: String,

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', userSchema)