import { useEffect, useState } from 'react'

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
  const [showAllWorkouts, setShowAllWorkouts] = useState(false)
  const [theme, setTheme] = useState('light')
  const [showIntro, setShowIntro] = useState(true)

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
          <img src="/images/profile.jpg" alt="Profile" />
          <div>
            <h4>Welcome Back</h4>
            <p>Level: Beginner</p>
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <input placeholder="Search workouts, recipes, progress..." />

          <div className="gender-toggle">
            <button
              className={gender === 'male' ? 'selected' : ''}
              onClick={() => setGender('male')}
            >
              Male
            </button>

            <button
              className={gender === 'female' ? 'selected' : ''}
              onClick={() => setGender('female')}
            >
              Female
            </button>
          </div>

<div className="top-actions">

  <button className="icon-btn">
    <Bell size={19} />
  </button>

  <button className="icon-btn">
    <Settings size={19} />
  </button>

</div>

        <button
  className="theme-toggle"
  onClick={() => {
    console.log('theme clicked', theme)
    setTheme(theme === 'light' ? 'dark' : 'light')
  }}
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

      <button className="hero-btn">
        START TRAINING
      </button>

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
      <h3>7</h3>
      <p>Day Streak</p>
    </div>

  </div>

  <div className="float-stat lift">

    <div className="stat-icon">
      <Dumbbell size={20} />
    </div>

    <div>
      <h3>24</h3>
      <p>Workouts</p>
    </div>

  </div>

  <div className="float-stat reps">

    <div className="stat-icon">
      <Repeat size={20} />
    </div>

    <div>
      <h3>860</h3>
      <p>Total Reps</p>
    </div>

  </div>

  <div className="float-stat burn">

    <div className="stat-icon">
      <Zap size={20} />
    </div>

    <div>
      <h3>320</h3>
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

    <button>
      View AI Report
    </button>
  </div>

  <div className="middle-cards">

    <div className="side-plan-card image-plan-card">
      <span>TODAY'S PLAN</span>

      <div className="plan-content">
        <div>
          <h3>Lower Body Strength</h3>
          <p>Squats and controlled reps</p>
          <small>30 min · Intermediate</small>
        </div>

        <img src="/images/today-plan.jpg" alt="" />
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

  <div className="recent-card">
    <span>RECENT ACTIVITY</span>

    <div>
      <h4>Upper Body</h4>
      <p>May 24, 2026 · 320 Cal</p>
    </div>

    <div>
      <h4>HIIT Cardio</h4>
      <p>May 23, 2026 · 280 Cal</p>
    </div>

    <div>
      <h4>Lower Body</h4>
      <p>May 22, 2026 · 350 Cal</p>
    </div>

    <b>View all activity →</b>
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

  <div
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
  </div>

  <div
    className="workout-large"
    style={{
      backgroundImage:
        `linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/mobility-${gender}.jpg')`
    }}
  >
    <div>
      <h3>Yoga & Mobility</h3>
      <span>AI Guided</span>
    </div>
  </div>

  <div className="workout-stack">

    <div
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
    </div>

    <div
      className="workout-small"
      style={{
        backgroundImage:
          `linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/core-${gender}.jpg')`
      }}
    >
      <div>
        <h3>Core Workouts</h3>
        <span>AI Guided</span>
      </div>
    </div>

  </div>

  <div
    className="workout-tall"
    style={{
      backgroundImage:
        `linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/upperbody-${gender}.jpg')`
    }}
  >
    <div>
      <h3>Power Lifting</h3>
      <span>AI Guided</span>
    </div>
  </div>

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
              <button>Explore Diet</button>
            </div>

            <img src="/images/healthy-food.jpg" alt="Healthy food" />
          </div>

          <div className="analytics-card">
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
          </div>
        </section>
        <section className="recipe-row">
          <div>
            <img src="/images/protein-meal.jpg" alt="Protein meal" />
            <h3>Protein Meals</h3>
          </div>

          <div>
            <img src="/images/smoothie.jpg" alt="Smoothie" />
            <h3>Smoothies</h3>
          </div>

          <div>
            <img src="/images/salad.jpg" alt="Salad" />
            <h3>Clean Eating</h3>
          </div>
        </section>

      </main>

      <nav className="bottom-nav">
  <span className="nav-active"><HomeIcon size={18} /> Home</span>
  <span><Dumbbell size={18} /> Workouts</span>

  <button className="nav-action">
    <Plus size={30} />
  </button>

  <span><Apple size={18} /> Diet</span>
  <span><BarChart3 size={18} /> Progress</span>
</nav>
    </div>
  )
}

export default Home