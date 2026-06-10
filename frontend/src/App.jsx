import { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Home from './pages/Home'
import Workouts from './pages/Workouts'
import Diet from './pages/Diet'
import Progress from './pages/Progress'
import AICoach from './pages/AICoach'
import Profile from './pages/Profile'
import WrittenRecipes from './pages/WrittenRecipes'
import RecipeVideos from './pages/RecipeVideos'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import WorkoutCategory from './pages/WorkoutCategory'
import ExerciseDetail from './pages/ExerciseDetail'
import StartExercise from './pages/StartExercise'
import WorkoutHistory from './pages/WorkoutHistory'
import AddWrittenRecipe from './pages/AddWrittenRecipe'
import UploadRecipeVideo from './pages/UploadRecipeVideo'
import AdminRoute from './components/AdminRoute'

function App() {

  useEffect(() => {
  const savedTheme = localStorage.getItem('themeMode') || 'light'

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
}, [])

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />
        <Route path="/home" element={<Home />} />

        <Route
          path="/workouts"
          element={<Workouts />}
        />

        <Route
          path="/diet"
          element={<Diet />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

        <Route
          path="/ai-coach"
          element={<AICoach />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
  path="/written-recipes"
  element={<WrittenRecipes />}
/>

       <Route
  path="/recipe-videos"
  element={<RecipeVideos />}
/>
<Route
  path="/aicoach"
  element={<AICoach />}
/>

<Route
  path="/login"
  element={<Login />}
/>
<Route
  path="/signup"
  element={<Signup />}
/>

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

<Route
  path="/workouts/category/:category"
  element={<WorkoutCategory />}
/>

<Route
  path="/exercise/:exerciseName"
  element={<ExerciseDetail />}
/>

<Route
  path="/start-exercise/:exerciseName"
  element={<StartExercise />}
/>

<Route path="/workout-history" element={<WorkoutHistory />} />

<Route
  path="/add-written-recipe"
  element={<AddWrittenRecipe />}
/>

<Route
  path="/upload-recipe-video"
  element={<UploadRecipeVideo />}
/>




      </Routes>

    </BrowserRouter>
  )
}

export default App