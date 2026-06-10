const Recipe = require('../models/Recipe')

const addWrittenRecipe = async (req, res) => {
  try {
    const {
      title,
      ingredients,
      instructions
    } = req.body

    if (!title || !ingredients || !instructions) {
  return res.status(400).json({
    message: 'Recipe name, ingredients, and way of cooking are required'
  })
}

if (!req.file) {
  return res.status(400).json({
    message: 'Dish photo is required'
  })
}

  const recipe = await Recipe.create({
  type: 'written',
  title,
  ingredients,
  instructions,
  image: `/uploads/recipes/${req.file.filename}`,
  submittedBy: req.user._id,
  status: 'pending'
})

    res.status(201).json({
      message: 'Recipe submitted for admin approval',
      recipe
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const addVideoRecipe = async (req, res) => {
  try {
    const { title, duration } = req.body

    if (!title) {
      return res.status(400).json({
        message: 'Video title is required'
      })
    }

    const videoFile = req.files?.video?.[0]
    const thumbnailFile = req.files?.thumbnail?.[0]

if (!videoFile) {
  return res.status(400).json({
    message: 'Video file is required'
  })
}

if (!thumbnailFile) {
  return res.status(400).json({
    message: 'Thumbnail image is required'
  })
}

    const recipe = await Recipe.create({
      type: 'video',
      title,
     videoUrl: `/uploads/recipes/${videoFile.filename}`,
      thumbnail: `/uploads/recipes/${thumbnailFile.filename}`,
      duration,
      submittedBy: req.user._id,
      status: 'pending'
    })

    res.status(201).json({
      message: 'Video recipe submitted for admin approval',
      recipe
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getPendingRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      status: 'pending'
    })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 })

    res.json(recipes)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const approveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found'
      })
    }

    recipe.status = 'approved'
    await recipe.save()

    res.json({
      message: 'Recipe approved',
      recipe
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const rejectRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found'
      })
    }

    recipe.status = 'rejected'
    await recipe.save()

    res.json({
      message: 'Recipe rejected',
      recipe
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getApprovedWrittenRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      type: 'written',
      status: 'approved'
    })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 })

    res.json(recipes)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getApprovedVideoRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      type: 'video',
      status: 'approved'
    })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 })

    res.json(recipes)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getMyContributions = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      submittedBy: req.user._id
    }).sort({ createdAt: -1 })

    res.json(recipes)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = {
  addWrittenRecipe,
  addVideoRecipe,
  getPendingRecipes,
  approveRecipe,
  rejectRecipe,
  getApprovedWrittenRecipes,
  getApprovedVideoRecipes,
  getMyContributions
}