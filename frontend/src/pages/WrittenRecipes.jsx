import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function WrittenRecipes() {
  const navigate = useNavigate()

  const defaultRecipes = [
    {
      _id: 'default-1',
      title: 'Protein Oats',
      ingredients:
        'oats, banana, whey protein, milk, cinnamon, peanut butter',
      instructions:
        'Cook oats with milk until soft and creamy. Add sliced banana and stir in whey protein after removing from heat. Finish with a small amount of peanut butter and cinnamon for extra flavour and healthy fats. Serve warm as a balanced high-protein breakfast.',
      image: '/images/protein-oats.jpg',
      source: 'default'
    },
    {
      _id: 'default-2',
      title: 'Chicken Bowl',
      ingredients:
        'chicken breast, rice, broccoli, olive oil, garlic, pepper',
      instructions:
        'Grill seasoned chicken breast until fully cooked. Prepare rice and steam broccoli separately. Combine all ingredients in a bowl, drizzle with olive oil, and season lightly. This meal provides quality protein, complex carbohydrates, and fibre for recovery and sustained energy.',
      image: '/images/chicken-bowl.jpg',
      source: 'default'
    },
    {
      _id: 'default-3',
      title: 'Salmon Dinner',
      ingredients:
        'salmon fillet, sweet potato, asparagus, lemon, olive oil',
      instructions:
        'Bake salmon with lemon and olive oil until tender. Roast sweet potatoes and lightly cook asparagus. Serve together as a nutrient-dense meal rich in protein, healthy fats, vitamins, and minerals that support recovery and overall health.',
      image: '/images/salmon-dinner.jpg',
      source: 'default'
    }
  ]

  const [uploadedRecipes, setUploadedRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApprovedRecipes = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/recipes/written'
        )

        const data = await response.json()

        if (response.ok) {
          setUploadedRecipes(data)
        } else {
          console.log(data.message)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchApprovedRecipes()
  }, [])

  const allRecipes = [
    ...defaultRecipes,
    ...uploadedRecipes
  ]

  const filteredRecipes = allRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="written-recipes-page">

      <div className="recipes-header">

        <div className="recipes-heading-block">
          <span>RECIPE LIBRARY</span>
          <h1>Written Recipes</h1>
        </div>

        <div className="recipe-header-actions">

          <div className="recipe-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="add-recipe-btn"
            onClick={() => navigate('/add-written-recipe')}
          >
            + Add Recipe
          </button>

        </div>

      </div>

      {loading && (
        <p>Loading approved recipes...</p>
      )}

      {!loading && filteredRecipes.length === 0 && (
        <p>No recipes found.</p>
      )}

      {filteredRecipes.map((recipe) => (
        <div key={recipe._id}>
          <div className="recipe-entry compact-recipe">

            <div className="recipe-main">

              <h2>{recipe.title}</h2>

              <span>
                {recipe.source === 'default'
                  ? 'FitFusion Recipe'
                  : 'Community Approved Recipe'}
              </span>

              <p className="ingredients-line">
                <strong>Ingredients:</strong> {recipe.ingredients}
              </p>

              <p className="instruction-para">
                {recipe.instructions}
              </p>

            </div>

            {recipe.image && (
              <img
                src={
                  recipe.source === 'default'
                    ? recipe.image
                    : `http://localhost:5000${recipe.image}`
                }
                alt={recipe.title}
                className="recipe-side-img"
              />
            )}

          </div>

          <hr />
        </div>
      ))}

    </div>
  )
}

export default WrittenRecipes