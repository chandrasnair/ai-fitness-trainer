import { useEffect, useState } from 'react'
import NotificationBell from '../components/NotificationBell'

import {
  Home as HomeIcon,
  Dumbbell,
  Apple,
  BarChart3,
  Settings,
  Bot,
  Plus,
  Flame,
  Repeat,
  Bell,
  Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'

import '../index.css'

const heroSlides = [
  {
    title: 'AI Powered Training',
    subtitle: 'Real-time posture correction, rep tracking, and smart coaching.',
    image: '/images/hero1.jpg'
  },
  {
    title: 'Push Beyond Limits',
    subtitle: 'Track progress, stay consistent, and build strength every day.',
    image: '/images/hero2.jpg'
  },
  {
    title: 'Train. Eat. Recover.',
    subtitle: 'Fitness guidance, healthy food habits, and progress analytics together.',
    image: '/images/hero3.jpg'
  },
  {
    title: 'Your Smart Fitness Space',
    subtitle: 'Personalized workouts designed around your level and goals.',
    image: '/images/hero4.jpg'
  }
]

function Home() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [gender, setGender] = useState('male')
useEffect(() => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  if (userInfo?.gender) {
    setGender(userInfo.gender.toLowerCase())
  }
}, [])

  const [showAllWorkouts, setShowAllWorkouts] = useState(false)
  
  const [theme, setTheme] = useState(
  localStorage.getItem('themeMode') || 'light'
)
useEffect(() => {
  localStorage.setItem('themeMode', theme)

  if (theme === 'dark') {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
}, [theme])
  const [showIntro, setShowIntro] = useState(true)
  const userInfo = JSON.parse(
  localStorage.getItem('userInfo')
)

const [showNotifications, setShowNotifications] = useState(false)

const genderValue = userInfo?.gender?.toLowerCase()

const profileImage = userInfo?.profileImage
  ? `http://localhost:5000${userInfo.profileImage}`
  : genderValue === 'female'
    ? '/images/default-female.jpg'
    : genderValue === 'male'
      ? '/images/default-male.jpg'
      : '/images/default-female.jpg'

const [recentActivity, setRecentActivity] = useState([])
useEffect(() => {
  const fetchRecentActivity = async () => {
    try {
     const userInfo = JSON.parse(localStorage.getItem('userInfo'))

const response = await fetch(
  'http://localhost:5000/api/history/recent',
  {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`
    }
  }
)
      const data = await response.json()
      setRecentActivity(data)
    } catch (error) {
      console.log(error)
    }
  }

  fetchRecentActivity()
}, [])

const [stats, setStats] = useState({
  dayStreak: 0,
  totalWorkouts: 0,
  totalReps: 0,
  totalCalories: 0,
})

const [statsLoading, setStatsLoading] = useState(true)

useEffect(() => {
  const fetchStats = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))

const response = await fetch(
  'http://localhost:5000/api/history/stats',
  {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`
    }
  }
)
      const data = await response.json()

      setStats({
        dayStreak: data.dayStreak || 0,
        totalWorkouts: data.totalWorkouts || 0,
        totalReps: data.totalReps || 0,
        totalCalories: data.totalCalories || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  fetchStats()
}, [])



useEffect(() => {
  const introTimer = setTimeout(() => {
    setShowIntro(false)
  }, 3000)

  return () => clearTimeout(introTimer)
}, [])
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[slideIndex]

  const workouts = [
    ['Lower Body', `/images/lowerbody-${gender}.jpg`],
    ['Upper Body', `/images/upperbody-${gender}.jpg`],
    ['Core / Abs', `/images/core-${gender}.jpg`],
    ['Mobility', `/images/mobility-${gender}.jpg`],
    ['Stretch', `/images/stretch-${gender}.jpg`],
    ['Cardio', `/images/cardio-${gender}.jpg`]
  ]
  const visibleWorkouts = showAllWorkouts
  ? workouts
  : workouts.slice(0, 4)

  const dailyPlans = [
  {
    title: 'Recovery & Stretch',
    description: 'Light stretching and breathing-focused mobility',
    meta: '20 min · Beginner',
    image: `/images/stretch-${gender}.jpg`
  },
  {
    title: 'Lower Body Strength',
    description: 'Squats, lunges, and controlled leg movement',
    meta: '30 min · Intermediate',
    image: `/images/lowerbody-${gender}.jpg`
  },
  {
    title: 'Upper Body Power',
    description: 'Push-ups, shoulder control, and arm strength',
    meta: '30 min · Intermediate',
    image: `/images/upperbody-${gender}.jpg`
  },
  {
    title: 'Core Stability',
    description: 'Abs, plank control, and posture balance',
    meta: '25 min · Beginner',
    image: `/images/core-${gender}.jpg`
  },
  {
    title: 'Mobility Training',
    description: 'Improve flexibility, balance, and joint movement',
    meta: '25 min · Beginner',
    image: `/images/mobility-${gender}.jpg`
  },
  {
    title: 'Cardio Burn',
    description: 'Fast movement, stamina training, and calorie burn',
    meta: '35 min · Intermediate',
    image: `/images/cardio-${gender}.jpg`
  },
  {
    title: 'Full Body Training',
    description: 'Balanced strength workout for the full body',
    meta: '40 min · Intermediate',
    image: `/images/hero2.jpg`
  }
]

const todayIndex = new Date().getDay()
const todayPlan = dailyPlans[todayIndex]


if (showIntro) {

  return (

    <div className="intro-screen">

      <div className="intro-collage">

        <img
          src="/images/motivation1.jpg"
          alt=""
        />

        <img
          src="/images/motivation2.jpg"
          alt=""
        />

        <img
          src="/images/motivation3.jpg"
          alt=""
        />

      </div>

      <div className="intro-overlay">

        <p>
          AI FITNESS SYSTEM
        </p>

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
    <div className={`dashboard ${theme}`}>
    <div className="ambient ambient-two"></div>
    <div className="ambient ambient-three"></div>
      <aside className="sidebar">
        <h2>AI Fitness</h2>

        <nav>

  <Link to="/">
    <span className="active">
      <HomeIcon size={18} /> Home
    </span>
  </Link>

  <Link to="/workouts">
    <span>
      <Dumbbell size={18} /> Workouts
    </span>
  </Link>

  <Link to="/diet">
    <span>
      <Apple size={18} /> Diet
    </span>
  </Link>

  <Link to="/progress">
    <span>
      <BarChart3 size={18} /> Progress
    </span>
  </Link>

  <Link to="/ai-coach">
    <span>
      <Bot size={18} /> AI Coach
    </span>
  </Link>

  <Link to="/profile">
    <span>
      <Settings size={18} /> Profile
    </span>
  </Link>

</nav>

        <div className="profile-box">
  <img src={profileImage} alt="Profile" />
          <div>
            <h4>Welcome Back</h4>
            <p>Level: Beginner</p>
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <input placeholder="Search workouts, recipes, progress..." />

          

<div className="top-actions">

  <NotificationBell />

  <Link to="/profile">
    <button className="icon-btn">
      <Settings size={19} />
    </button>
  </Link>

</div>

        <button
  className="theme-toggle"
  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
>
  {theme === 'light' ? 'Dark' : 'Light'}
</button>


        </header>

        <section className="hero-editorial">
   

  <div
    className="hero-background"
    style={{
      backgroundImage: `url(${slide.image})`
    }}
  >

    <div className="hero-dark-overlay"></div>

    <div className="hero-content">

      <p className="hero-mini">
        AI FITNESS SYSTEM
      </p>

      <h1>
        TRAIN
        <br />
        WITH
        <br />
        PURPOSE
      </h1>

      <div className="hero-side-text">
        MOTION
        <br />
        FITNESS
        <br />
        TIME
      </div>

      <p className="hero-description">
        Smart posture tracking, AI coaching,
        progress analytics, and premium fitness
        guidance built into one ecosystem.
      </p>

      <Link
  to="/workouts"
  className="hero-btn"
>
  START TRAINING
</Link>

      <div className="dots editorial-dots">

        {heroSlides.map((_, index) => (

          <span
            key={index}
            className={
              index === slideIndex
                ? 'dot active'
                : 'dot'
            }
          ></span>

        ))}

      </div>
    

    </div>

  </div>

</section>
       <section className="floating-stats">

  <div className="float-stat fire">
    <div className="stat-icon">
      <Flame size={20} />
    </div>

    <div>
      <h3>{statsLoading ? '--' : stats.dayStreak}</h3>
      <p>Day Streak</p>
    </div>
  </div>

  <div className="float-stat lift">
    <div className="stat-icon">
      <Dumbbell size={20} />
    </div>

    <div>
      <h3>{statsLoading ? '--' : stats.totalWorkouts}</h3>
      <p>Workouts</p>
    </div>
  </div>

  <div className="float-stat reps">
    <div className="stat-icon">
      <Repeat size={20} />
    </div>

    <div>
      <h3>{statsLoading ? '--' : stats.totalReps}</h3>
      <p>Total Reps</p>
    </div>
  </div>

  <div className="float-stat burn">
    <div className="stat-icon">
      <Zap size={20} />
    </div>

    <div>
      <h3>{statsLoading ? '--' : stats.totalCalories}</h3>
      <p>Calories</p>
    </div>
  </div>

</section>
<section className="dashboard-main-grid">

  <div
    className="ai-feature-card"
    style={{
      backgroundImage:
        "linear-gradient(to right, rgba(5,12,5,.92), rgba(5,12,5,.38)), url('/images/ai-coach.jpg')"
    }}
  >
    <span>AI COACH INSIGHT</span>

    <h2>
      Your form consistency
      is improving.
    </h2>

    <p>
      Based on recent sessions, focus on controlled movement and deeper squat range today.
    </p>

    <Link
  to="/ai-coach"
  className="ai-report-btn"
>
  View AI Report
</Link>
  </div>

  <div className="middle-cards">

    <div className="side-plan-card image-plan-card">
  <span>TODAY'S PLAN</span>

  <div className="plan-content">
    <div>
      <h3>{todayPlan.title}</h3>
      <p>{todayPlan.description}</p>
      <small>{todayPlan.meta}</small>
    </div>

    <img src={todayPlan.image} alt={todayPlan.title} />
  </div>
</div>

    <div className="side-plan-card image-plan-card nutrition-preview">
      <span>NUTRITION</span>

      <div className="plan-content">
        <div>
          <h3>Protein Meals</h3>
          <p>Recipes and food videos</p>
        </div>

        <img src="/images/nutrition-summary.jpg" alt="" />
      </div>
    </div>

  </div>

  <div className="recent-activity-card">

  <div className="recent-header">
    <div>
      <span>WORKOUT TRACKER</span>
      <h3>Recent Activity</h3>
    </div>

    <Link
      to="/workout-history"
      className="view-all-btn"
    >
      View All
    </Link>
  </div>

  <div className="recent-list">
    {recentActivity.map((item, index) => (
      <div
        className="recent-item"
        key={index}
      >
        <div className="recent-item-left">
          <h4>
            {item.exercise === 'squat'
              ? ' Squat Workout'
              : ' Push-up Workout'}
          </h4>

          <p>
            {item.reps_completed} reps •{' '}
            {item.calories_burned || 0} calories
          </p>
        </div>

        <span className="recent-date">
          {item.date_time?.split(' ')[0]}
        </span>
      </div>
    ))}
  </div>

</div>

</section>

        <section className="section-block">
          <div className="section-head">
            <h2>Workout Categories</h2>
           <Link to="/workouts" className="view-all-link">
  View all
</Link>
          </div>

          <div className="workout-layout">
<Link
  to="/workouts/category/strength"
  className="workout-large"
  style={{
    backgroundImage:
      `linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/lowerbody-${gender}.jpg')`
  }}
>
    <div>
      <h3>Strength Training</h3>
      <span>AI Guided</span>
    </div>
   </Link>

  <Link
  to="/workouts/category/mobility"
  className="workout-small"

    style={{
      backgroundImage:
        `linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/mobility-${gender}.jpg')`
    }}
  >
    <div>
      <h3>Yoga & Mobility</h3>
      <span>AI Guided</span>
    </div>
  </Link>

  <div className="workout-stack">

    <Link
  to="/workouts/category/cardio"
  className="workout-small"

      style={{
        backgroundImage:
          `linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/cardio-${gender}.jpg')`
      }}
    >
      <div>
        <h3>HIIT Cardio</h3>
        <span>AI Guided</span>
      </div>
    </Link>

    <Link
  to="/workouts/category/core"
  className="workout-tall"

      style={{
        backgroundImage:
          `linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/core-${gender}.jpg')`
      }}
    >
      <div>
        <h3>Core Workouts</h3>
        <span>AI Guided</span>
      </div>
    </Link>

  </div>

  <Link
  to="/workouts/category/power"
  className="workout-small"

    style={{
      backgroundImage:
        `linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/upperbody-${gender}.jpg')`
    }}
  >
    <div>
      <h3>Power Lifting</h3>
      <span>AI Guided</span>
    </div>
  </Link>

</div>
        </section>

 <section className="two-column">
          <div className="diet-card">
            <div>
              <h2>Healthy Food Guide</h2>
              <p>
                Discover healthy recipes, protein meals, smoothies, and balanced
                food habits for your fitness goals.
              </p>
              <Link
  to="/diet"
  className="explore-diet-btn"
>
  Explore Diet
</Link>
            </div>

            <img src="/images/healthy-food.jpg" alt="Healthy food" />
          </div>

          <Link
  to="/progress"
  className="analytics-card"
>
            <h2>Progress Analytics</h2>
            <p>Weekly improvement preview</p>

            <div className="bars">
              <span style={{ height: '42%' }}></span>
              <span style={{ height: '60%' }}></span>
              <span style={{ height: '35%' }}></span>
              <span style={{ height: '75%' }}></span>
              <span style={{ height: '55%' }}></span>
              <span style={{ height: '88%' }}></span>
            </div>
          </Link>
        </section>
        <section className="recipe-row">
          <Link to="/diet" className="recipe-card">
  <img src="/images/protein-meal.jpg" alt="Protein meal" />
  <h3>Protein Meals</h3>
</Link>

<Link to="/diet" className="recipe-card">
  <img src="/images/smoothie.jpg" alt="Smoothie" />
  <h3>Smoothies</h3>
</Link>

<Link to="/diet" className="recipe-card">
  <img src="/images/salad.jpg" alt="Salad" />
  <h3>Clean Eating</h3>
</Link>
        </section>

      </main>

      <nav className="bottom-nav">
  <Link to="/" className="nav-active">
    <HomeIcon size={18} /> Home
  </Link>

  <Link to="/workouts">
    <Dumbbell size={18} /> Workouts
  </Link>

  <button className="nav-action">
    <Plus size={30} />
  </button>

  <Link to="/diet">
    <Apple size={18} /> Diet
  </Link>

  <Link to="/progress">
    <BarChart3 size={18} /> Progress
  </Link>
</nav>
    </div>
  )
}

export default Home