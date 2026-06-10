const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/recipes/')
  },

  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${file.originalname}`
    )
  }
})

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png/
  const allowedVideoTypes = /mp4|mov|webm/

  const extname = path.extname(file.originalname).toLowerCase()

  const isImage =
    allowedImageTypes.test(extname) &&
    (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    )

  const isVideo =
    allowedVideoTypes.test(extname) &&
    (
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/quicktime' ||
      file.mimetype === 'video/webm'
    )

  if (isImage || isVideo) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG, JPEG, PNG images and MP4, MOV, WEBM videos are allowed'))
  }
}

const recipeUpload = multer({
  storage,
  fileFilter
})

module.exports = recipeUpload