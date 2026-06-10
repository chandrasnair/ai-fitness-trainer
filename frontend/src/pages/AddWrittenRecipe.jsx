import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddWrittenRecipe() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: ''
  })

  const [dishImage, setDishImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    setDishImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.title.trim() ||
      !formData.ingredients.trim() ||
      !formData.instructions.trim()
    ) {
      setMessage('Recipe name, ingredients, and way of cooking are required.')
      return
    }

    if (!dishImage) {
      setMessage('Dish photo is required.')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const userInfo = JSON.parse(localStorage.getItem('userInfo'))

      const recipeData = new FormData()
      recipeData.append('title', formData.title)
      recipeData.append('ingredients', formData.ingredients)
      recipeData.append('instructions', formData.instructions)
      recipeData.append('image', dishImage)

      const response = await fetch('http://localhost:5000/api/recipes/written', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userInfo?.token}`
        },
        body: recipeData
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Failed to submit recipe')
        return
      }

      setMessage('Recipe submitted for admin approval.')

      setTimeout(() => {
        navigate('/written-recipes')
      }, 1200)
    } catch (error) {
      setMessage('Something went wrong')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-recipe-page">

      <div className="add-recipe-header">
        <span>COMMUNITY RECIPE</span>
        <h1>Add Written Recipe</h1>
        <p>Your recipe will be visible after admin approval.</p>
      </div>

      <div className="add-recipe-layout">

        <form className="add-recipe-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Recipe Name *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Protein Oats"
              required
            />
          </div>

          <div className="form-group">
            <label>Ingredients *</label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="Enter ingredients"
              required
            />
          </div>

          <div className="form-group">
            <label>Way of Cooking *</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Enter cooking steps"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>

          {message && <p className="recipe-message">{message}</p>}

        </form>

        <div className="dish-photo-box">
          <h3>Dish Photo *</h3>
          <p>Upload a clear photo of your prepared dish.</p>

          <label className="dish-upload-area">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            {imagePreview ? (
              <img src={imagePreview} alt="Dish preview" />
            ) : (
              <span>Click to upload dish photo</span>
            )}
          </label>
        </div>

      </div>

    </div>
  )
}

export default AddWrittenRecipe