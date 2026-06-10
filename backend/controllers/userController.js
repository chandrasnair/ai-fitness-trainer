const User = require('../models/User')
const bcrypt = require('bcryptjs')
const Recipe = require('../models/Recipe')

const getUserProfile = async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    user.name = req.body.name || user.name
    user.gender = req.body.gender || user.gender
    user.age = req.body.age || user.age
    user.height = req.body.height || user.height
    user.weight = req.body.weight || user.weight
    user.fitnessGoal = req.body.fitnessGoal || user.fitnessGoal
    user.level = req.body.level || user.level
    user.profileImage = req.body.profileImage ?? user.profileImage

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      age: updatedUser.age,
      height: updatedUser.height,
      weight: updatedUser.weight,
      fitnessGoal: updatedUser.fitnessGoal,
      level: updatedUser.level,
      profileImage: updatedUser.profileImage,
      role: updatedUser.role,
      token: req.headers.authorization.split(' ')[1]
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword
    } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    )

    if (!isMatch) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      })
    }

    user.password = await bcrypt.hash(newPassword, 10)

    await user.save()

    res.json({
      message: 'Password changed successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}
const downloadMyData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')

    const contributions = await Recipe.find({
      submittedBy: req.user._id
    }).sort({ createdAt: -1 })

    res.json({
      profile: user,
      contributions,
      downloadedAt: new Date()
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}
const deleteMyAccount = async (req, res) => {
  try {
    await Recipe.deleteMany({
      submittedBy: req.user._id
    })

    await User.findByIdAndDelete(req.user._id)

    res.json({
      message: 'Account deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  downloadMyData,
  deleteMyAccount
}