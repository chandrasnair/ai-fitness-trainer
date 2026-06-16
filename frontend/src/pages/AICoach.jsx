import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../api'
import NotificationBell from '../components/NotificationBell'
import {
  Settings,
  Send,
  Sparkles,
  Brain,
  Target,
  Zap,
  TrendingUp,
  Heart,
  Download,
  Leaf,
  Utensils,
  Droplets,
  Dumbbell,
  Moon,
  CheckCircle,
  Activity,
  Timer,
  BarChart3,
  UserRound,
  Mic,
  Apple,
  Salad,
  CircleDot,
  ChevronDown
} from 'lucide-react'

function AICoach() {
  const navigate = useNavigate()

  const [question, setQuestion] = useState('')
  const [aiReply, setAiReply] = useState('')
  const [isAsking, setIsAsking] = useState(false)

  const [coachData, setCoachData] = useState({
    coachScore: 0,
    energyTrend: 'Building',
    trainingLoad: 'Light',
    recoveryState: 'Start',
    directionTitle: 'Build strength with intention, recover with purpose.',
    directionText:
      'Focus on controlled movement and smart recovery to keep progressing sustainably.',
    formFocus: 'Quality over quantity.',
    recoveryFocus: 'Rest is progress.',
    repFocus: 'Small jumps today.',
    nutritionFocus: 'Nourish well.',
    planWorkout: 'Controlled Workout',
    planDuration: '30 min'
  })

  useEffect(() => {
    const fetchCoachData = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))

      try {
        const response = await fetch(
          `${API_URL}/api/history/progress-summary`,
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
          const stats = data.stats || {}

          const score = stats.aiScore || 0
          const posture = stats.postureScore || 0
          const reps = stats.totalReps || 0
          const workouts = stats.totalWorkouts || 0

          setCoachData({
            coachScore: score,

            energyTrend:
              score >= 80 ? 'High' : score >= 60 ? 'Steady' : 'Building',

            trainingLoad:
              reps >= 300 ? 'High' : reps >= 100 ? 'Moderate' : 'Light',

            recoveryState:
              posture >= 80 ? 'Good' : posture >= 60 ? 'Average' : 'Focus',

            directionTitle:
  workouts === 0
    ? 'Start steady, move with control, build your rhythm.'
    : posture < 60
      ? 'Improve your form before increasing intensity.'
      : score >= 80
        ? 'Maintain your rhythm and recover with purpose.'
        : reps >= 100
          ? 'Build strength with steady progression.'
          : 'Move consistently and focus on clean reps.',

directionText:
  workouts === 0
    ? 'Begin with simple workouts, clean form, and enough recovery. FitFusion AI will guide better as your activity grows.'
    : posture < 60
      ? 'Your posture score needs attention. Slow down your reps, focus on correct alignment, and avoid increasing intensity too quickly.'
      : score >= 80
        ? 'Your progress looks strong. Continue controlled movement, balanced recovery, and steady training without overloading your body.'
        : reps >= 100
          ? 'Your rep count is improving. Keep progressing gradually while maintaining proper form and recovery.'
          : 'Focus on consistency, controlled movement, and small improvements in each workout session.',
            formFocus:
              posture >= 80
                ? 'Quality over quantity.'
                : 'Slow down your reps.',

            recoveryFocus:
              score >= 70
                ? 'Rest is progress.'
                : 'Recharge smartly.',

            repFocus:
              reps >= 100
                ? 'Progress gradually.'
                : 'Small jumps today.',

            nutritionFocus: 'Nourish well.',

            planWorkout:
              workouts >= 5 ? 'Strength: Upper Body' : 'Controlled Workout',

            planDuration:
              workouts >= 5 ? '45 min' : '30 min'
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchCoachData()
  }, [])

  const handleAskAI = async (e) => {
  if (e) {
    e.preventDefault()
  }

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  if (!question.trim()) {
    setAiReply('Please type a question first.')
    return
  }

  if (!userInfo?.token) {
    setAiReply('Please login again to use FitFusion AI Coach.')
    return
  }

  if (isAsking) {
    return
  }

  try {
    setIsAsking(true)
    setAiReply('FitFusion AI Coach is thinking...')

    const response = await fetch(`${API_URL}/api/ai-coach/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      },
      body: JSON.stringify({
        question: question.trim()
      })
    })

    const data = await response.json()

    if (response.status === 429) {
      setAiReply(
        'FitFusion AI Coach is receiving too many requests right now. Please wait a little and try again.'
      )
      return
    }

    if (response.status === 401) {
      setAiReply('Your session expired. Please login again to continue.')
      return
    }

    if (!response.ok) {
      setAiReply(
        data.message ||
          'FitFusion AI Coach is currently unavailable. Please try again later.'
      )
      return
    }

    setAiReply(
      data.reply ||
        'FitFusion AI Coach could not generate a response right now. Please try again.'
    )

    setQuestion('')
  } catch (error) {
    console.log(error)

    setAiReply(
      'Unable to connect to FitFusion AI Coach. Please check if the backend server is running.'
    )
  } finally {
    setIsAsking(false)
  }
}
  const handleDownloadReport = () => {
    const reportData = {
      reportTitle: 'FitFusion AI Coach Report',
      generatedAt: new Date().toISOString(),
      coachScore: coachData.coachScore,
      energyTrend: coachData.energyTrend,
      trainingLoad: coachData.trainingLoad,
      recoveryState: coachData.recoveryState,
      todaysCoachingDirection: coachData.directionTitle,
      todaysCoachingFocus: {
        formControl: coachData.formFocus,
        recoveryBalance: coachData.recoveryFocus,
        repProgression: coachData.repFocus,
        nutritionSupport: coachData.nutritionFocus
      },
      nutritionFocus:
        'Fuel your body with protein, healthy meals, hydration, and balanced recovery nutrition.',
      note:
        'This report is generated using FitFusion backend workout progress data and AI coaching guidance.'
    }

    const fileData = JSON.stringify(reportData, null, 2)

    const blob = new Blob([fileData], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'fitfusion-ai-coach-report.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  const coachingFocusItems = [
  {
    icon: <UserRound size={22} />,
    title: 'Form Control',
    text: 'Quality over quantity.'
  },
  {
    icon: <Heart size={22} />,
    title: 'Recovery Balance',
    text: 'Recharge smartly.'
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Rep Progression',
    text: 'Progress gradually.'
  },
  {
    icon: <Utensils size={22} />,
    title: 'Nutrition Support',
    text: 'Nourish well.'
  }
]

const todayIndex = new Date().getDay() % coachingFocusItems.length

const todayFocusItems = [
  ...coachingFocusItems.slice(todayIndex),
  ...coachingFocusItems.slice(0, todayIndex)
]

  return (
    <div className="ai-coach-v3-page">

      <header className="ai-coach-v3-header-pro">
  <div className="ai-coach-v3-title-area">
    <div className="ai-coach-v3-main-icon">
      <Brain size={30} />
    </div>

    <div>
      <span>AI COACH SYSTEM</span>
      <h1>AI Coach</h1>
      <p>Smarter guidance. Stronger you.</p>
    </div>
  </div>

  <div className="ai-coach-v3-header-actions">
    <div className="ai-coach-v3-header-action-item">
  <div className="ai-coach-v3-header-action-circle">
    <NotificationBell />
  </div>
  <small>Notifications</small>
</div>

    <div
      className="ai-coach-v3-header-action-item"
      onClick={() => navigate('/profile')}
    >
      <button className="ai-coach-v3-header-action-circle">
        <Settings size={21} />
      </button>
      <small>Settings</small>
    </div>
  </div>
</header>

      <section className="ai-coach-v3-top-layout">

        <div className="ai-coach-v3-direction-card">
          <div className="ai-coach-v3-section-label">
            <div>
              <Leaf size={19} />
            </div>
            <span>Today&apos;s Coaching Direction</span>
          </div>

          <h2>{coachData.directionTitle}</h2>

          <p>{coachData.directionText}</p>

          <div className="ai-coach-v3-direction-body">
            <div className="ai-coach-v3-score-circle">
              <svg viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="58" />
                <circle
                  cx="75"
                  cy="75"
                  r="58"
                  pathLength="100"
                  strokeDasharray={`${coachData.coachScore} 100`}
                />
              </svg>

              <div>
                <span>Coach Score</span>
                <strong>{coachData.coachScore}</strong>
                <small>/100</small>
              </div>
            </div>

            <div className="ai-coach-v3-signal-list">
              <div>
                <span className="ai-coach-v3-signal-icon">
                  <Zap size={20} />
                </span>

                <div>
                  <small>Energy Trend</small>
                  <strong>{coachData.energyTrend}</strong>
                </div>

                <TrendingUp size={15} />
              </div>

              <div>
                <span className="ai-coach-v3-signal-icon">
                  <BarChart3 size={20} />
                </span>

                <div>
                  <small>Training Load</small>
                  <strong>{coachData.trainingLoad}</strong>
                </div>

                <Activity size={15} />
              </div>

              <div>
                <span className="ai-coach-v3-signal-icon">
                  <Heart size={20} />
                </span>

                <div>
                  <small>Recovery</small>
                  <strong>{coachData.recoveryState}</strong>
                </div>

                <TrendingUp size={15} />
              </div>
            </div>
          </div>
        </div>

        <div className="ai-coach-v3-hero">
          <img
  className="ai-coach-v3-girl-cutout"
  src="/images/home-hero-cutout.png"
  alt="AI coach"
/>
          <div className="ai-coach-v3-hero-shade" />

          <div className="ai-coach-v3-hero-text">
            <h2>
              Train Smarter
              <br />
              Every Day
            </h2>

            <p>
              Personalized insights that adapt to your body,
              goals, and lifestyle.
            </p>

            <div className="ai-coach-v3-hero-buttons">
              <button
                className="ai-coach-v3-primary-btn"
                onClick={() =>
                  document
                    .querySelector('.ai-coach-v3-ask-card')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    })
                }
              >
                <Sparkles size={16} />
                Ask AI Coach
              </button>

              <button
                className="ai-coach-v3-secondary-btn"
                onClick={handleDownloadReport}
              >
                <Download size={17} />
                Download Report
              </button>
            </div>
          </div>
        </div>

      </section>

      
      <section className="ai-coach-v3-focus-pills-section">

  <div className="ai-coach-v3-focus-pills-head">
    <div className="ai-coach-v3-section-label small">
      <Target size={17} />
      <span>Today&apos;s Coaching Focus</span>
    </div>

    <p>Small actions selected from your current training pattern.</p>
  </div>

  <div className="ai-coach-v3-focus-pill-row">
  {todayFocusItems.map((item, index) => (
    <div className="ai-coach-v3-focus-pill" key={index}>
      <span>
        {item.icon}
      </span>

      <div>
        <small>{item.title}</small>
        <strong>{item.text}</strong>
      </div>
    </div>
  ))}
</div>

</section>

<section className="ai-coach-v3-middle-extended-layout">

  <div className="ai-coach-v3-middle-left">

    <div className="ai-coach-v3-nutrition-card ai-coach-v3-dual-image-card">

      <div className="ai-coach-v3-nutrition-tile">
        <img
          src="/images/nutrition-tip.jpg"
          alt="Nutrition focus"
        />

        <div className="ai-coach-v3-tile-overlay" />

        <div className="ai-coach-v3-tile-text">
          <span>
            <Leaf size={15} />
            Nutrition Focus
          </span>

          <h2>Fuel your progress.</h2>

          <p>
            Add protein-rich meals after workouts to support muscle repair,
            recovery, and steady energy.
          </p>

          <div className="ai-coach-v3-tile-tags">
            <small>Protein</small>
            <small>Hydration</small>
          </div>
        </div>
      </div>

      <div className="ai-coach-v3-nutrition-tile">
        <img
          src="/images/sleep.jpg"
          alt="Sleep and recovery"
        />

        <div className="ai-coach-v3-tile-overlay" />

        <div className="ai-coach-v3-tile-text">
          <span>
            <Moon size={15} />
            Recovery Focus
          </span>

          <h2>Sleep builds strength.</h2>

          <p>
            Quality sleep helps your body recover, improves energy,
            and supports better workout performance.
          </p>

          <div className="ai-coach-v3-tile-tags">
            <small>Sleep</small>
            <small>Recovery</small>
          </div>
        </div>
      </div>

    </div>

    <div className="ai-coach-v3-quick-actions">
      <span>
        <Zap size={15} />
        Quick Actions
      </span>

      <button onClick={() => navigate('/workouts')}>
        <TrendingUp size={14} />
        Log Workout
      </button>

      <button onClick={() => navigate('/diet')}>
        <Utensils size={14} />
        Log Meal
      </button>

      <button onClick={() => navigate('/profile')}>
        <UserRound size={14} />
        Body Metrics
      </button>

      <button onClick={() => navigate('/progress')}>
        <BarChart3 size={14} />
        View Progress
      </button>
    </div>

  </div>

  <div className="ai-coach-v3-ask-card ai-coach-v3-ask-card-extended">
    <span className="ai-coach-v3-section-label">
      <Sparkles size={16} />
      Ask FitFusion AI
    </span>

    <h2>What do you want to know?</h2>

    <form onSubmit={handleAskAI} className="ai-coach-v3-ask-form">
  <input
    type="text"
    placeholder="Ask anything about training, nutrition, recovery..."
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
  />

  <button type="submit" disabled={isAsking}>
    <Send size={20} />
  </button>
</form>

    <div className="ai-coach-v3-prompt-row">
   <button
  type="button"
  onClick={() => setQuestion('What is the best post-workout meal for me?')}
>
  <Leaf size={14} />
  Best post-workout meal?
</button>

<button
  type="button"
  onClick={() => setQuestion('How can I improve my push-ups?')}
>
  <Dumbbell size={14} />
  Improve push-ups
</button>

<button
  type="button"
  onClick={() => setQuestion('How should I recover after today’s workout?')}
>
  <Heart size={14} />
  Recovery tips
</button>
    </div>

    <div className="ai-coach-v3-ai-reply ai-coach-v3-ai-reply-extended">
      <div>
        <Sparkles size={20} />
      </div>

      <p>
        {isAsking
          ? 'FitFusion AI Coach is thinking...'
          : aiReply || 'Great question! Based on your training and goals, ask me anything about workouts, nutrition, recovery, or form.'}
      </p>

      <ChevronDown size={18} />
    </div>
  </div>

</section>
    </div>
  )
}

export default AICoach