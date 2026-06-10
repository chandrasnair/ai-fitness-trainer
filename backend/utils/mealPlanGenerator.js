const MealLibrary = require('../models/MealLibrary')
const DailyMealPlan = require('../models/DailyMealPlan')

const defaultMeals = [
  // Breakfast
  {
    title: 'Greek Yogurt Protein Bowl',
    mealType: 'breakfast',
    calories: 300,
    protein: 24,
    image: '/images/greek-yogurt.jpg',
    description: 'Light high-protein breakfast bowl.'
  },
  {
    title: 'Banana Smoothie',
    mealType: 'breakfast',
    calories: 360,
    protein: 18,
    image: '/images/smoothie-thumb.jpg',
    description: 'Simple recovery smoothie.'
  },
  {
    title: 'Egg Toast',
    mealType: 'breakfast',
    calories: 390,
    protein: 24,
    image: '/images/egg-toast.jpg',
    description: 'Balanced breakfast with protein.'
  },
  {
    title: 'Protein Oats',
    mealType: 'breakfast',
    calories: 420,
    protein: 28,
    image: '/images/protein-oats.jpg',
    description: 'High-protein oats for steady energy.'
  },
  {
    title: 'Avacado Toast',
    mealType: 'breakfast',
    calories: 430,
    protein: 16,
    image: '/images/avacado-toast.jpg',
    description: 'Healthy toast with good fats.'
  },
  {
    title: 'Idli Sambar',
    mealType: 'breakfast',
    calories: 450,
    protein: 18,
    image: '/images/idli-sambar.jpg',
    description: 'Light South Indian breakfast.'
  },
  {
    title: 'Upma Breakfast',
    mealType: 'breakfast',
    calories: 480,
    protein: 14,
    image: '/images/upma-breakfast.jpg',
    description: 'Simple filling breakfast.'
  },
  {
    title: 'Banana Pancake',
    mealType: 'breakfast',
    calories: 520,
    protein: 20,
    image: '/images/banana-pancake.jpg',
    description: 'Higher-energy breakfast option.'
  },

  // Lunch
  {
    title: 'Light Chicken Salad',
    mealType: 'lunch',
    calories: 420,
    protein: 35,
    image: '/images/lunch-thumb.jpg',
    description: 'Light lunch for lower calorie targets.'
  },
  {
    title: 'Tuna Salad',
    mealType: 'lunch',
    calories: 500,
    protein: 40,
    image: '/images/tuna-salad.jpg',
    description: 'Lean protein lunch.'
  },
  {
    title: 'Chicken Wrap',
    mealType: 'lunch',
    calories: 560,
    protein: 38,
    image: '/images/chicken-wrap.jpg',
    description: 'Protein-rich wrap meal.'
  },
  {
    title: 'Chickpea Bowl',
    mealType: 'lunch',
    calories: 570,
    protein: 24,
    image: '/images/chickpea-bowl.jpg',
    description: 'Plant-based balanced lunch.'
  },
  {
    title: 'Paneer Bowl',
    mealType: 'lunch',
    calories: 590,
    protein: 35,
    image: '/images/paneer-bowl.jpg',
    description: 'Balanced vegetarian lunch.'
  },
  {
    title: 'Veg Rice Bowl',
    mealType: 'lunch',
    calories: 620,
    protein: 22,
    image: '/images/veg-dinner.jpg',
    description: 'Vegetable rice meal.'
  },
  {
    title: 'Dal Rice Bowl',
    mealType: 'lunch',
    calories: 640,
    protein: 24,
    image: '/images/dal-curry.jpg',
    description: 'Homestyle dal rice meal.'
  },
  {
    title: 'Egg Rice Bowl',
    mealType: 'lunch',
    calories: 650,
    protein: 32,
    image: '/images/egg-rice-bowl.jpg',
    description: 'Egg-based balanced lunch.'
  },
  {
    title: 'Chicken Bowl',
    mealType: 'lunch',
    calories: 700,
    protein: 45,
    image: '/images/chicken-bowl.jpg',
    description: 'High-protein lunch bowl.'
  },

  // Snack
  {
    title: 'Hydration Fruit Cup',
    mealType: 'snack',
    calories: 140,
    protein: 3,
    image: '/images/fruit-cup.jpg',
    description: 'Light fruit snack.'
  },
  {
    title: 'Boiled Eggs',
    mealType: 'snack',
    calories: 170,
    protein: 14,
    image: '/images/boiled-eggs.jpg',
    description: 'Simple protein snack.'
  },
  {
    title: 'Corn Salad',
    mealType: 'snack',
    calories: 190,
    protein: 6,
    image: '/images/corn-salad.jpg',
    description: 'Light fibre-rich snack.'
  },
  {
    title: 'Fruit Snack',
    mealType: 'snack',
    calories: 210,
    protein: 4,
    image: '/images/snack-thumb.jpg',
    description: 'Simple light recovery snack.'
  },
  {
    title: 'Protein Shake',
    mealType: 'snack',
    calories: 220,
    protein: 25,
    image: '/images/protein-shake.jpg',
    description: 'High-protein quick snack.'
  },
  {
    title: 'Sprouts Bowl',
    mealType: 'snack',
    calories: 230,
    protein: 12,
    image: '/images/sprouts.jpg',
    description: 'High-fibre snack.'
  },
  {
    title: 'Nuts & Banana',
    mealType: 'snack',
    calories: 260,
    protein: 8,
    image: '/images/nuts.jpg',
    description: 'Energy snack with healthy fats.'
  },
  {
    title: 'Peanut Toast',
    mealType: 'snack',
    calories: 320,
    protein: 14,
    image: '/images/peanut-toast.jpg',
    description: 'Higher-calorie snack option.'
  },

  // Dinner
  {
    title: 'Soup Salad',
    mealType: 'dinner',
    calories: 380,
    protein: 16,
    image: '/images/soup-salad.jpg',
    description: 'Light dinner option.'
  },
  {
    title: 'Light Dal Curry Meal',
    mealType: 'dinner',
    calories: 430,
    protein: 18,
    image: '/images/dal-curry.jpg',
    description: 'Light balanced dinner.'
  },
  {
    title: 'Veg Dinner Plate',
    mealType: 'dinner',
    calories: 480,
    protein: 18,
    image: '/images/veg-dinner.jpg',
    description: 'Clean vegetarian dinner.'
  },
  {
    title: 'Dal Curry Meal',
    mealType: 'dinner',
    calories: 510,
    protein: 22,
    image: '/images/dal-curry.jpg',
    description: 'Balanced homemade dinner.'
  },
  {
    title: 'Salmon Dinner',
    mealType: 'dinner',
    calories: 540,
    protein: 35,
    image: '/images/salmon-dinner.jpg',
    description: 'Protein-rich dinner.'
  },
  {
    title: 'Egg Dinner',
    mealType: 'dinner',
    calories: 560,
    protein: 34,
    image: '/images/egg-dinner.jpg',
    description: 'Egg-based dinner meal.'
  },
  {
    title: 'Chapati Curry',
    mealType: 'dinner',
    calories: 600,
    protein: 24,
    image: '/images/chapati-curry.jpg',
    description: 'Balanced Indian dinner.'
  },
  {
    title: 'Grilled Chicken Dinner',
    mealType: 'dinner',
    calories: 620,
    protein: 45,
    image: '/images/grilled-chicken-dinner.jpg',
    description: 'High-protein dinner.'
  },
  {
    title: 'Paneer Dinner',
    mealType: 'dinner',
    calories: 650,
    protein: 38,
    image: '/images/paneer-bowl.jpg',
    description: 'Higher-protein vegetarian dinner.'
  }
]

const ensureDefaultMeals = async () => {
  for (const meal of defaultMeals) {
    await MealLibrary.updateOne(
      {
        title: meal.title,
        mealType: meal.mealType
      },
      {
        $set: meal
      },
      {
        upsert: true
      }
    )
  }
}

const getMealTime = (mealType) => {
  if (mealType === 'breakfast') return '8 AM'
  if (mealType === 'lunch') return '1 PM'
  if (mealType === 'snack') return '5 PM'
  return '8 PM'
}

const getMealDisplayType = (mealType) => {
  if (mealType === 'breakfast') return 'Breakfast'
  if (mealType === 'lunch') return 'Lunch'
  if (mealType === 'snack') return 'Snack'
  return 'Dinner'
}

const createMealSnapshot = (meal) => {
  return {
    title: meal.title,
    mealType: meal.mealType,
    type: getMealDisplayType(meal.mealType),
    time: getMealTime(meal.mealType),
    calories: meal.calories,
    protein: meal.protein,
    image: meal.image,
    info: `${meal.calories} kcal · ${meal.protein}g protein`,
    sourceMealId: meal._id
  }
}

const parseProtein = (proteinValue) => {
  return Number(String(proteinValue).replace('g', '').trim()) || 0
}

const chooseBestMealCombination = async (target) => {
  await ensureDefaultMeals()

  const targetCalories = Number(target.calories)
  const targetProtein = parseProtein(target.protein)

  const breakfasts = await MealLibrary.find({ mealType: 'breakfast' })
  const lunches = await MealLibrary.find({ mealType: 'lunch' })
  const snacks = await MealLibrary.find({ mealType: 'snack' })
  const dinners = await MealLibrary.find({ mealType: 'dinner' })

  let bestCombination = null
  let bestScore = Infinity

  breakfasts.forEach((breakfast) => {
    lunches.forEach((lunch) => {
      snacks.forEach((snack) => {
        dinners.forEach((dinner) => {
          const totalCalories =
            breakfast.calories +
            lunch.calories +
            snack.calories +
            dinner.calories

          const totalProtein =
            breakfast.protein +
            lunch.protein +
            snack.protein +
            dinner.protein

          const calorieDifference = Math.abs(totalCalories - targetCalories)
          const proteinDifference = Math.abs(totalProtein - targetProtein)

          const score = calorieDifference + proteinDifference * 4

          if (score < bestScore) {
            bestScore = score

            bestCombination = {
              breakfast,
              lunch,
              snack,
              dinner,
              totalCalories,
              totalProtein
            }
          }
        })
      })
    })
  })

  return bestCombination
}

const generateAndSaveMealPlan = async (userId, day, target) => {
  const combination = await chooseBestMealCombination(target)

  if (!combination) {
    throw new Error('No meal combination found')
  }

  const mealPlanData = {
    user: userId,
    day,
    targetCalories: Number(target.calories),
    targetProtein: parseProtein(target.protein),
    meals: {
      breakfast: createMealSnapshot(combination.breakfast),
      lunch: createMealSnapshot(combination.lunch),
      snack: createMealSnapshot(combination.snack),
      dinner: createMealSnapshot(combination.dinner)
    },
    totalCalories: combination.totalCalories,
    totalProtein: combination.totalProtein
  }

  const mealPlan = await DailyMealPlan.findOneAndUpdate(
    {
      user: userId,
      day
    },
    mealPlanData,
    {
      new: true,
      upsert: true
    }
  )

  return mealPlan
}

module.exports = {
  generateAndSaveMealPlan
}