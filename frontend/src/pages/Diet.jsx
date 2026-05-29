import {
  Bell,
  Settings,
  Leaf,
  Play,
  Utensils,
  PlayCircle
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

function Diet() {

  const navigate = useNavigate()

  return (
    <div className="diet-page">
      <div className="page-topbar">

  <div className="page-title-block">
    <span>AI NUTRITION SYSTEM</span>
    <h1>Diet</h1>
  </div>

  <div className="top-actions">

    <button className="icon-btn">
  <Bell size={19} />
</button>

<button className="icon-btn">
  <Settings size={19} />
</button>

  </div>

</div>

      <section className="diet-hero-soft">

  <div className="diet-hero-text">
    <h1>
      Nutrition that
      <br />
      <em>powers you</em>
    </h1>

    <p>
      Smart meals. Balanced macros.
      <br />
      Better energy, every day.
    </p>
  </div>

  <img
    src="/images/nutrition-hero.jpg"
    alt=""
  />

</section>

<section className="diet-main-layout">

  <div className="meal-plan-side">

    <div className="meal-plan-heading">
      <span>🍴</span>
      <div>
        <h2>Your Daily Meal Plan</h2>
        <p>Personalized plan by AI Coach</p>
      </div>
    </div>

    <div className="meal-flow">

      <div className="meal-item">
        <span className="meal-time">8 AM</span>
        <img src="/images/breakfast-thumb.jpg" alt="" />
        <div>
          <h3>Protein Oats</h3>
          <p>420 kcal · 28g protein</p>
        </div>
      </div>

      <div className="meal-item">
        <span className="meal-time">1 PM</span>
        <img src="/images/lunch-thumb.jpg" alt="" />
        <div>
          <h3>Chicken Bowl</h3>
          <p>620 kcal · 42g protein</p>
        </div>
      </div>

      <div className="meal-item">
        <span className="meal-time">5 PM</span>
        <img src="/images/snack-thumb.jpg" alt="" />
        <div>
          <h3>Fruit Snack</h3>
          <p>210 kcal · light recovery</p>
        </div>
      </div>

      <div className="meal-item">
        <span className="meal-time">8 PM</span>
        <img src="/images/dinner-thumb.jpg" alt="" />
        <div>
          <h3>Salmon Dinner</h3>
          <p>540 kcal · balanced macros</p>
        </div>
      </div>

    </div>

  </div>

  <div className="nutrition-strips">

    <div className="nutrition-strip">
      <div className="strip-icon">🌿</div>
      <div className="strip-content">
        <span>EAT CLEAN</span>
        <h3>Eat real, whole foods</h3>
        <p>Choose minimally processed foods for steady energy.</p>
      </div>
      <div className="strip-image">
        <img src="/images/lunch-thumb.jpg" alt="" />
      </div>
    </div>

    <div className="nutrition-strip">
      <div className="strip-icon">⚖️</div>
      <div className="strip-content">
        <span>MACROS</span>
        <h3>Balance your nutrition</h3>
        <p>Protein, fats, and carbs should work together.</p>
      </div>
      <div className="strip-image">
        <img src="/images/dinner-thumb.jpg" alt="" />
      </div>
    </div>

    <div className="nutrition-strip">
      <div className="strip-icon">💧</div>
      <div className="strip-content">
        <span>HYDRATION</span>
        <h3>Drink enough water</h3>
        <p>Hydration improves digestion and workout recovery.</p>
      </div>
      <div className="strip-image">
        <img src="/images/hydration.jpg" alt="" />
      </div>
    </div>

  </div>

</section>

<section className="recipe-hub">

  <div className="recipe-video-mini">

    <img
      src="/images/recipe-video-cover.jpg"
      alt=""
    />

    <button className="mini-play-btn">
      <Play size={26} fill="currentColor" />
    </button>

    <div>
      <span>VIDEO RECIPE</span>
      <h3>Protein bowl prep</h3>
      <p>Watch step-by-step cooking.</p>
    </div>

   <button
  className="view-videos-btn"
  onClick={() =>
    navigate('/recipe-videos')
  }
>
  View More Videos →
</button>

  </div>

  <div className="written-recipe-mini">

  <span>WRITTEN RECIPE</span>

  <h3>
    High-protein recovery bowl
  </h3>

  <p>
    Ingredients, macros, cooking steps,
    and AI nutrition notes.
  </p>

  <button
    onClick={() =>
      navigate('/written-recipes')
    }
  >
    Browse Written Recipes →
  </button>

</div>

  <div className="today-target-mini">

    <span>TODAY'S TARGET</span>

    <div>
      <strong>120g</strong>
      <p>Protein</p>
    </div>

    <div>
      <strong>2.5L</strong>
      <p>Water</p>
    </div>

    <div>
      <strong>2200</strong>
      <p>Calories</p>
    </div>

  </div>

</section>
      </div>
    )
}

export default Diet