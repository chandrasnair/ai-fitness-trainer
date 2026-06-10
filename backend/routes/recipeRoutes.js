const express = require('express')

const {
  addWrittenRecipe,
  addVideoRecipe,
  getPendingRecipes,
  approveRecipe,
  rejectRecipe,
  getApprovedWrittenRecipes,
  getApprovedVideoRecipes,
  getMyContributions
} = require('../controllers/recipeController')

const {
  protect,
  adminOnly
} = require('../middleware/authMiddleware')

const recipeUpload = require('../middleware/recipeUploadMiddleware')

const router = express.Router()

router.post(
  '/written',
  protect,
  recipeUpload.single('image'),
  addWrittenRecipe
)

router.post(
  '/video',
  protect,
  recipeUpload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  addVideoRecipe
)

router.get(
  '/pending',
  protect,
  adminOnly,
  getPendingRecipes
)

router.put(
  '/:id/approve',
  protect,
  adminOnly,
  approveRecipe
)

router.put(
  '/:id/reject',
  protect,
  adminOnly,
  rejectRecipe
)

router.get(
  '/written',
  getApprovedWrittenRecipes
)

router.get(
  '/videos',
  getApprovedVideoRecipes
)

router.get(
  '/my-contributions',
  protect,
  getMyContributions
)

module.exports = router