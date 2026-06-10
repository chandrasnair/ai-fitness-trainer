import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NotificationBell from '../components/NotificationBell'
import {
  Bell,
  Settings,
  Send,
  Sparkles,
  Brain,
  Gauge,
  Battery,
  Target,
  CheckCircle
} from 'lucide-react'

function AICoach() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [aiReply, setAiReply] = useState('')

  const [aiStats, setAiStats] = useState({
    aiScore: 0,
    recovery: 0,
    readiness: 'Start Training',
    consistency: 'No Data'
  })

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
    const fetchAIStats = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/history/stats'
        )

        const data = await response.json()

        if (response.ok) {
          const score = calculateAiScore(data)

          setAiStats({
            aiScore: score,
            recovery: score >= 80 ? 88 : score >= 60 ? 72 : 50,
            readiness:
              score >= 80
                ? 'Ready'
                : score >= 60
                  ? 'Moderate'
                  : 'Build Up',
            consistency:
              score >= 80
                ? 'Strong'
                : score >= 60
                  ? 'Improving'
                  : 'Low'
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchAIStats()
  }, [])

  const handleAskAI = () => {
    const q = question.toLowerCase()

    if (q.includes('protein') || q.includes('food')) {
      setAiReply(
        'Protein-rich food helps muscle recovery. Try eggs, paneer, chicken, dal, Greek yogurt, or sprouts after workouts.'
      )
    } else if (q.includes('squat')) {
      setAiReply(
        'For squats, keep your chest up, knees aligned with your toes, and move slowly. Focus on depth and control.'
      )
    } else if (q.includes('muscle')) {
      setAiReply(
        'To build muscle, combine strength training, sufficient protein intake, progressive overload, and quality sleep.'
      )
    } else if (
      q.includes('weight loss') ||
      q.includes('fat loss')
    ) {
      setAiReply(
        'For fat loss, stay consistent with workouts, eat balanced meals, avoid excess sugar, and maintain a calorie deficit.'
      )
    } else if (
      q.includes('sleep') ||
      q.includes('recovery')
    ) {
      setAiReply(
        'Recovery improves with proper sleep, hydration, stretching, and rest between intense training sessions.'
      )
    } else if (q.includes('pain')) {
      setAiReply(
        'If you feel pain, stop the exercise immediately. Check your form and avoid pushing through sharp pain.'
      )
    } else {
      setAiReply(
        'Ask me about protein, squats, muscle gain, weight loss, recovery, sleep, hydration, or workout tips.'
      )
    }

    setQuestion('')
  }

  const handleDownloadReport = () => {
    const reportData = {
      reportTitle: 'FitFusion AI Performance Report',
      generatedAt: new Date().toISOString(),

      aiScore: aiStats.aiScore,
      recovery: aiStats.recovery,
      readiness: aiStats.readiness,
      consistency: aiStats.consistency,

      aiInsight:
        aiStats.aiScore >= 80
          ? 'Your workout consistency and readiness are strong.'
          : aiStats.aiScore >= 60
            ? 'Your progress is improving. Stay consistent.'
            : 'Start with regular workouts to build better performance.',

      recommendations: [
        'Prioritize clean form over speed.',
        'Maintain proper hydration throughout the day.',
        'Include protein-rich food after workouts.',
        'Take enough rest between intense sessions.',
        'Track workouts regularly for better AI insights.'
      ]
    }

    const fileData = JSON.stringify(reportData, null, 2)

    const blob = new Blob([fileData], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'fitfusion-ai-report.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="ai-coach-page">

      <div className="page-topbar">
        <div className="page-title-block">
          <span>FITFUSION AI REPORT</span>
          <h1>AI Performance Report</h1>
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
        className="ai-coach-hero"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(3,10,5,.94), rgba(3,10,5,.42), rgba(3,10,5,.05)), url('/images/aicoach-hero.png')"
        }}
      >
        <div className="ai-hero-content">
          <span>POWERED BY AI</span>

          <h2>Your weekly AI fitness report.</h2>

          <p>
            Track workout consistency, recovery,
            training readiness, and personalized
            recommendations generated by FitFusion AI.
          </p>

          <button onClick={handleDownloadReport}>
            Download Report
          </button>
        </div>

        <div className="ai-hero-metrics">

          <div className="hero-ai-metric">
            <Gauge size={22} />
            <span>AI SCORE</span>
            <h3>{aiStats.aiScore}%</h3>
          </div>

          <div className="hero-ai-metric">
            <Battery size={22} />
            <span>RECOVERY</span>
            <h3>{aiStats.recovery}%</h3>
          </div>

          <div className="hero-ai-metric">
            <Target size={22} />
            <span>READINESS</span>
            <h3>{aiStats.readiness}</h3>
          </div>

          <div className="hero-ai-metric">
            <Brain size={22} />
            <span>CONSISTENCY</span>
            <h3>{aiStats.consistency}</h3>
          </div>

        </div>
      </section>

      <section className="ai-dashboard-grid">

        <div className="ai-mini-photo insight-tile">
          <img src="/images/ai-insight.jpg" alt="" />

          <div>
            <span>AI INSIGHT</span>
            <h3>Control improving</h3>

            <p>
              AI analysis shows improved movement control, better posture
              alignment, and more consistent workout execution compared to
              recent sessions.
            </p>
          </div>
        </div>

        <div className="ask-ai-tile">
          <span>ASK AI COACH</span>
          <h3>Need quick guidance?</h3>

          <div className="ask-tile-input">
            <input
              type="text"
              placeholder="Ask about workout, diet, recovery..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <button onClick={handleAskAI}>
              <Send size={17} />
            </button>
          </div>

          {aiReply && (
            <div className="ai-reply-box">
              <p>{aiReply}</p>
            </div>
          )}
        </div>

        <div className="ai-mini-photo">
          <img src="/images/sleep.jpg" alt="" />

          <div>
            <span>RECOVERY</span>
            <h3>Sleep quality</h3>

            <p>
              Prioritize quality sleep and hydration to support muscle recovery,
              energy restoration, and overall training performance.
            </p>
          </div>
        </div>

        <div className="ai-mini-photo stability-card-clean">
          <img src="/images/stability-focus.png" alt="" />

          <div>
            <span>WORKOUT</span>

            <p>
              Focus on balance, control, and coordination to build a stronger
              foundation for safer and more effective workouts.
            </p>
          </div>
        </div>

        <div className="ai-mini-photo">
          <img src="/images/nutrition-tip.jpg" alt="" />

          <div>
            <span>NUTRITION</span>
            <h3>Protein recovery</h3>

            <p>
              Support recovery with protein-rich meals and balanced nutrition
              to maximize muscle repair and daily performance.
            </p>
          </div>
        </div>

        <div className="daily-goals-tile">
          <span>DAILY GOALS</span>

          <div className="goal-line">
            <CheckCircle size={16} />
            <p>Mobility warm-up</p>
          </div>

          <div className="goal-line">
            <CheckCircle size={16} />
            <p>Controlled workout</p>
          </div>

          <div className="goal-line">
            <CheckCircle size={16} />
            <p>Protein recovery</p>
          </div>
        </div>

      </section>

      <section className="ai-final-quote">
        <Sparkles size={19} />
        <p>Discipline creates the results that motivation promises.</p>
      </section>

    </div>
  )
}

export default AICoach