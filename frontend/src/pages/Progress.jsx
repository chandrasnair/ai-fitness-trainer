import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NotificationBell from '../components/NotificationBell'
import {
  Settings,
  Flame,
  Dumbbell,
  Activity,
  TrendingUp,
  Target,
  CalendarDays,
  BarChart3,
  ChevronRight,
  Clock3,
  Trophy,
  PlayCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react'

function Progress() {
  const navigate = useNavigate()
  const [showAllRecommendations, setShowAllRecommendations] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState(null)
  const [performanceMode, setPerformanceMode] = useState('calories')
  const [showMotivationVideo, setShowMotivationVideo] = useState(false)
  const [showConfidenceModal, setShowConfidenceModal] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState(null)
const performanceSectionRef = useRef(null)


 const [stats, setStats] = useState({
  totalCalories: 0,
  totalReps: 0,
  totalWorkouts: 0,
  dayStreak: 0,
  aiScore: 0,
  postureScore: 0,
  repsGoal: 100,
  repsGoalPercent: 0,
  bestReps: 0,
  uniqueExerciseCount: 0,
  insightConfidence: 0
})

  const [recentWorkouts, setRecentWorkouts] = useState([])
  const [graphData, setGraphData] = useState([])
const [recommendations, setRecommendations] = useState([])

  

useEffect(() => {
  const fetchProgressData = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    try {
      const response = await fetch(
        'http://localhost:5000/api/history/progress-summary',
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`
          }
        }
      )

      const data = await response.json()

      if (response.ok) {
        setStats({
          totalCalories: data.stats?.totalCalories || 0,
          totalReps: data.stats?.totalReps || 0,
          totalWorkouts: data.stats?.totalWorkouts || 0,
          dayStreak: data.stats?.dayStreak || 0,
          aiScore: data.stats?.aiScore || 0,
          postureScore: data.stats?.postureScore || 0,
          repsGoal: data.stats?.repsGoal || 100,
          repsGoalPercent: data.stats?.repsGoalPercent || 0,
          bestReps: data.stats?.bestReps || 0,
          uniqueExerciseCount: data.stats?.uniqueExerciseCount || 0,
          insightConfidence: data.stats?.insightConfidence || 0
        })

        setRecentWorkouts(data.recentActivity || [])
        setGraphData(data.graphData || [])
        setRecommendations(data.recommendations || [])
      }
    } catch (error) {
      console.log(error)
    }
  }

  fetchProgressData()
}, [])

  const formatWorkoutName = (name) => {
    if (!name) return 'Workout'

    return name
      .replaceAll('-', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const formatWorkoutDate = (item) => {
    const rawDate =
      item.createdAt ||
      item.date ||
      item.completedAt ||
      item.updatedAt

    if (!rawDate) return 'Recently'

    return new Date(rawDate).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  const getRecommendationIcon = (iconType) => {
  if (iconType === 'shield') return <ShieldCheck size={22} />
  if (iconType === 'calendar') return <CalendarDays size={22} />
  if (iconType === 'trending') return <TrendingUp size={22} />
  if (iconType === 'flame') return <Flame size={22} />
  if (iconType === 'chart') return <BarChart3 size={22} />

  return <Dumbbell size={22} />
}

  const latestWorkout = recentWorkouts[0]

  const progressPercent = Math.min(stats.aiScore || 0, 100)
const postureScore = Math.min(stats.postureScore || 0, 100)
const insightConfidence = Math.min(stats.insightConfidence || 0, 100)
const repsGoal = stats.repsGoal || 100
const repsGoalPercent = stats.repsGoalPercent || 0
const bestReps = stats.bestReps || 0
const uniqueExerciseCount = stats.uniqueExerciseCount || 0

  

  const getPostureText = () => {
    if (postureScore >= 85) return 'Excellent posture!'
    if (postureScore >= 60) return 'Good posture!'
    if (postureScore > 0) return 'Keep improving!'
    return 'Start training!'
  }

  const recommendationCards = recommendations.map((item) => ({
  ...item,
  icon: getRecommendationIcon(item.iconType)
}))

  const visibleRecommendations = showAllRecommendations
  ? recommendationCards
  : recommendationCards.slice(0, 4)

const getGraphPoints = () => {
  const data = graphData

  if (data.length === 0) {
    return '35,180 140,180 245,180 350,180 455,180'
  }

  const values = data.map((item) => {
    if (performanceMode === 'reps') {
      return item.reps_completed || 0
    }

    return item.calories_burned || 0
  })

  const maxValue = Math.max(...values, 1)

  return data
    .map((item, index) => {
      const x = 35 + index * (420 / Math.max(data.length - 1, 1))

      const value =
        performanceMode === 'reps'
          ? item.reps_completed || 0
          : item.calories_burned || 0

      const y = 180 - (value / maxValue) * 110

      return `${x},${y}`
    })
    .join(' ')
}

  return (
    <div className="progress-pro-page">

      <header className="progress-pro-header">
        <div className="progress-pro-title-area">
          <div className="progress-pro-main-icon">
            <TrendingUp size={28} />
          </div>

          <div>
            <span>AI PERFORMANCE SYSTEM</span>
            <h1>Progress</h1>
            <p>Track your workout growth and AI consistency</p>
          </div>
        </div>

        <div className="progress-pro-actions">
          <div className="progress-pro-action-item">
            <div className="progress-pro-action-circle">
              <NotificationBell />
            </div>
            <small>Notifications</small>
          </div>

          <div
            className="progress-pro-action-item"
            onClick={() => navigate('/profile')}
          >
            <button className="progress-pro-action-circle">
              <Settings size={21} />
            </button>
            <small>Settings</small>
          </div>
        </div>
      </header>

      <section className="progress-pro-top-grid">

        <div className="progress-pro-left-stack">

          <div className="progress-pro-card progress-pro-overall-card">
            <div className="progress-pro-card-title">
              <h2>Overall Progress</h2>
            </div>

            <div className="progress-pro-overall-body">

              <div className="progress-pro-circle-wrap">
                <svg viewBox="0 0 150 150">
                  <circle
                    className="progress-pro-ring-bg"
                    cx="75"
                    cy="75"
                    r="58"
                  />
                  <circle
                    className="progress-pro-ring-fill"
                    cx="75"
                    cy="75"
                    r="58"
                    pathLength="100"
                    strokeDasharray={`${progressPercent} 100`}
                  />
                </svg>

                <div className="progress-pro-circle-text">
                  <h3>{progressPercent}%</h3>
                  <p>Overall Progress</p>
                </div>
              </div>

              <div className="progress-pro-stat-grid">

                <div className="progress-pro-stat-card">
                  <Flame size={22} />
                  <span>Calories Burned</span>
                  <h3>{stats.totalCalories}</h3>
                  <p>kcal</p>
                </div>

                <div className="progress-pro-stat-card">
                  <Dumbbell size={22} />
                  <span>Total Reps</span>
                  <h3>{stats.totalReps}</h3>
                  <p>reps</p>
                </div>

                <div className="progress-pro-stat-card">
                  <CalendarDays size={22} />
                  <span>Workout Sessions</span>
                  <h3>{stats.totalWorkouts}</h3>
                  <p>sessions</p>
                </div>

                <div className="progress-pro-stat-card">
                  <BarChart3 size={22} />
                  <span>AI Consistency</span>
                  <h3>{stats.aiScore}%</h3>
                  <p>score</p>
                </div>

              </div>
            </div>
          </div>

          <div className="progress-pro-metrics-grid">

            <div className="progress-pro-card progress-pro-mini-panel">
              <div className="progress-pro-mini-circle">
                <svg viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="26" />
                  <circle
                    cx="35"
                    cy="35"
                    r="26"
                    pathLength="100"
                    strokeDasharray={`${postureScore} 100`}
                  />
                </svg>

                <div>
                  <strong>{postureScore}</strong>
                  <span>/100</span>
                </div>
              </div>

              <div>
                <h3>Posture Score</h3>
                <p>{getPostureText()}</p>
                <small>Keep engaging your core and shoulders.</small>
              </div>

              <button
  type="button"
  className="progress-pro-mini-arrow"
  onClick={() =>
    setSelectedMetric({
      type: 'posture',
      title: 'Posture Score',
      value: `${postureScore}/100`,
      text:
        'Posture Score is based on your workout accuracy and form quality. A higher score means your movements are being performed with better control and posture.',
      note:
        'Keep your shoulders stable, core engaged, and avoid rushing the movement.'
    })
  }
>
  <ChevronRight size={20} />
</button>
            </div>

            <div className="progress-pro-card progress-pro-mini-panel">
              <div className="progress-pro-mini-icon">
                <Target size={24} />
              </div>

              <div className="progress-pro-reps-goal-text">
                <h3>Reps Goal</h3>
                <p>
                  {stats.totalReps}
                  <span> / {repsGoal}</span>
                </p>
                <small>{repsGoalPercent}% Completed</small>

                <div className="progress-pro-goal-line">
                  <i style={{ width: `${repsGoalPercent}%` }} />
                </div>
              </div>

              <button
  type="button"
  className="progress-pro-mini-arrow"
  onClick={() =>
    setSelectedMetric({
      type: 'reps',
      title: 'Reps Goal',
      value: `${stats.totalReps}/${repsGoal}`,
      text:
        'Reps Goal shows how close you are to your current repetition target. The goal increases as your total reps grow.',
      note:
        'Complete workouts consistently to reach the next reps milestone.'
    })
  }
>
  <ChevronRight size={20} />
</button>
            </div>

          </div>

        </div>

        <div className="progress-pro-hero-card">
          <img
            src="/images/progress-hero.png"
            alt="Fitness progress"
          />

          <div className="progress-pro-hero-overlay" />

          <div className="progress-pro-hero-content">
            <div className="progress-pro-hero-badge">
              <Sparkles size={15} />
              PERFORMANCE ANALYTICS
            </div>

            <h2>
              Track every
              <br />
              improvement.
            </h2>

            <p>
              Monitor calories, reps, consistency, and AI insights
              to unlock your full potential.
            </p>

            <button
  className="progress-pro-primary-btn"
  onClick={() =>
    performanceSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
>
  View Detailed Progress
  <ChevronRight size={18} />
</button>

            <button
  className="progress-pro-confidence-strip"
  onClick={() => setShowConfidenceModal(true)}
>
  <span>Insight Confidence</span>
  <div>
    <i style={{ width: `${insightConfidence}%` }} />
  </div>
  <strong>{insightConfidence}%</strong>
</button>
          </div>
        </div>

      </section>

      <section className="progress-pro-card progress-pro-recommend-section">
        <div className="progress-pro-section-head">
          <h2>Performance Recommendations</h2>
          <button onClick={() => setShowAllRecommendations(!showAllRecommendations)}>
  {showAllRecommendations ? 'Show Less' : 'View All'}
  <ChevronRight size={17} />
</button>
        </div>

        <div className="progress-pro-recommend-grid">
          {visibleRecommendations.map((card, index) => (
            <div className="progress-pro-recommend-card" key={index}>
              <div className={`progress-pro-recommend-icon ${card.tone}`}>
                {card.icon}
              </div>

              <div className="progress-pro-recommend-content">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <button
  className="progress-pro-why-btn"
  onClick={() => setSelectedRecommendation(card)}
>
  Why?
</button>
              </div>

            </div>
          ))}
        </div>
      </section>

      <section className="progress-pro-lower-grid">

        <div className="progress-pro-card progress-pro-recent-activity">
          <div className="progress-pro-section-head">
            <h2>Recent Activity</h2>
            <button onClick={() => navigate('/workout-history')}>
  View All
  <ChevronRight size={17} />
</button>
          </div>

          {latestWorkout ? (
            <>
              <div className="progress-pro-activity-main">
                <img
                  src="/images/progress.jpg"
                  alt="Recent activity"
                />

                <div className="progress-pro-activity-main-text">
                  <h3>{formatWorkoutName(latestWorkout.exercise)}</h3>
                  <p>{formatWorkoutDate(latestWorkout)}</p>
                </div>

                <div className="progress-pro-activity-main-meta">
                  <span>
                    <Clock3 size={16} />
                    Workout
                  </span>
                  <span>
                    <Flame size={16} />
                    {latestWorkout.calories_burned || 0} kcal
                  </span>
                  <span>
                    <Trophy size={16} />
                    {bestReps} Best Reps
                  </span>
                </div>
              </div>

              <div className="progress-pro-activity-strip">
                <div>
                  <span>Exercises</span>
                  <strong>{uniqueExerciseCount || recentWorkouts.length}</strong>
                </div>

                <div>
                  <span>Calories</span>
                  <strong>{stats.totalCalories} kcal</strong>
                </div>

                <div>
                  <span>Reps</span>
                  <strong>{stats.totalReps}</strong>
                </div>

                <div>
                  <span>AI Score</span>
                  <strong>{stats.aiScore}%</strong>
                </div>
              </div>

              <div className="progress-pro-activity-list">
                {recentWorkouts.slice(0, 4).map((item, index) => (
                  <div className="progress-pro-activity-row" key={index}>
                    <div className="progress-pro-row-icon">
                      <Activity size={18} />
                    </div>

                    <div className="progress-pro-row-text">
                      <h4>{formatWorkoutName(item.exercise)}</h4>
                      <p>
                        {item.reps_completed || 0}
                        {' '}
                        {item.exercise?.toLowerCase().includes('plank')
                          ? 'sec completed'
                          : 'reps completed'}
                      </p>
                    </div>

                    <div className="progress-pro-best-box">
                      <span>Best Reps</span>
                      <strong>{item.reps_completed || 0}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="progress-pro-empty-state">
              No workout history yet.
            </div>
          )}
        </div>

        <div
  className="progress-pro-card progress-pro-performance-card"
  ref={performanceSectionRef}
>
          <div className="progress-pro-section-head">
            <h2>Workout Performance</h2>
            <button
  onClick={() =>
    setPerformanceMode(performanceMode === 'calories' ? 'reps' : 'calories')
  }
>
  {performanceMode === 'calories' ? 'Calories' : 'Reps'}
  <ChevronRight size={17} />
</button>
          </div>

          <div className="progress-pro-chart">
            <svg viewBox="0 0 490 230" preserveAspectRatio="none">
              <line x1="30" y1="55" x2="470" y2="55" />
              <line x1="30" y1="95" x2="470" y2="95" />
              <line x1="30" y1="135" x2="470" y2="135" />
              <line x1="30" y1="175" x2="470" y2="175" />

              <polyline points={getGraphPoints()} />

             {graphData.map((item, index) => {
  const values = graphData.map((workout) => {
    if (performanceMode === 'reps') {
      return workout.reps_completed || 0
    }

    return workout.calories_burned || 0
  })

  const maxValue = Math.max(...values, 1)

  const x = 35 + index * (420 / Math.max(graphData.length - 1, 1))

  const value =
    performanceMode === 'reps'
      ? item.reps_completed || 0
      : item.calories_burned || 0

  const y = 180 - (value / maxValue) * 110

  return (
    <circle
      key={index}
      cx={x}
      cy={y}
      r="5"
    />
  )
})}
            </svg>
          </div>
        <div className="progress-pro-performance-summary">
  <div>
    <span>
      {performanceMode === 'calories' ? 'Total Calories' : 'Total Reps'}
    </span>
    <strong>
      {performanceMode === 'calories'
        ? stats.totalCalories
        : stats.totalReps}
    </strong>
    <small>
      {performanceMode === 'calories' ? 'kcal' : 'reps'}
    </small>
  </div>

  <div>
    <span>Best Reps</span>
    <strong>{bestReps}</strong>
    <small>reps</small>
  </div>

  <div>
    <span>Total Sessions</span>
    <strong>{stats.totalWorkouts}</strong>
    <small>sessions</small>
  </div>
</div>
        </div>

        <div className="progress-pro-card progress-pro-focus-card">
          <h2>Performance Focus</h2>

          <div className="progress-pro-video-card">
            <video
              src="/videos/progress-focus.mp4"
              autoPlay
              muted
              loop
              playsInline
            />

            <div className="progress-pro-video-shade" />

            <div className="progress-pro-play">
              <PlayCircle size={58} />
            </div>

            <div className="progress-pro-video-text">
              <p>
                Stay consistent and challenge yourself every day
                to reach new milestones.
              </p>

              <button onClick={() => setShowMotivationVideo(true)}>
  <PlayCircle size={18} />
  Watch Motivation
</button>
            </div>
          </div>
        </div>

      </section>
      {selectedRecommendation && (
  <div className="progress-premium-modal-overlay">
    <div className="progress-premium-modal">

      <button
        className="progress-premium-close"
        onClick={() => setSelectedRecommendation(null)}
      >
        ×
      </button>

      <div className="progress-premium-left-panel">
        <div className={`progress-premium-icon ${selectedRecommendation.tone}`}>
          {selectedRecommendation.icon}
        </div>

        <span>FITFUSION AI</span>

        <h3>
          Smart progress
          <br />
          recommendation
        </h3>

        <p>
          Generated from your workout activity, consistency score,
          and recent performance pattern.
        </p>
      </div>

      <div className="progress-premium-content">

        <div className="progress-premium-topline">
          <span>AI RECOMMENDATION</span>
          <strong>{stats.aiScore}% confidence</strong>
        </div>

        <h2>{selectedRecommendation.title}</h2>

        <div className="progress-premium-insight-box">
          <small>WHY THIS MATTERS</small>
          <p>{selectedRecommendation.reason}</p>
        </div>

        <div className="progress-premium-data-grid">

          <div>
            <small>AI Score</small>
            <strong>{stats.aiScore}%</strong>
          </div>

          <div>
            <small>Sessions</small>
            <strong>{stats.totalWorkouts}</strong>
          </div>

          <div>
            <small>Reps</small>
            <strong>{stats.totalReps}</strong>
          </div>

        </div>

        <div className="progress-premium-action-note">
          <span>Next Step</span>
          <p>
            Follow this recommendation for your upcoming workouts to improve
            consistency and long-term progress.
          </p>
        </div>

        <button
          className="progress-premium-done"
          onClick={() => setSelectedRecommendation(null)}
        >
          Continue Progress
        </button>

      </div>

    </div>
  </div>
)}
{showMotivationVideo && (
  <div className="progress-pro-modal-overlay">
    <div className="progress-pro-video-modal">

      <button
        className="progress-pro-modal-close"
        onClick={() => setShowMotivationVideo(false)}
      >
        ×
      </button>

      <span>PERFORMANCE FOCUS</span>

      <h2>Watch Motivation</h2>

      <video
        src="/videos/progress-focus.mp4"
        controls
        autoPlay
        playsInline
      />

      <p>
        Stay consistent and challenge yourself every day to reach new milestones.
      </p>

    </div>
  </div>
)}

{showConfidenceModal && (
  <div className="progress-pro-modal-overlay">
    <div className="progress-pro-why-modal">

      <button
        className="progress-pro-modal-close"
        onClick={() => setShowConfidenceModal(false)}
      >
        ×
      </button>

      <div className="progress-pro-modal-icon olive">
        <Sparkles size={24} />
      </div>

      <span>INSIGHT CONFIDENCE</span>

      <h2>{insightConfidence}% Confidence</h2>

      <p>
        This confidence score is based on your workout activity, total sessions,
        workout streak, calories burned, and AI consistency score. More regular
        workouts will improve the reliability of your progress insights.
      </p>

      <button
        className="progress-pro-modal-ok"
        onClick={() => setShowConfidenceModal(false)}
      >
        Got it
      </button>

    </div>
  </div>
)}
{selectedMetric && (
  <div className="progress-pro-modal-overlay">
    <div className="progress-pro-why-modal">

      <button
        className="progress-pro-modal-close"
        onClick={() => setSelectedMetric(null)}
      >
        ×
      </button>

      <div className={`progress-pro-modal-icon ${selectedMetric.type === 'posture' ? 'blue' : 'olive'}`}>
        {selectedMetric.type === 'posture' ? (
          <ShieldCheck size={24} />
        ) : (
          <Target size={24} />
        )}
      </div>

      <span>PROGRESS METRIC</span>

      <h2>{selectedMetric.title}</h2>

      <h3 className="progress-pro-metric-value">
        {selectedMetric.value}
      </h3>

      <p>{selectedMetric.text}</p>

      <div className="progress-pro-metric-note">
        {selectedMetric.note}
      </div>

      <button
        className="progress-pro-modal-ok"
        onClick={() => setSelectedMetric(null)}
      >
        Got it
      </button>

    </div>
  </div>
)}

    </div>
  )
}

export default Progress