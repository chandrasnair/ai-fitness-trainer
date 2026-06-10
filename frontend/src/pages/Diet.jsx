import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Settings,
  Leaf,
  Target,
  Flame,
  Droplets,
  Utensils,
  CalendarDays,
  BookOpen,
  Video,
  Lightbulb,
  Clock,
  Star,
  Play,
  Dumbbell,
  ChevronRight,
  X
} from 'lucide-react'

import NotificationBell from '../components/NotificationBell'

function Diet() {
  const navigate = useNavigate()

  const [recipeTab, setRecipeTab] = useState('written')
  const [writtenRecipes, setWrittenRecipes] = useState([])
  const [videoRecipes, setVideoRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showExploreChoice, setShowExploreChoice] = useState(false)
  const [showFullPlan, setShowFullPlan] = useState(false)

  const [dailyTargets, setDailyTargets] = useState([
    { day: 0, calories: '2200', protein: '120g', water: '2.5L', meals: '4' },
    { day: 1, calories: '2000', protein: '100g', water: '2.3L', meals: '4' },
    { day: 2, calories: '2100', protein: '110g', water: '2.7L', meals: '4' },
    { day: 3, calories: '2200', protein: '120g', water: '2.5L', meals: '4' },
    { day: 4, calories: '2000', protein: '100g', water: '2.3L', meals: '4' },
    { day: 5, calories: '2100', protein: '110g', water: '2.7L', meals: '4' },
    { day: 6, calories: '2200', protein: '120g', water: '2.5L', meals: '4' }
  ])

  const [todaysMealPlan, setTodaysMealPlan] = useState(null)
  const [showEditTarget, setShowEditTarget] = useState(false)
const [selectedGoalOption, setSelectedGoalOption] = useState('')
const [isSavingTarget, setIsSavingTarget] = useState(false)

  const [editTargetForm, setEditTargetForm] = useState({
    calories: '',
    protein: '',
    water: '',
    meals: ''
  })

  const defaultWrittenRecipes = [
    {
      _id: 'default-1',
      title: 'Protein Oats',
      ingredients: 'oats, banana, whey protein, milk, cinnamon, peanut butter',
      instructions:
        'Cook oats with milk until soft and creamy. Add sliced banana and stir in whey protein after removing from heat. Finish with a small amount of peanut butter and cinnamon for extra flavour and healthy fats. Serve warm as a balanced high-protein breakfast.',
      image: '/images/protein-oats.jpg',
      source: 'default'
    },
    {
      _id: 'default-2',
      title: 'Chicken Bowl',
      ingredients: 'chicken breast, rice, broccoli, olive oil, garlic, pepper',
      instructions:
        'Grill seasoned chicken breast until fully cooked. Prepare rice and steam broccoli separately. Combine all ingredients in a bowl, drizzle with olive oil, and season lightly. This meal provides quality protein, complex carbohydrates, and fibre for recovery and sustained energy.',
      image: '/images/chicken-bowl.jpg',
      source: 'default'
    },
    {
      _id: 'default-3',
      title: 'Salmon Dinner',
      ingredients: 'salmon fillet, sweet potato, asparagus, lemon, olive oil',
      instructions:
        'Bake salmon with lemon and olive oil until tender. Roast sweet potatoes and lightly cook asparagus. Serve together as a nutrient-dense meal rich in protein, healthy fats, vitamins, and minerals that support recovery and overall health.',
      image: '/images/salmon-dinner.jpg',
      source: 'default'
    }
  ]

  const defaultVideoRecipes = [
    {
      _id: 'default-video-1',
      title: 'Greek Yogurt Protein Bowl',
      duration: '0:20 min',
      thumbnail: '/images/greek-yogurt.jpg',
      video: '/videos/greek-yogurt.mp4',
      source: 'default'
    },
    {
      _id: 'default-video-2',
      title: 'Peanut Butter Banana Smoothie',
      duration: '0:39 min',
      thumbnail: '/images/smoothie-thumb.jpg',
      video: '/videos/smoothie.mp4',
      source: 'default'
    },
    {
      _id: 'default-video-3',
      title: 'Grilled Chicken Wrap',
      duration: '0:12 min',
      thumbnail: '/images/chicken-wrap.jpg',
      video: '/videos/chicken-wrap.mp4',
      source: 'default'
    },
    {
      _id: 'default-video-4',
      title: 'Avocado Toast Deluxe',
      duration: '0:37 min',
      thumbnail: '/images/avacado-toast.jpg',
      video: '/videos/avacado-toast.mp4',
      source: 'default'
    }
  ]

  const todayIndex = new Date().getDay()

  const todaysTarget =
    dailyTargets.find((target) => target.day === todayIndex) ||
    dailyTargets[0]

  const todaysMeals = todaysMealPlan
    ? [
        todaysMealPlan.meals.breakfast,
        todaysMealPlan.meals.lunch,
        todaysMealPlan.meals.snack,
        todaysMealPlan.meals.dinner
      ].filter(Boolean)
    : []

  const fetchTodayMealPlan = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))

      if (!userInfo?.token) {
        return
      }

      const response = await fetch(
        'http://localhost:5000/api/meal-plans/today',
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      )

      const data = await response.json()

      if (response.ok) {
        setTodaysMealPlan(data.mealPlan)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchDietTargets = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))

        if (!userInfo?.token) {
          return
        }

        const response = await fetch(
          'http://localhost:5000/api/diet-targets',
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          }
        )

        const data = await response.json()

        if (response.ok && data.weeklyTargets) {
          setDailyTargets(data.weeklyTargets)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchDietTargets()
    fetchTodayMealPlan()
  }, [])

  useEffect(() => {
    const fetchWrittenRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recipes/written')
        const data = await response.json()

        if (response.ok) {
          setWrittenRecipes([...defaultWrittenRecipes, ...data])
        } else {
          setWrittenRecipes(defaultWrittenRecipes)
        }
      } catch (error) {
        console.log(error)
        setWrittenRecipes(defaultWrittenRecipes)
      }
    }

    const fetchVideoRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recipes/videos')
        const data = await response.json()

        if (response.ok) {
          const formattedVideos = data.map((item) => ({
            _id: item._id,
            title: item.title,
            duration: item.duration || 'Duration not available',
            thumbnail: item.thumbnail
              ? `http://localhost:5000${item.thumbnail}`
              : '',
            video: `http://localhost:5000${item.videoUrl}`,
            source: 'uploaded'
          }))

          setVideoRecipes([...defaultVideoRecipes, ...formattedVideos])
        } else {
          setVideoRecipes(defaultVideoRecipes)
        }
      } catch (error) {
        console.log(error)
        setVideoRecipes(defaultVideoRecipes)
      }
    }

    fetchWrittenRecipes()
    fetchVideoRecipes()
  }, [])

  const nutritionTargets = [
    {
  icon: <Flame size={22} />,
  label: 'Calories',
  value: todaysTarget.calories,
  sub:
    todaysTarget.expectedRate?.includes('0.5')
      ? 'Fat loss · 0.5/wk'
      : todaysTarget.expectedRate?.includes('0.25')
        ? 'Mild loss · 0.25/wk'
        : todaysTarget.expectedRate || 'kcal target'
},
    {
      icon: <Dumbbell size={22} />,
      label: 'Protein',
      value: todaysTarget.protein,
      sub: 'daily goal'
    },
    {
      icon: <Droplets size={22} />,
      label: 'Water',
      value: todaysTarget.water,
      sub: 'hydration'
    },
    {
      icon: <Utensils size={22} />,
      label: 'Meals',
      value: todaysTarget.meals,
      sub: 'planned meals'
    }
  ]

  const getWrittenImage = (recipe) => {
    if (!recipe.image) return ''

    return recipe.source === 'default'
      ? recipe.image
      : `http://localhost:5000${recipe.image}`
  }

  const getVideoThumbnail = (video) => {
    return video.thumbnail || ''
  }

  const previewWrittenRecipes = writtenRecipes.slice(0, 3)
  const previewVideoRecipes = videoRecipes.slice(0, 3)

  const activeRecipes =
    recipeTab === 'written' ? previewWrittenRecipes : previewVideoRecipes

  const openEditTargetModal = () => {
    setEditTargetForm({
      calories: todaysTarget.calories,
      protein: todaysTarget.protein,
      water: todaysTarget.water,
      meals: todaysTarget.meals
    })

    setSelectedGoalOption(todaysTarget.goalIntensity || '')

    setShowEditTarget(true)
  }

  const saveTodayTarget = async () => {
  if (isSavingTarget) return

  setIsSavingTarget(true)

  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    if (!userInfo?.token) {
      alert('Please login first')
      setIsSavingTarget(false)
      return
    }

    const url = selectedGoalOption
      ? 'http://localhost:5000/api/diet-targets/goal-option'
      : 'http://localhost:5000/api/diet-targets/today'

    const bodyData = selectedGoalOption
      ? {
          day: todayIndex,
          option: selectedGoalOption
        }
      : {
          day: todayIndex,
          calories: editTargetForm.calories,
          protein: editTargetForm.protein,
          water: editTargetForm.water,
          meals: editTargetForm.meals
        }

    const response = await fetch(url, {
      method: selectedGoalOption ? 'PUT' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      },
      body: JSON.stringify(bodyData)
    })

    const data = await response.json()

    if (response.ok) {
      setDailyTargets(data.dietTarget.weeklyTargets)

      if (data.mealPlan) {
        setTodaysMealPlan(data.mealPlan)
      }

      setShowEditTarget(false)
    } else {
      alert(data.message || 'Failed to update target')
    }
  } catch (error) {
    console.log(error)
    alert('Something went wrong')
  } finally {
    setIsSavingTarget(false)
  }
}
  const regenerateTargetsFromProfile = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))

      if (!userInfo?.token) {
        alert('Please login first')
        return
      }

      const response = await fetch(
        'http://localhost:5000/api/diet-targets/regenerate',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      )

      const data = await response.json()

      if (response.ok) {
        setDailyTargets(data.dietTarget.weeklyTargets)

        if (data.mealPlan) {
          setTodaysMealPlan(data.mealPlan)
        }

        alert('Diet target regenerated from your profile')
      } else {
        alert(data.message || 'Failed to regenerate target')
      }
    } catch (error) {
      console.log(error)
      alert('Something went wrong')
    }
  }

  const selectGoalOption = async (option) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))

      if (!userInfo?.token) {
        alert('Please login first')
        return
      }

      const response = await fetch(
        'http://localhost:5000/api/diet-targets/goal-option',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
          },
          body: JSON.stringify({
            day: todayIndex,
            option
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setDailyTargets(data.dietTarget.weeklyTargets)

        if (data.mealPlan) {
          setTodaysMealPlan(data.mealPlan)
        }

        setEditTargetForm({
          calories: data.selectedTarget.calories,
          protein: data.selectedTarget.protein,
          water: data.selectedTarget.water,
          meals: data.selectedTarget.meals
        })

        setShowEditTarget(false)
      } else {
        alert(data.message || 'Failed to update goal option')
      }
    } catch (error) {
      console.log(error)
      alert('Something went wrong')
    }
  }

  const applyGoalOptionToForm = (option) => {
  setSelectedGoalOption(option)

  const maintenanceCalories =
    Number(todaysTarget.maintenanceCalories) ||
    Number(todaysTarget.calories)

  const minAllowedCalories =
    Number(todaysTarget.minAllowedCalories) || 1200

  let calories = maintenanceCalories
  let expectedProteinMultiplier = 1.2

  if (option === 'mild_fat_loss') {
    calories = maintenanceCalories - 250
    expectedProteinMultiplier = 1.6
  }

  if (option === 'fat_loss') {
    calories = maintenanceCalories - 500
    expectedProteinMultiplier = 1.6
  }

  if (option === 'muscle_gain') {
    calories = maintenanceCalories + 250
    expectedProteinMultiplier = 1.6
  }

  if (calories < minAllowedCalories) {
    calories = minAllowedCalories
  }

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const weight =
    Number(userInfo?.weight) ||
    Number(userInfo?.user?.weight) ||
    57

  const protein = Math.round(weight * expectedProteinMultiplier)

  setEditTargetForm({
    calories: String(calories),
    protein: `${protein}g`,
    water: todaysTarget.water,
    meals: todaysTarget.meals
  })
}
  return (
    <div className="diet-v2-page">

      <header className="diet-v2-header">

        <div className="diet-v2-title-area">
          <div className="diet-v2-leaf-icon">
            <Leaf size={32} />
          </div>

          <div>
            <span>AI NUTRITION SYSTEM</span>
            <h1>Diet & Nutrition</h1>
            <p>Smart meal planning for your fitness goals</p>
          </div>
        </div>

        <div className="diet-v2-actions">

          <div className="diet-v2-action-item">
            <div className="diet-v2-action-circle">
              <NotificationBell />
            </div>
            <small>Notifications</small>
          </div>

          <div
            className="diet-v2-action-item"
            onClick={() => navigate('/profile')}
          >
            <button className="diet-v2-action-circle">
              <Settings size={23} />
            </button>
            <small>Settings</small>
          </div>

        </div>

      </header>

      <section className="diet-v2-top-row">

        <div className="diet-v2-card diet-v2-target-section">

          <div className="diet-v2-section-head">
            <div className="diet-v2-section-title">
              <div className="diet-v2-section-icon">
                <Target size={24} />
              </div>

              <div>
                <h2>Today's Nutrition Target</h2>
                <p>Your daily goal based on today’s plan</p>
              </div>
            </div>

            <div className="diet-target-actions">
  <button
    className="diet-v2-outline-btn"
    onClick={openEditTargetModal}
  >
    Edit Target
  </button>

  <button
    className="diet-v2-outline-btn"
    onClick={regenerateTargetsFromProfile}
  >
    Recalculate
  </button>
</div>
          </div>

          <div className="diet-v2-target-grid">
            {nutritionTargets.map((target, index) => (
              <div className="diet-v2-target-card" key={index}>
                <div className="diet-v2-target-icon">
                  {target.icon}
                </div>

                <p>{target.label}</p>
                <h3>{target.value}</h3>
                <span>{target.sub}</span>

                <div className="diet-v2-progress-line">
                  <div />
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="diet-v2-card diet-v2-hero-card">

          <div className="diet-v2-hero-content">
            <span>FUEL BETTER</span>

            <h2>
              Fuel your body
              <br />
              the right way
            </h2>

            <p>
              Clean meals, proper hydration and balanced nutrition for better workout results.
            </p>

            <button
              className="diet-v2-primary-btn"
              onClick={() => setShowExploreChoice(true)}
            >
              Explore Recipes
              <ChevronRight size={18} />
            </button>
          </div>

          <img
            src="/images/nutrition-hero.png"
            alt="Healthy nutrition bowl"
          />

        </div>

      </section>

      <section className="diet-v2-card diet-v2-meal-section">

        <div className="diet-v2-section-head">
          <div className="diet-v2-section-title">
            <div className="diet-v2-section-icon">
              <CalendarDays size={23} />
            </div>

            <div>
  <h2>Today's Meal Plan</h2>
  <p>Personalized plan by AI Coach</p>

  {todaysMealPlan && (
    <p className="diet-meal-total-text">
      Planned total: {todaysMealPlan.totalCalories} kcal · Target: {todaysMealPlan.targetCalories} kcal
    </p>
  )}
</div>
          </div>

          <button
            className="diet-v2-outline-btn"
            onClick={() => setShowFullPlan(true)}
          >
            View Full Plan
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="diet-v2-meal-grid">
  {todaysMeals.length === 0 && (
    <p className="diet-meal-empty-text">
      Loading today’s meal plan...
    </p>
  )}

  {todaysMeals.map((meal, index) => (
    <div className="diet-v2-meal-card" key={index}>
              <div className="diet-v2-meal-top">
                <strong>{meal.type}</strong>
                <span>{meal.time}</span>
              </div>

              <img src={meal.image} alt={meal.title} />

              <h3>{meal.title}</h3>
              <p>{meal.info}</p>
            </div>
          ))}
        </div>

      </section>

      <section className="diet-v2-bottom-row">

        <div className="diet-v2-card diet-v2-recipes-section">

          <div className="diet-v2-recipes-head">

            <div className="diet-v2-section-title">
              <div className="diet-v2-section-icon">
                <Utensils size={23} />
              </div>

              <h2>Recipes</h2>
            </div>

            <div className="diet-v2-tabs">

              <button
                className={recipeTab === 'written' ? 'active' : ''}
                onClick={() => setRecipeTab('written')}
              >
                <BookOpen size={17} />
                Written Recipes
              </button>

              <button
                className={recipeTab === 'video' ? 'active' : ''}
                onClick={() => setRecipeTab('video')}
              >
                <Video size={17} />
                Video Recipes
              </button>

            </div>

          </div>

          <div className="diet-v2-recipe-grid">
            {activeRecipes.map((recipe) => (
              <div
                className="diet-v2-recipe-card"
                key={recipe._id}
                onClick={() => {
                  if (recipeTab === 'written') {
                    setSelectedRecipe(recipe)
                  } else {
                    setSelectedVideo(recipe)
                  }
                }}
              >

                <div className="diet-v2-recipe-image">
                  {recipeTab === 'written' ? (
                    <img
                      src={getWrittenImage(recipe)}
                      alt={recipe.title}
                    />
                  ) : getVideoThumbnail(recipe) ? (
                    <img
                      src={getVideoThumbnail(recipe)}
                      alt={recipe.title}
                    />
                  ) : (
                    <video src={recipe.video} muted preload="metadata" />
                  )}

                  {recipeTab === 'video' && (
                    <button className="diet-v2-play-btn">
                      <Play size={18} fill="currentColor" />
                    </button>
                  )}
                </div>

                <h3>{recipe.title}</h3>

                <div className="diet-v2-recipe-meta">
                  <span>
                    <Clock size={13} />
                    {recipeTab === 'written'
                      ? recipe.source === 'default'
                        ? 'FitFusion Recipe'
                        : 'Community Approved'
                      : recipe.duration}
                  </span>
                </div>

                {recipeTab === 'written' && (
                  <p>{recipe.ingredients}</p>
                )}

              </div>
            ))}
          </div>

          <button
            className="diet-v2-view-more-btn"
            onClick={() =>
              navigate(recipeTab === 'written' ? '/written-recipes' : '/recipe-videos')
            }
          >
            View More {recipeTab === 'written' ? 'Written Recipes' : 'Video Recipes'}
            <ChevronRight size={17} />
          </button>

        </div>

        <div className="diet-v2-card diet-v2-tips-section">

          <div className="diet-v2-section-title diet-v2-tips-title">
            <div className="diet-v2-section-icon">
              <Lightbulb size={23} />
            </div>

            <h2>Nutrition Tips</h2>
          </div>

          <div className="diet-v2-tips-body">

            <div className="diet-v2-tip-list">

              <div className="diet-v2-tip-item">
                <Droplets size={22} />
                <p>Drink enough water throughout the day for better recovery.</p>
              </div>

              <div className="diet-v2-tip-item">
                <Leaf size={22} />
                <p>Choose real, whole foods instead of heavily processed meals.</p>
              </div>

              <div className="diet-v2-tip-item">
                <Star size={22} />
                <p>Small consistent choices create long-term fitness progress.</p>
              </div>

            </div>

            <img
              src="/images/hydration.jpg"
              alt="Hydration"
            />

          </div>

        </div>

      </section>

      <div className="diet-v2-quote-strip">
        <Star size={19} />
        <p>
          Consistency is the key. Small daily choices lead to <strong>big results.</strong>
        </p>
      </div>

      {showExploreChoice && (
        <div className="diet-modal-overlay">
          <div className="diet-choice-modal">

            <button
              className="diet-modal-close"
              onClick={() => setShowExploreChoice(false)}
            >
              <X size={20} />
            </button>

            <h2>Explore Recipes</h2>
            <p>Choose the type of recipe you want to explore.</p>

            <div className="diet-choice-buttons">
              <button onClick={() => navigate('/written-recipes')}>
                <BookOpen size={22} />
                Written Recipes
              </button>

              <button onClick={() => navigate('/recipe-videos')}>
                <Video size={22} />
                Video Recipes
              </button>
            </div>

          </div>
        </div>
      )}

      {showFullPlan && (
        <div className="diet-modal-overlay">
          <div className="diet-plan-modal">

            <button
              className="diet-modal-close"
              onClick={() => setShowFullPlan(false)}
            >
              <X size={20} />
            </button>

            <h2>Full Daily Meal Plan</h2>
            <p>Today’s complete meal schedule by AI Coach.</p>

            <div className="diet-plan-modal-list">
              {todaysMeals.map((meal, index) => (
                <div className="diet-plan-modal-item" key={index}>
                  <img src={meal.image} alt={meal.title} />

                  <div>
                    <span>{meal.type} · {meal.time}</span>
                    <h3>{meal.title}</h3>
                    <p>{meal.info}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {selectedRecipe && (
        <div className="diet-modal-overlay">
          <div className="diet-recipe-modal">

            <button
              className="diet-modal-close"
              onClick={() => setSelectedRecipe(null)}
            >
              <X size={20} />
            </button>

            <img
              src={getWrittenImage(selectedRecipe)}
              alt={selectedRecipe.title}
            />

            <span>
              {selectedRecipe.source === 'default'
                ? 'FitFusion Recipe'
                : 'Community Approved Recipe'}
            </span>

            <h2>{selectedRecipe.title}</h2>

            <h4>Ingredients</h4>
            <p>{selectedRecipe.ingredients}</p>

            <h4>Instructions</h4>
            <p>{selectedRecipe.instructions}</p>

          </div>
        </div>
      )}

      {selectedVideo && (
        <div className="diet-modal-overlay">
          <div className="diet-video-modal">

            <button
              className="diet-modal-close"
              onClick={() => setSelectedVideo(null)}
            >
              <X size={20} />
            </button>

            <video
              controls
              src={selectedVideo.video}
              poster={getVideoThumbnail(selectedVideo)}
            />

            <span>
              {selectedVideo.source === 'default'
                ? 'FitFusion Video'
                : 'Community Approved Video'}
            </span>

            <h2>{selectedVideo.title}</h2>
            <p>{selectedVideo.duration}</p>

          </div>
        </div>
      )}

      {showEditTarget && (
  <div className="diet-modal-overlay">
    <div className="diet-edit-target-modal">

      <button
        className="diet-modal-close"
        onClick={() => setShowEditTarget(false)}
      >
        <X size={20} />
      </button>

      <h2>Edit Today’s Target</h2>
      <p>Update your nutrition target for today.</p>

      <div className="diet-goal-option-box">
  <h3>Choose recommended target</h3>

  <div className="diet-goal-options">

    <button
  className={selectedGoalOption === 'maintain' ? 'selected' : ''}
  onClick={() => applyGoalOptionToForm('maintain')}
>
      <strong>Maintain</strong>
      <span>Keep current weight</span>
    </button>

    <button
  className={selectedGoalOption === 'mild_fat_loss' ? 'selected' : ''}
  onClick={() => applyGoalOptionToForm('mild_fat_loss')}
>
      <strong>Mild Fat Loss</strong>
      <span>Around 0.25 kg/week</span>
    </button>

    <button
  className={selectedGoalOption === 'fat_loss' ? 'selected' : ''}
  onClick={() => applyGoalOptionToForm('fat_loss')}
>
      <strong>Fat Loss</strong>
      <span>Around 0.5 kg/week</span>
    </button>

    <button
  className={selectedGoalOption === 'muscle_gain' ? 'selected' : ''}
  onClick={() => applyGoalOptionToForm('muscle_gain')}
>
      <strong>Muscle Gain</strong>
      <span>Small calorie surplus</span>
    </button>

  </div>
</div>

      <div className="diet-edit-target-grid">

        <label>
          Calories
          <input
            type="text"
            value={editTargetForm.calories}
            onChange={(e) =>
              setEditTargetForm({
                ...editTargetForm,
                calories: e.target.value
              })
            }
          />
        </label>

        <label>
          Protein
          <input
            type="text"
            value={editTargetForm.protein}
            onChange={(e) =>
              setEditTargetForm({
                ...editTargetForm,
                protein: e.target.value
              })
            }
          />
        </label>

        <label>
          Water
          <input
            type="text"
            value={editTargetForm.water}
            onChange={(e) =>
              setEditTargetForm({
                ...editTargetForm,
                water: e.target.value
              })
            }
          />
        </label>

        <label>
          Meals
          <input
            type="text"
            value={editTargetForm.meals}
            onChange={(e) =>
              setEditTargetForm({
                ...editTargetForm,
                meals: e.target.value
              })
            }
          />
        </label>

      </div>

      <button
  className="diet-save-target-btn"
  onClick={saveTodayTarget}
  disabled={isSavingTarget}
>
  {isSavingTarget ? 'Saving...' : 'Save Target'}
</button>

    </div>
  </div>
)}

    </div>
  )
}

export default Diet