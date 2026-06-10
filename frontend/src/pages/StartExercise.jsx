import { useParams, Link } from 'react-router-dom'
import { Camera, Play, ArrowLeft, Save } from 'lucide-react'

function StartExercise() {
  const { exerciseName } = useParams()

  const formattedName = exerciseName
    ?.replaceAll('-', ' ')
    .toUpperCase()

  const normalizedExercise =
    exerciseName === 'squats'
      ? 'squat'
      : exerciseName

  const handleStartWorkout = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/workout/start',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            exercise: normalizedExercise
          })
        }
      )

      const data = await response.json()

      alert(data.message)
    } catch (error) {
      console.log(error)
      alert('Failed to start workout')
    }
  }

 const handleSaveWorkoutResult = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    const response = await fetch(
      'http://localhost:5000/api/history/sync-latest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userInfo?.token}`
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Failed to sync workout result')
      return
    }

    alert('Latest workout result synced to progress')
  } catch (error) {
    console.log(error)
    alert('Failed to sync workout result')
  }
}

  return (
    <div className="start-exercise-page">

      <Link
        to={`/exercise/${exerciseName}`}
        className="exercise-back-link"
      >
        <ArrowLeft size={18} />
        Back to Exercise
      </Link>

      <section className="start-workout-card">

        <div className="camera-preview-box">
          <Camera size={60} />
          <p>Camera preview will appear here</p>
        </div>

        <div className="start-workout-info">
          <span>AI WORKOUT SESSION</span>

          <h1>{formattedName}</h1>

          <p>
            Get ready. FitFusion will track your posture, count reps,
            and give real-time AI feedback during this exercise.
          </p>

          <button
            className="begin-session-btn"
            onClick={handleStartWorkout}
          >
            <Play size={18} />
            Begin Session
          </button>

          <button
            className="begin-session-btn"
            onClick={handleSaveWorkoutResult}
          >
            <Save size={18} />
            Save Session Result
          </button>
        </div>

      </section>

    </div>
  )
}

export default StartExercise