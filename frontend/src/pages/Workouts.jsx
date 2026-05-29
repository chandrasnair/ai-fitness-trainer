import { useState } from 'react'
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

  const [gender, setGender] = useState('male')
  const workoutHero =
  gender === 'male'
    ? '/images/workout-hero-male.jpg'
    : '/images/workout-hero-female.jpg'
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

    <button className="icon-btn">
      <Bell size={19} />
    </button>

    <button className="icon-btn">
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

          <button>
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
      <span>18%</span>
      <p>Strength growth this week</p>
    </div>

  </div>

  <div className="training-strip">

    <div className="strip-icon">
      <CalendarCheck size={30} strokeWidth={2.2} />
    </div>

    <div>
      <span>4x</span>
      <p>Weekly training sessions completed</p>
    </div>

  </div>

  <div className="training-strip">

    <div className="strip-icon">
      <Sparkles size={30} strokeWidth={2.2} />
    </div>

    <div>
      <span>AI</span>
      <p>Next focus: controlled lower-body movement</p>
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
    <h3>92%</h3>
    <p>AI Form</p>
  </div>

  <div className="metric-circle circle-two">
    <HeartPulse size={28} strokeWidth={2.2} />
    <h3>87%</h3>
    <p>Recovery</p>
  </div>

  <div className="metric-circle circle-three">
    <Flame size={28} strokeWidth={2.2} />
    <h3>320</h3>
    <p>Calories</p>
  </div>

  <div className="metric-circle circle-four">
    <Dumbbell size={28} strokeWidth={2.2} />
    <h3>860</h3>
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

  <div className="category-card lower-body" style={{ backgroundImage: "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/lowerbody-male.jpg')" }}>
    <h3>Lower Body</h3>
    <p>Strength, squats, and leg control.</p>
  </div>

  <div className="category-card upper-body" style={{ backgroundImage: "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/upperbody-male.jpg')" }}>
    <h3>Upper Body</h3>
    <p>Power and posture stability.</p>
  </div>

  <div className="category-card core" style={{ backgroundImage: "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/core-male.jpg')" }}>
    <h3>Core</h3>
    <p>Balance and control.</p>
  </div>

  <div className="category-card cardio" style={{ backgroundImage: "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/cardio-male.jpg')" }}>
    <h3>Cardio</h3>
    <p>Energy and endurance.</p>
  </div>
  <div
  className="category-card recovery"
  style={{
    backgroundImage:
      "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/recovery-male.jpg')"
  }}
>
  <h3>Recovery</h3>
  <p>Relaxation and muscle repair.</p>
</div>

  <div className="category-card mobility" style={{ backgroundImage: "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/mobility-male.jpg')" }}>
    <h3>Mobility</h3>
    <p>Flexible movement and recovery.</p>
  </div>

  <div className="category-card stretch" style={{ backgroundImage: "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.18)), url('/images/stretch-male.jpg')" }}>
    <h3>Stretch</h3>
    <p>Cooldown and release.</p>
  </div>
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