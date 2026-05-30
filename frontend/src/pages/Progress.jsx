import { useState } from 'react'

import {
  Bell,
  Settings,
  Activity,
  Flame,
  Dumbbell,
  TrendingUp
} from 'lucide-react'

function Progress() {
  const [showGraph, setShowGraph] = useState(false)
 
  return (
    <div className="progress-page">

      <div className="page-topbar">

        <div className="page-title-block">
          <span>AI PERFORMANCE SYSTEM</span>
          <h1>Progress</h1>
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
        className="progress-hero"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(5,12,5,.88), rgba(5,12,5,.28)), url('/images/progress-hero.png')"
        }}
      >
        <div>
          <span>PERFORMANCE ANALYTICS</span>

          <h1>
            Track every
            <br />
            improvement.
          </h1>

          <p>
            Monitor calories, reps, consistency, and AI form insights
            from every workout session.
          </p>
        </div>
      </section>

      <section className="progress-stats-row">

        <div className="progress-stat">
          <Flame size={24} />
          <h3>12.8K</h3>
          <p>Calories Burned</p>
        </div>

        <div className="progress-stat">
          <Dumbbell size={24} />
          <h3>4,860</h3>
          <p>Total Reps</p>
        </div>

        <div className="progress-stat">
          <Activity size={24} />
          <h3>28</h3>
          <p>Workout Sessions</p>
        </div>

        <div className="progress-stat">
          <TrendingUp size={24} />
          <h3>87%</h3>
          <p>Consistency</p>
        </div>

      </section>

      <section className="progress-focus-layout">

  <div className="progress-video-frame">

    <video
      src="/videos/progress-focus.mp4"
      autoPlay
      muted
      loop
      playsInline
    />

    <div className="progress-video-overlay">

      <span>AI PROGRESS FOCUS</span>

      <h2>
        Endurance
        improving
      </h2>

    </div>

  </div>

  <div className="workout-history-line">

  <div className="history-header">

    <span>RECENT WORKOUTS</span>

    <button
      className="graph-toggle-btn"
      onClick={() =>
        setShowGraph(!showGraph)
      }
    >
      Overall Progress →
    </button>

  </div>

  {!showGraph && (
    <>
      <div className="history-item">
        <strong>Squats</strong>
        <p>42 reps · 96% form</p>
      </div>

      <div className="history-item">
        <strong>Pushups</strong>
        <p>30 reps · 91% form</p>
      </div>

      <div className="history-item">
        <strong>Treadmill</strong>
        <p>22 min · 210 kcal</p>
      </div>

      <div className="history-item">
        <strong>Lunges</strong>
        <p>38 reps · 93% form</p>
      </div>
    </>
  )}

  {showGraph && (

    <div className="mini-graph">
<svg viewBox="0 0 500 220">
  <polyline points="20,180 100,160 180,130 260,100 340,70 460,40" />

  <circle cx="20" cy="180" r="5" />
  <circle cx="100" cy="160" r="5" />
  <circle cx="180" cy="130" r="5" />
  <circle cx="260" cy="100" r="5" />
  <circle cx="340" cy="70" r="5" />
  <circle cx="460" cy="40" r="5" />
</svg>

      <div className="mini-graph-labels">

        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>

      </div>

    </div>

  )}

</div>
  <div
    className="ai-progress-photo-note"
    style={{
      backgroundImage:
        "linear-gradient(to top, rgba(5,12,5,.82), rgba(5,12,5,.22)), url('/images/progress-focus.jpg')"
    }}
  >

    <span>AI INSIGHT</span>

    <h2>
      Consistency
      improving
    </h2>

    <p>
      +12% compared to last week
    </p>

  </div>

</section>


    </div>
  )
}

export default Progress