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
  return (
    <div className="ai-coach-page">

      <div className="page-topbar">
        <div className="page-title-block">
          <span>AI FITNESS COACH</span>
          <h1>AI Coach</h1>
        </div>

        <div className="top-actions">
          <button className="icon-btn"><Bell size={19} /></button>
          <button className="icon-btn"><Settings size={19} /></button>
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
          <h2>Your personal fitness brain.</h2>
          <p>Smart guidance for workouts, recovery, nutrition and daily progress.</p>
          <button>Start Coaching</button>
        </div>
      </section>

      <section className="ai-dashboard-grid">

        <div className="ai-mini-photo insight-tile">
          <img src="/images/ai-insight.jpg" alt="" />
          <div>
  <span>AI INSIGHT</span>
  <h3>Control improving</h3>
  <p>
    Recent workouts show better balance, tempo, and form consistency.AI analysis shows improved movement control, better posture alignment,
  and more consistent workout execution compared to recent sessions.
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
            />
            <button><Send size={17} /></button>
          </div>
        </div>

        <div className="ai-score-tile">
          <Gauge size={24} />
          <span>AI SCORE</span>
          <h3>92%</h3>
          <p>Training readiness</p>
        </div>

        <div className="ai-mini-photo">
          <img src="/images/sleep.jpg" alt="" />
          <div>
  <span>RECOVERY</span>
  <h3>Sleep quality</h3>
  <p>
    Quality sleep accelerates recovery and improves performance.Prioritize quality sleep and hydration to support muscle recovery,
  energy restoration, and overall training performance.
  </p>
</div>
        </div>

        <div className="ai-mini-photo">
          <img src="/images/stability-focus.png" alt="" />
          <div>
  <span>WORKOUT</span>
  <h3>Stability focus</h3>
  <p>
    Build control, balance, and movement confidence.Focus on balance, control, and coordination to build a stronger
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
    Fuel your progress with balanced nutrition after training.Support recovery with protein-rich meals and balanced nutrition to
  maximize muscle repair and daily performance.
  </p>
</div>
        </div>

        <div className="ai-score-tile">
          <Battery size={24} />
          <span>RECOVERY</span>
          <h3>88%</h3>
          <p>Ready for session</p>
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

        <div className="readiness-tile">
          <Target size={23} />
          <span>TODAY'S FOCUS</span>
          <h3>Form first</h3>
          <p>Prioritize clean reps over speed.</p>
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