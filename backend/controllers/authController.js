const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
}

const signupUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      age,
      height,
      weight,
      fitnessGoal,
      level
    } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      age,
      height,
      weight,
      fitnessGoal,
      level
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = {
  signupUser,
  loginUser
}