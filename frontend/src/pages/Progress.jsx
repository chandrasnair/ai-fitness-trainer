import {
  Bell,
  Settings,
  Activity,
  Flame,
  Dumbbell,
  TrendingUp
} from 'lucide-react'

function Progress() {
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

      <section className="progress-focus-video">

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
        Cardio endurance
        is improving.
      </h2>

      <p>
        Your treadmill sessions show smoother pacing and better recovery rhythm.
      </p>

    </div>

  </div>

</section>

    </div>
  )
}

export default Progress