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


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

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
  element={<AdminDashboard />}
/>


      </Routes>

    </BrowserRouter>
  )
}

export default App