import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NotificationBell from '../components/NotificationBell'
import { API_URL } from '../api'

import {
  Brain,
  HeartPulse,
  Flame,
  Dumbbell,
  Activity,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  TrendingUp,
  Settings,
  Target,
  ChevronRight,
  BarChart3,
  Zap,
  Timer,
  StretchHorizontal,
  Footprints,
  RefreshCw
} from 'lucide-react'

function Workouts() {
  const navigate = useNavigate()

  const [gender, setGender] = useState('male')

  const [workoutStats, setWorkoutStats] = useState({
    totalCalories: 0,
    totalReps: 0,
    totalWorkouts: 0,
    dayStreak: 0,
    aiScore: 0,
    recovery: 0,
    strengthGrowth: 0,
    weeklySessions: 0,
    nextFocus: 'Start training to generate focus'
  })
  useEffect(() => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const loggedUserGender =
    userInfo?.gender ||
    userInfo?.user?.gender ||
    userInfo?.profile?.gender ||
    'male'

  setGender(loggedUserGender.toLowerCase())
}, [])

  const workoutHero =
    gender === 'male'
      ? '/images/workout-hero-male.jpg'
      : '/images/workout-hero-female.jpg'

  const handleStartTraining = () => {
    const section = document.querySelector('.workout-pro-category-section')

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const calculateAiScore = (data) => {
    if (!data.totalWorkouts || data.totalWorkouts === 0) {
      return 0
    }

    let score = 50

    if (data.totalWorkouts >= 5) score += 10
    if (data.totalWorkouts >= 10) score += 10
    if (data.dayStreak >= 3) score += 10
    if (data.dayStreak >= 7) score += 10
    if (data.totalCalories >= 1000) score += 10

    return Math.min(score, 100)
  }

  useEffect(() => {
    const fetchWorkoutStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))

        const response = await fetch(
          `${API_URL}/api/history/stats`,
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
          const aiScore = calculateAiScore(data)

          setWorkoutStats({
            totalCalories: data.totalCalories || 0,
            totalReps: data.totalReps || 0,
            totalWorkouts: data.totalWorkouts || 0,
            dayStreak: data.dayStreak || 0,
            aiScore,
            recovery: aiScore >= 80 ? 87 : aiScore >= 60 ? 72 : 50,
            strengthGrowth:
              data.totalWorkouts > 0
                ? Math.min(data.totalWorkouts * 6, 100)
                : 0,
            weeklySessions: data.totalWorkouts || 0,
            nextFocus:
              aiScore >= 80
                ? 'Advanced controlled movement'
                : aiScore >= 60
                  ? 'Controlled lower-body movement'
                  : 'Basic form and consistency'
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchWorkoutStats()
  }, [])

  const categoryCards = [
  {
    title: 'Lower Body',
    label: 'Strength Zone',
    text: 'Squats, leg control, glutes and stability.',
    route: '/workouts/category/strength',
    image: `/images/lowerbody-${gender}.jpg`,
    icon: <Footprints size={20} />
  },
  {
    title: 'Upper Body',
    label: 'Power Zone',
    text: 'Push-ups, shoulders, arms and posture control.',
    route: '/workouts/category/power',
    image: `/images/upperbody-${gender}.jpg`,
    icon: <Dumbbell size={20} />
  },
  {
    title: 'Core',
    label: 'Balance Zone',
    text: 'Core strength, stability and controlled movement.',
    route: '/workouts/category/core',
    image: `/images/core-${gender}.jpg`,
    icon: <Target size={20} />
  },
  {
    title: 'Cardio',
    label: 'Energy Zone',
    text: 'Endurance, fat burn and active conditioning.',
    route: '/workouts/category/cardio',
    image: `/images/cardio-${gender}.jpg`,
    icon: <Flame size={20} />
  },
  {
    title: 'Recovery',
    label: 'Reset Zone',
    text: 'Light movement, relaxation and muscle repair.',
    route: '/workouts/category/recovery',
    image: `/images/recovery-${gender}.jpg`,
    icon: <RefreshCw size={20} />
  },
  {
    title: 'Mobility',
    label: 'Move Better',
    text: 'Flexible movement and joint control.',
    route: '/workouts/category/mobility',
    image: `/images/mobility-${gender}.jpg`,
    icon: <Activity size={20} />
  },
  {
    title: 'Stretch',
    label: 'Cooldown',
    text: 'Release tension and improve flexibility.',
    route: '/workouts/category/stretch',
    image: `/images/stretch-${gender}.jpg`,
    icon: <StretchHorizontal size={20} />
  }
]
  const snapshotItems = [
    {
      icon: <Sparkles size={21} />,
      title: 'Best For Today',
      value: workoutStats.nextFocus,
      tone: 'olive'
    },
    {
      icon: <BarChart3 size={21} />,
      title: 'Training Load',
      value:
        workoutStats.totalReps >= 300
          ? 'High'
          : workoutStats.totalReps >= 100
            ? 'Moderate'
            : 'Light',
      tone: 'blue'
    },
    {
      icon: <ShieldCheck size={21} />,
      title: 'Movement Quality',
      value:
        workoutStats.aiScore >= 80
          ? 'Strong'
          : workoutStats.aiScore >= 60
            ? 'Improving'
            : 'Building',
      tone: 'green'
    },
    {
      icon: <Target size={21} />,
      title: 'Next Milestone',
      value:
        workoutStats.totalWorkouts >= 5
          ? 'Build consistency'
          : 'Complete 5 sessions',
      tone: 'gold'
    }
  ]

  return (
    <div className="workout-pro-page">

      <header className="workout-pro-header">
        <div className="workout-pro-title-area">
          <div className="workout-pro-main-icon">
            <Dumbbell size={28} />
          </div>

          <div>
            <span>AI FITNESS SYSTEM</span>
            <h1>Workouts</h1>
            <p>Choose your training zone and start AI guided movement</p>
          </div>
        </div>

        <div className="workout-pro-actions">

          <div className="workout-pro-action-item">
            <div className="workout-pro-action-circle">
              <NotificationBell />
            </div>
            <small>Notifications</small>
          </div>

          <div
            className="workout-pro-action-item"
            onClick={() => navigate('/profile')}
          >
            <button className="workout-pro-action-circle">
              <Settings size={21} />
            </button>
            <small>Settings</small>
          </div>

        </div>
      </header>

      <section className="workout-pro-top-grid">

        <div className="workout-pro-left-stack">

          <div className="workout-pro-card workout-pro-control-card">

            <div className="workout-pro-section-label">
              <div>
                <Brain size={18} />
              </div>
              <span>Training Control Center</span>
            </div>

            <h2>
              Start strong with
              <br />
              guided movement.
            </h2>

            <p>
              Your workout system uses AI form feedback, rep tracking,
              and progress data to help you train with better control.
            </p>

            <div className="workout-pro-control-body">

              <div className="workout-pro-score-circle">
                <svg viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="58" />
                  <circle
                    cx="75"
                    cy="75"
                    r="58"
                    pathLength="100"
                    strokeDasharray={`${workoutStats.aiScore} 100`}
                  />
                </svg>

                <div>
                  <span>AI Form</span>
                  <strong>{workoutStats.aiScore}</strong>
                  <small>/100</small>
                </div>
              </div>

              <div className="workout-pro-signal-list">

                <div>
                  <span className="workout-pro-signal-icon">
                    <HeartPulse size={20} />
                  </span>

                  <div>
                    <small>Recovery</small>
                    <strong>{workoutStats.recovery}%</strong>
                  </div>

                  <ChevronRight size={15} />
                </div>

                <div>
                  <span className="workout-pro-signal-icon">
                    <TrendingUp size={20} />
                  </span>

                  <div>
                    <small>Strength Growth</small>
                    <strong>{workoutStats.strengthGrowth}%</strong>
                  </div>

                  <ChevronRight size={15} />
                </div>

                <div>
                  <span className="workout-pro-signal-icon">
                    <CalendarCheck size={20} />
                  </span>

                  <div>
                    <small>Sessions</small>
                    <strong>{workoutStats.weeklySessions}x</strong>
                  </div>

                  <ChevronRight size={15} />
                </div>

              </div>

            </div>

          </div>

          <div className="workout-pro-mini-grid">

            <div className="workout-pro-mini-card">
              <div>
                <Flame size={22} />
              </div>
              <span>Calories</span>
              <h3>{workoutStats.totalCalories}</h3>
              <p>kcal burned</p>
            </div>

            <div className="workout-pro-mini-card">
              <div>
                <Dumbbell size={22} />
              </div>
              <span>Total Reps</span>
              <h3>{workoutStats.totalReps}</h3>
              <p>reps completed</p>
            </div>

            <div className="workout-pro-mini-card">
              <div>
                <Timer size={22} />
              </div>
              <span>Day Streak</span>
              <h3>{workoutStats.dayStreak}</h3>
              <p>active days</p>
            </div>

          </div>

        </div>

        <div className="workout-pro-right-stack">

  <div className="workout-pro-hero-card">
    <img src={workoutHero} alt="Workout training" />

    <div className="workout-pro-hero-overlay" />

    <div className="workout-pro-hero-content">
      <div className="workout-pro-hero-badge">
        <Sparkles size={15} />
        WORKOUT LAUNCH PANEL
      </div>

      <h2>
        Train smarter.
        <br />
        Move better.
      </h2>

      <p>
        Select your body zone, start guided exercise,
        and let FitFusion track your performance.
      </p>

      <div className="workout-pro-hero-buttons">
        <button
          className="workout-pro-primary-btn"
          onClick={handleStartTraining}
        >
          Start Training
          <ChevronRight size={18} />
        </button>

        <button
          className="workout-pro-secondary-btn"
          onClick={() => navigate('/progress')}
        >
          View Progress
        </button>
      </div>
    </div>
  </div>

  <div className="workout-pro-flow-panel">

  <div className="workout-pro-flow-head">
    <span>QUICK WORKOUT FLOW</span>
    <h3>Start, track, improve</h3>
  </div>

  <div className="workout-pro-flow-line"></div>

  <button
    className="workout-pro-flow-step"
    onClick={handleStartTraining}
  >
    <div className="workout-pro-flow-node">
      <Dumbbell size={18} />
    </div>

    <div>
      <small>Step 01</small>
      <strong>Choose Exercise</strong>
      <p>Pick a body zone</p>
    </div>

    <ChevronRight size={17} />
  </button>

  <button
    className="workout-pro-flow-step"
    onClick={() => navigate('/workout-history')}
  >
    <div className="workout-pro-flow-node">
      <CalendarCheck size={18} />
    </div>

    <div>
      <small>Step 02</small>
      <strong>Workout History</strong>
      <p>View past sessions</p>
    </div>

    <ChevronRight size={17} />
  </button>

  <button
    className="workout-pro-flow-step"
    onClick={() => navigate('/ai-coach')}
  >
    <div className="workout-pro-flow-node">
      <Brain size={18} />
    </div>

    <div>
      <small>Step 03</small>
      <strong>Ask AI Coach</strong>
      <p>Get smart guidance</p>
    </div>

    <ChevronRight size={17} />
  </button>

</div>
</div>

      </section>

      <section className="workout-pro-card workout-pro-snapshot-section">

        <div className="workout-pro-section-head">
          <h2>Smart Training Snapshot</h2>

          <button onClick={() => navigate('/progress')}>
            View Details
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="workout-pro-snapshot-grid">
          {snapshotItems.map((item, index) => (
            <div className="workout-pro-snapshot-card" key={index}>
              <div className={`workout-pro-snapshot-icon ${item.tone}`}>
                {item.icon}
              </div>

              <div>
                <span>{item.title}</span>
                <h3>{item.value}</h3>
              </div>
            </div>
          ))}
        </div>

      </section>

      <section className="workout-pro-card workout-pro-category-section">

        <div className="workout-pro-section-head">
          <div>
            <span>BODY ZONE SELECTION</span>
            <h2>Choose your workout focus</h2>
          </div>
        </div>

        <div className="workout-pro-category-grid">
          {categoryCards.map((item, index) => (
            <Link
              to={item.route}
              className={`workout-pro-category-card ${index === 0 ? 'featured' : ''}`}
              key={item.title}
              style={{
                backgroundImage:
                  `linear-gradient(to top, rgba(5,12,5,.86), rgba(5,12,5,.18)), url(${item.image})`
              }}
            >
              <div className="workout-pro-category-icon">
                {item.icon}
              </div>

              <div>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>

              <ChevronRight size={20} />
            </Link>
          ))}
        </div>

      </section>

    </div>
  )
}

export default Workouts