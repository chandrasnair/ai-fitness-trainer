import { useParams, Link } from 'react-router-dom'

import {
  ArrowLeft,
  Play,
  Clock,
  Flame,
  Target,
  Activity
} from 'lucide-react'

function ExerciseDetail() {
  const { exerciseName } = useParams()

  const supportedExercises = ['squats', 'push-ups']

  const isSupported = supportedExercises.includes(exerciseName)

  const formattedName = exerciseName
    ?.replaceAll('-', ' ')
    .toUpperCase()

  return (
    <div className="exercise-detail-page">

      <Link to="/workouts" className="exercise-back-link">
        <ArrowLeft size={18} />
        Back to Workouts
      </Link>

      <section className="exercise-detail-card">

        <div className="exercise-detail-content">
          <span>
            {isSupported ? 'AI GUIDED EXERCISE' : 'COMING SOON'}
          </span>

          <h1>{formattedName}</h1>

          <p>
            {isSupported
              ? 'Start this exercise with AI posture tracking, rep counting, form correction, and real-time coaching feedback.'
              : 'This exercise is planned for future AI tracking. Currently, FitFusion supports Squats and Push Ups.'}
          </p>

          <div className="exercise-metrics">

            <div>
              <Clock size={18} />
              <strong>{isSupported ? '20 min' : 'Soon'}</strong>
              <p>Duration</p>
            </div>

            <div>
              <Flame size={18} />
              <strong>{isSupported ? '220' : '-'}</strong>
              <p>Calories</p>
            </div>

            <div>
              <Target size={18} />
              <strong>{isSupported ? 'Form' : 'Planned'}</strong>
              <p>AI Focus</p>
            </div>

          </div>

          {isSupported ? (
            <Link
              to={`/start-exercise/${exerciseName}`}
              className="start-exercise-btn"
            >
              <Play size={18} />
              Start Exercise
            </Link>
          ) : (
            <button
              className="start-exercise-btn coming-soon-btn"
              disabled
            >
              Coming Soon
            </button>
          )}
        </div>

        <div className="exercise-ai-panel">
          <Activity size={34} />

          <h3>
            {isSupported ? 'AI Coach Ready' : 'AI Tracking Coming Soon'}
          </h3>

          <p>
            {isSupported
              ? 'Camera-based posture correction will guide your movement and record your performance.'
              : 'This exercise will be added later after pose logic and rep counting are prepared.'}
          </p>
        </div>

      </section>

    </div>
  )
}

export default ExerciseDetail