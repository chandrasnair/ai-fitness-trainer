import { Search } from 'lucide-react'

function WrittenRecipes() {
  return (
    <div className="written-recipes-page">

      <div className="recipes-header">

  <div className="recipes-heading-block">

    <span>RECIPE LIBRARY</span>

    <h1>Written Recipes</h1>

  </div>

  <div className="recipe-search">

    <Search size={18} />

    <input
      type="text"
      placeholder="Search recipes..."
    />

  </div>

</div>

      {/* RECIPE 1 */}

      <div className="recipe-entry compact-recipe">

        <div className="recipe-main">

          <h2>Protein Oats</h2>

          <span>
            High Protein Breakfast
          </span>

          <p className="ingredients-line">
            <strong>Ingredients:</strong> oats, banana, whey protein, milk,
            cinnamon, peanut butter
          </p>

          <p className="instruction-para">
            Cook oats with milk until soft and creamy. Add sliced banana and
            stir in whey protein after removing from heat. Finish with a small
            amount of peanut butter and cinnamon for extra flavour and healthy
            fats. Serve warm as a balanced high-protein breakfast.
          </p>

        </div>

        <img
          src="/images/protein-oats.jpg"
          alt=""
          className="recipe-side-img"
        />

      </div>

      <hr />

      {/* RECIPE 2 */}

      <div className="recipe-entry compact-recipe">

        <div className="recipe-main">

          <h2>Chicken Bowl</h2>

          <span>
            Lunch Recovery Meal
          </span>

          <p className="ingredients-line">
            <strong>Ingredients:</strong> chicken breast, rice, broccoli,
            olive oil, garlic, pepper
          </p>

          <p className="instruction-para">
            Grill seasoned chicken breast until fully cooked. Prepare rice and
            steam broccoli separately. Combine all ingredients in a bowl,
            drizzle with olive oil, and season lightly. This meal provides
            quality protein, complex carbohydrates, and fibre for recovery and
            sustained energy.
          </p>

        </div>

        <img
          src="/images/chicken-bowl.jpg"
          alt=""
          className="recipe-side-img"
        />

      </div>

      <hr />

      {/* RECIPE 3 */}

      <div className="recipe-entry compact-recipe">

        <div className="recipe-main">

          <h2>Salmon Dinner</h2>

          <span>
            High Omega-3 Dinner
          </span>

          <p className="ingredients-line">
            <strong>Ingredients:</strong> salmon fillet, sweet potato,
            asparagus, lemon, olive oil
          </p>

          <p className="instruction-para">
            Bake salmon with lemon and olive oil until tender. Roast sweet
            potatoes and lightly cook asparagus. Serve together as a nutrient-
            dense meal rich in protein, healthy fats, vitamins, and minerals
            that support recovery and overall health.
          </p>

        </div>

        <img
          src="/images/salmon-dinner.jpg"
          alt=""
          className="recipe-side-img"
        />

      </div>

    </div>
  )
}

export default WrittenRecipes