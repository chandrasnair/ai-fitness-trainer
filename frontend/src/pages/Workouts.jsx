import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NotificationBell from '../components/NotificationBell'

import {
  Brain,
  HeartPulse,
  Flame,
  Dumbbell,
  ClipboardList,
  Activity,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  TrendingUp,
  Bell,
  Settings
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
  const workoutHero =
  gender === 'male'
    ? '/images/workout-hero-male.jpg'
    : '/images/workout-hero-female.jpg'

    const handleStartTraining = () => {
  const section = document.querySelector('.workout-section')

  if (section) {
    section.scrollIntoView({
      behavior: 'smooth'
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
        'http://localhost:5000/api/history/stats',
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
          strengthGrowth: data.totalWorkouts > 0
            ? Math.min(data.totalWorkouts * 6, 100)
            : 0,
          weeklySessions: data.totalWorkouts || 0,
          nextFocus: aiScore >= 80
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
  return (
    <div className="workouts-page">
    <div className="page-topbar">

  <div className="page-title-block">

    <span>
      AI FITNESS SYSTEM
    </span>

    <h1>
      Workouts
    </h1>

  </div>

  <div className="topbar-mini-icons">
    <Activity size={18} />
    <Sparkles size={18} />
    <ShieldCheck size={18} />
  </div>

  <div className="top-actions">

    <NotificationBell />

    <button
  className="icon-btn"
  onClick={() => navigate('/profile')}
>
  <Settings size={19} />
</button>

  </div>

</div>

      <section
        className="workouts-hero"
        style={{
      backgroundImage:
      `linear-gradient(90deg, rgba(5,12,5,.92), rgba(5,12,5,.35)), url(${workoutHero})`
}}
      >
        <div>
          <span>AI GUIDED WORKOUTS</span>

          <h1>
            Build your
            <br />
            strongest version.
          </h1>

          <p>
            Choose your workout category, follow guided exercises,
            and train with AI posture feedback.
          </p>

          <button onClick={handleStartTraining}>
  Start Training
</button>
        </div>
      </section>

      <section className="training-insight-layout">

  <div className="training-strips">

  <div className="training-strip">

    <div className="strip-icon">
      <TrendingUp size={30} strokeWidth={2.2} />
    </div>

    <div>
      <span>{workoutStats.strengthGrowth}%</span>
<p>Strength growth this week</p>
    </div>

  </div>

  <div className="training-strip">

    <div className="strip-icon">
      <CalendarCheck size={30} strokeWidth={2.2} />
    </div>

    <div>
      <span>{workoutStats.weeklySessions}x</span>
<p>Workout sessions completed</p>
    </div>

  </div>

  <div className="training-strip">

    <div className="strip-icon">
      <Sparkles size={30} strokeWidth={2.2} />
    </div>

    <div>
      <span>AI</span>
<p>Next focus: {workoutStats.nextFocus}</p>
    </div>

  </div>

</div>

  <div
    className="training-message-box"
    style={{
      backgroundImage:
        "linear-gradient(to top, rgba(5,12,5,.88), rgba(5,12,5,.22)), url('/images/workout-motivation.jpg')"
    }}
  >
    <span>AI PERFORMANCE NOTE</span>

    <h2>
      Small improvements
      are becoming visible.
    </h2>

    <p>
      Your recent workout sessions show stronger movement control,
      improved posture stability, and better recovery rhythm across
      multiple training days. Continue focusing on controlled repetitions,
      recovery timing, and progressive overload to improve long-term
      performance safely.
    </p>
  </div>

  <div className="metric-flow">

  <div className="main-line"></div>

  <div className="side-line side-one"></div>
  <div className="side-line side-two"></div>
  <div className="side-line side-three"></div>
  <div className="side-line side-four"></div>

  <div className="metric-circle circle-one">
    <Brain size={28} strokeWidth={2.2} />
    <h3>{workoutStats.aiScore}%</h3>
<p>AI Form</p>
  </div>

  <div className="metric-circle circle-two">
    <HeartPulse size={28} strokeWidth={2.2} />
    <h3>{workoutStats.recovery}%</h3>
<p>Recovery</p>
  </div>

  <div className="metric-circle circle-three">
    <Flame size={28} strokeWidth={2.2} />
   <h3>{workoutStats.totalCalories}</h3>
<p>Calories</p>
  </div>

  <div className="metric-circle circle-four">
    <Dumbbell size={28} strokeWidth={2.2} />
    <h3>{workoutStats.totalReps}</h3>
<p>Reps</p>
  </div>

  <div className="metric-circle circle-five">
    <ClipboardList size={28} strokeWidth={2.2} />
    <h3>AI</h3>
    <p>Generate Plan</p>
  </div>

</div>

</section>
  
<section className="workout-section">

  <div className="section-heading">

    <div>
      <span>TRAINING CATEGORIES</span>
      <h2>Choose your focus</h2>
    </div>

  </div>

  <div className="workout-category-grid">

  <Link
  to="/workouts/category/strength"
  className="category-card lower-body"
  style={{
    backgroundImage:
      "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/lowerbody-male.jpg')"
  }}
>
  <h3>Lower Body</h3>
  <p>Strength, squats, and leg control.</p>
</Link>

<Link
  to="/workouts/category/power"
  className="category-card upper-body"
  style={{
    backgroundImage:
      "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/upperbody-male.jpg')"
  }}
>
  <h3>Upper Body</h3>
  <p>Power and posture stability.</p>
</Link>

<Link
  to="/workouts/category/core"
  className="category-card core"
  style={{
    backgroundImage:
      "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/core-male.jpg')"
  }}
>
  <h3>Core</h3>
  <p>Balance and control.</p>
</Link>

<Link
  to="/workouts/category/cardio"
  className="category-card cardio"
  style={{
    backgroundImage:
      "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/cardio-male.jpg')"
  }}
>
  <h3>Cardio</h3>
  <p>Energy and endurance.</p>
</Link>

<Link
  to="/workouts/category/recovery"
  className="category-card recovery"
  style={{
    backgroundImage:
      "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/recovery-male.jpg')"
  }}
>
  <h3>Recovery</h3>
  <p>Relaxation and muscle repair.</p>
</Link>

<Link
  to="/workouts/category/mobility"
  className="category-card mobility"
  style={{
    backgroundImage:
      "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/mobility-male.jpg')"
  }}
>
  <h3>Mobility</h3>
  <p>Flexible movement and recovery.</p>
</Link>

<Link
   to="/workouts/category/stretch"
  className="category-card stretch"
  style={{
    backgroundImage:
      "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/stretch-male.jpg')"
  }}
>
  <h3>Stretch</h3>
  <p>Cooldown and release.</p>
</Link>
  <div className="category-metric-branch">

  <div className="bridge-node bridge-one"></div>

  <div className="bridge-node bridge-two"></div>


</div>

</div>

</section> 


    </div>
  )
}

export default Workouts