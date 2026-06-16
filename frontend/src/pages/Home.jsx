import { API_URL } from '../api'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NotificationBell from '../components/NotificationBell'

import {
  Home as HomeIcon,
  Dumbbell,
  Apple,
  BarChart3,
  Settings,
  Bot,
  Flame,
  Repeat,
  Zap,
  Menu,
  X,
  ArrowRight,
  CalendarDays,
  Clock3,
  CheckCircle,
  Leaf,
  Salad,
  Activity,
  History,
  UserRound,
  Target
} from 'lucide-react'

import '../index.css'

function Home() {
  const navigate = useNavigate()

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const isAdmin = userInfo?.role === 'admin'

  const [showIntro, setShowIntro] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [gender, setGender] = useState('male')
  const [recentActivity, setRecentActivity] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem('themeMode') === 'dark'
)

  const [stats, setStats] = useState({
    dayStreak: 0,
    totalWorkouts: 0,
    totalReps: 0,
    totalCalories: 0
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    if (userInfo?.gender) {
      setGender(userInfo.gender.toLowerCase())
    }
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))

        const response = await fetch(`${API_URL}/api/history/stats`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`
          }
        })

        const data = await response.json()

        if (response.ok) {
          setStats({
            dayStreak: data.dayStreak || 0,
            totalWorkouts: data.totalWorkouts || 0,
            totalReps: data.totalReps || 0,
            totalCalories: data.totalCalories || 0
          })
        }
      } catch (error) {
        console.log(error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))

        const response = await fetch(`${API_URL}/api/history/recent`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`
          }
        })

        const data = await response.json()

        if (response.ok && Array.isArray(data)) {
          setRecentActivity(data.slice(0, 3))
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchRecentActivity()
  }, [])

 

  const dailyPlans = [
    {
      title: 'Recovery & Stretch',
      meta: '20 min • Beginner',
      image: `/images/stretch-${gender}.jpg`
    },
    {
      title: 'Lower Body Strength',
      meta: '30 min • Intermediate',
      image: `/images/lowerbody-${gender}.jpg`
    },
    {
      title: 'Upper Body Power',
      meta: '30 min • Intermediate',
      image: `/images/upperbody-${gender}.jpg`
    },
    {
      title: 'Core Stability',
      meta: '25 min • Beginner',
      image: `/images/core-${gender}.jpg`
    },
    {
      title: 'Mobility Training',
      meta: '25 min • Beginner',
      image: `/images/mobility-${gender}.jpg`
    },
    {
      title: 'Cardio Burn',
      meta: '35 min • Intermediate',
      image: `/images/cardio-${gender}.jpg`
    },
    {
      title: 'Full Body Training',
      meta: '40 min • Intermediate',
      image: '/images/hero2.jpg'
    }
  ]

  const todayPlan = dailyPlans[new Date().getDay()]

  const workoutCategories = [
    {
      title: 'Strength',
      route: '/workouts/category/strength',
      image: `/images/lowerbody-${gender}.jpg`,
      icon: <Dumbbell size={21} />
    },
    {
      title: 'Mobility',
      route: '/workouts/category/mobility',
      image: `/images/mobility-${gender}.jpg`,
      icon: <Activity size={21} />
    },
    {
      title: 'Cardio',
      route: '/workouts/category/cardio',
      image: `/images/cardio-${gender}.jpg`,
      icon: <Zap size={21} />
    },
    {
      title: 'Core',
      route: '/workouts/category/core',
      image: `/images/core-${gender}.jpg`,
      icon: <Target size={21} />
    }
  ]

  const formatExerciseName = (exercise) => {
    if (exercise === 'squat') return 'Squat Workout'

    if (
      exercise === 'pushup' ||
      exercise === 'push-up' ||
      exercise === 'push-ups'
    ) {
      return 'Push-up Workout'
    }

    return exercise
      ? exercise.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
      : 'Workout Session'
  }

  const formatActivityTime = (index) => {
    if (index === 0) return 'Today'
    if (index === 1) return 'Yesterday'
    return `${index + 1} days ago`
  }

  const fitnessScore = Math.min(
    100,
    Math.round(
      (stats.totalWorkouts * 6) +
      (stats.dayStreak * 5) +
      Math.min(stats.totalReps / 20, 30)
    )
  )
  useEffect(() => {
  if (darkMode) {
    document.body.classList.add('dark-theme')
    localStorage.setItem('themeMode', 'dark')
  } else {
    document.body.classList.remove('dark-theme')
    localStorage.setItem('themeMode', 'light')
  }
}, [darkMode])

const toggleTheme = () => {
  setDarkMode((prev) => !prev)
}

  if (showIntro) {
    return (
      <div className="intro-screen">
        <div className="intro-collage">
          <img src="/images/motivation1.jpg" alt="" />
          <img src="/images/motivation2.jpg" alt="" />
          <img src="/images/motivation3.jpg" alt="" />
        </div>

        <div className="intro-overlay">
          <p>AI FITNESS SYSTEM</p>

          <h1>
            TRAIN
            <br />
            WITH
            <br />
            PURPOSE
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className="home-clean-page">

      <button
        className="home-clean-menu-btn"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      <div
        className={
          sidebarOpen
            ? 'home-clean-sidebar-overlay active'
            : 'home-clean-sidebar-overlay'
        }
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={sidebarOpen ? 'home-clean-side-panel open' : 'home-clean-side-panel'}>
        <div className="home-clean-side-head">
          <div className="home-clean-side-brand">
            <Dumbbell size={24} />
            <h2>FitFusion</h2>
          </div>

          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="home-clean-side-nav">
          <Link to="/home" className="active" onClick={() => setSidebarOpen(false)}>
            <HomeIcon size={20} />
            Home
          </Link>

          <Link to="/workouts" onClick={() => setSidebarOpen(false)}>
            <Dumbbell size={20} />
            Workouts
          </Link>

          <Link to="/diet" onClick={() => setSidebarOpen(false)}>
            <Apple size={20} />
            Diet
          </Link>

          <Link to="/progress" onClick={() => setSidebarOpen(false)}>
            <BarChart3 size={20} />
            Progress
          </Link>

          <Link to="/ai-coach" onClick={() => setSidebarOpen(false)}>
            <Bot size={20} />
            AI Coach
          </Link>

          <Link to="/workout-history" onClick={() => setSidebarOpen(false)}>
            <History size={20} />
            History
          </Link>

          <Link to="/profile" onClick={() => setSidebarOpen(false)}>
            <Settings size={20} />
            Profile
          </Link>

          {isAdmin && (
  <Link to="/admin" onClick={() => setSidebarOpen(false)}>
    <Settings size={20} />
    Admin Dashboard
  </Link>
)}
        </nav>

        <div className="home-clean-side-profile">
          <UserRound size={22} />
          <div>
            <h4>Welcome Back</h4>
            <p>Beginner Level</p>
          </div>
        </div>
      </aside>

      <section className="home-clean-hero">

        <div className="home-clean-hero-actions">
  <button
    className="home-clean-theme-btn"
    onClick={toggleTheme}
  >
    {darkMode ? 'Light' : 'Dark'}
  </button>

  <div className="home-clean-bell-wrap">
    <NotificationBell />
  </div>

  <button
    className="home-clean-settings-btn"
    onClick={() => navigate('/profile')}
  >
    <Settings size={23} />
  </button>
</div>

        <div className="home-clean-hero-left">
          <span className="home-clean-label">FITFUSION HOME</span>

          <h1>
            Train with purpose,
            <br />
            progress with clarity.
          </h1>

          <p>
            Your workout stats, AI guidance, nutrition preview, and progress
            tracking are brought together in one clean dashboard.
          </p>

          <div className="home-clean-hero-buttons">
            <Link to="/workouts">
              Start Training
              <ArrowRight size={17} />
            </Link>

            <Link to="/progress">
              View Progress
            </Link>
          </div>

          <div className="home-clean-stats-row">
            <div>
              <Flame size={20} />
              <section>
                <small>Day Streak</small>
                <strong>{statsLoading ? '--' : stats.dayStreak}</strong>
              </section>
            </div>

            <div>
              <Dumbbell size={20} />
              <section>
                <small>Workouts</small>
                <strong>{statsLoading ? '--' : stats.totalWorkouts}</strong>
              </section>
            </div>

            <div>
              <Repeat size={20} />
              <section>
                <small>Total Reps</small>
                <strong>{statsLoading ? '--' : stats.totalReps}</strong>
              </section>
            </div>

            <div>
              <Zap size={20} />
              <section>
                <small>Calories</small>
                <strong>{statsLoading ? '--' : stats.totalCalories}</strong>
              </section>
            </div>
          </div>
        </div>

        <div className="home-clean-score">
          <h3>{statsLoading ? '--' : fitnessScore}<span>%</span></h3>
          <p>Fitness Score</p>
        </div>

        <img
          className="home-clean-person"
          src="/images/aicoach-girl-cutout.png"
          alt="FitFusion hero"
        />

        <div className="home-clean-hero-text">
          <h2>
            Smarter
            <br />
            Fitness
            <br />
            <b>Every Day</b>
          </h2>

          <p>
            AI-supported workouts, nutrition, and progress guidance.
          </p>
        </div>
      </section>

      <main className="home-clean-main">

        <section className="home-premium-card-row">

  <Link to="/ai-coach" className="home-premium-card ai">
    <div className="home-premium-card-top">
      <span>
        <Bot size={20} />
      </span>
      <small>AI REPORT</small>
    </div>

    <h3>AI Coach Insight</h3>

    <p>
      Smart guidance based on your workout progress, recovery and consistency.
    </p>

    

    <div className="home-premium-card-action">
      View AI Report
      <ArrowRight size={14} />
    </div>
  </Link>

  <Link to="/workouts" className="home-premium-card plan">
    <div className="home-premium-card-top">
      <span>
        <CalendarDays size={20} />
      </span>
      <small>TODAY</small>
    </div>

    <div className="home-premium-image-layout">
      <img src={todayPlan.image} alt={todayPlan.title} />

      <div>
        <h3>{todayPlan.title}</h3>
        <p>{todayPlan.meta}</p>

        <div className="home-premium-card-action">
          View Plan
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  </Link>

  <Link to="/diet" className="home-premium-card nutrition">
    <div className="home-premium-card-top">
      <span>
        <Apple size={20} />
      </span>
      <small>NUTRITION</small>
    </div>

    <div className="home-premium-image-layout">
      <img src="/images/nutrition-summary.jpg" alt="Nutrition" />

      <div>
        <h3>Nutrition Preview</h3>
        <p>Protein meals, hydration and balanced food support.</p>

        <div className="home-premium-card-action">
          View Nutrition
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  </Link>

  <Link to="/workout-history" className="home-premium-card recent">
    <div className="home-premium-card-top">
      <span>
        <Clock3 size={20} />
      </span>
      <small>RECENT</small>
    </div>

    <h3>Recent Activity</h3>

    <div className="home-premium-recent-list">
      {(recentActivity.length > 0 ? recentActivity : [1, 2, 3]).map((item, index) => (
        <div className="home-premium-recent-item" key={index}>
          <div>
            <h4>
              {typeof item === 'number'
                ? index === 0
                  ? 'Upper Body Strength'
                  : index === 1
                    ? 'Cardio Burn'
                    : 'Core Stability'
                : formatExerciseName(item.exercise)}
            </h4>

            <p>
              {typeof item === 'number'
                ? formatActivityTime(index)
                : `${formatActivityTime(index)} • ${item.reps_completed || 0} reps`}
            </p>
          </div>

          <CheckCircle size={15} />
        </div>
      ))}
    </div>
  </Link>

</section>
 <section className="home-lower-v2">

  <div className="home-lower-v2-workouts">
    <div className="home-lower-v2-head">
      <div>
        <small>TRAINING LIBRARY</small>
        <h2>Choose your workout mode</h2>
        <p>Focused categories to start training faster.</p>
      </div>

      <Link to="/workouts">
        View All
        <ArrowRight size={15} />
      </Link>
    </div>

    <div className="home-lower-v2-workout-grid">
      {workoutCategories.map((item, index) => (
        <Link
          to={item.route}
          className="home-lower-v2-workout-tile"
          key={index}
          style={{
            backgroundImage: `linear-gradient(to top, rgba(5, 9, 5, 0.86), rgba(5, 9, 5, 0.22)), url(${item.image})`
          }}
        >
          <span>{item.icon}</span>

          <div>
            <h3>{item.title}</h3>
            <p>
              {index === 0
                ? 'Build strength'
                : index === 1
                  ? 'Move better'
                  : index === 2
                    ? 'Burn calories'
                    : 'Core control'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>

  <div className="home-lower-v2-smart">

    <Link to="/progress" className="home-lower-v2-progress">
      <div className="home-lower-v2-card-head">
        <span>
          <BarChart3 size={20} />
        </span>

        <div>
          <small>PROGRESS SNAPSHOT</small>
          <h3>Weekly rhythm</h3>
        </div>
      </div>

      <div className="home-lower-v2-progress-content">
        <section>
          <small>Workouts</small>
          <strong>{statsLoading ? '--' : stats.totalWorkouts}</strong>
        </section>

        <section>
          <small>Calories</small>
          <strong>{statsLoading ? '--' : stats.totalCalories}</strong>
        </section>

        <div className="home-lower-v2-bars">
          <i style={{ height: '45%' }}></i>
          <i style={{ height: '62%' }}></i>
          <i style={{ height: '52%' }}></i>
          <i style={{ height: '78%' }}></i>
          <i style={{ height: '58%' }}></i>
        </div>
      </div>
    </Link>

    <Link to="/ai-coach" className="home-lower-v2-wellness-card">
  <div className="home-lower-v2-wellness-image">
    <img src="/images/protein-meal.jpg" alt="Nutrition and recovery" />
  </div>

  <div className="home-lower-v2-wellness-content">
    <small>NUTRITION + RECOVERY</small>

    <h3>Fuel well, recover smarter</h3>

    <p>
      Balanced meals, hydration, and proper rest help your body perform better in the next workout.
    </p>

    <div className="home-lower-v2-wellness-tags">
      <span>Protein</span>
      <span>Hydration</span>
      <span>Rest</span>
    </div>
  </div>

  <div className="home-lower-v2-wellness-icon">
    <Activity size={22} />
  </div>
</Link>
  </div>

</section>

<section className="home-lower-v2-actions">
  <Link to="/diet">
    <Salad size={20} />
    <span>Meal Ideas</span>
  </Link>

  <Link to="/ai-coach">
    <Activity size={20} />
    <span>Recovery</span>
  </Link>

  <Link to="/workouts">
    <Dumbbell size={20} />
    <span>Workout Advice</span>
  </Link>

  <Link to="/progress">
    <BarChart3 size={20} />
    <span>Progress</span>
  </Link>
</section>
      </main>
    </div>
  )
}

export default Home