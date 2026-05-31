const express = require('express')

const User = require('../models/User')
const Recipe = require('../models/Recipe')
const Video = require('../models/Video')

const router = express.Router()

router.get('/create-sample', async (req, res) => {
  try {
    const user = await User.create({
      name: 'Chandra S Nair',
      email: 'chandra@example.com',
      password: 'test123',
      gender: 'Female',
      age: 21,
      height: 172,
      weight: 68,
      fitnessGoal: 'Strength & Fat Loss',
      level: 'Intermediate'
    })

    const recipe = await Recipe.create({
      title: 'High Protein Recovery Bowl',
      ingredients: ['Rice', 'Chicken', 'Broccoli', 'Olive oil'],
      instructions: 'Cook rice, grill chicken, steam broccoli, and combine everything.',
      submittedBy: user._id
    })

    const video = await Video.create({
      title: 'Banana Smoothie Prep',
      description: 'A quick high-protein smoothie recipe.',
      videoUrl: 'https://example.com/video.mp4',
      thumbnail: 'https://example.com/thumb.jpg',
      submittedBy: user._id
    })

    res.status(201).json({
      message: 'Sample data created successfully',
      user,
      recipe,
      video
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

module.exports = router