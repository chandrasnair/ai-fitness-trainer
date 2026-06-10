import { Link, useParams } from 'react-router-dom'

function WorkoutCategory() {
  const { category } = useParams()

  const exercises = {
    strength: ['Squats', 'Deadlifts', 'Lunges', 'Leg Press'],

    mobility: ['Neck Stretch', 'Shoulder Mobility', 'Hip Opener', 'Cat Cow Stretch'],

    cardio: ['Jumping Jacks', 'High Knees', 'Burpees', 'Mountain Climbers'],

    core: ['Plank', 'Crunches', 'Leg Raises', 'Russian Twists'],

    power: ['Bench Press', 'Pull Ups', 'Push Ups', 'Overhead Press'],

    recovery: ['Foam Rolling', 'Deep Breathing', 'Light Walk', 'Muscle Relaxation'],

    stretch: ['Hamstring Stretch', 'Quad Stretch', 'Shoulder Stretch', 'Child Pose']
  }

  const supportedExercises = ['squats', 'push-ups']

  const workoutList = exercises[category] || []

  const isSupportedExercise = (exercise) => {
    const slug = exercise.toLowerCase().replaceAll(' ', '-')
    return supportedExercises.includes(slug)
  }

  return (
    <div className="category-page">
      <h1>{category?.toUpperCase()}</h1>
      <p>Select an exercise to begin training.</p>

      <div className="exercise-grid">
        {workoutList.map((exercise, index) => {
          const slug = exercise.toLowerCase().replaceAll(' ', '-')
          const supported = isSupportedExercise(exercise)

          return (
            <div
              key={index}
              className={`exercise-card ${!supported ? 'coming-soon-card' : ''}`}
            >
              <h3>{exercise}</h3>

              {supported ? (
                <Link
                  to={`/exercise/${slug}`}
                  className="exercise-start-btn"
                >
                  Start Exercise
                </Link>
              ) : (
                <button
                  className="exercise-start-btn coming-soon-btn"
                  disabled
                >
                  Coming Soon
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WorkoutCategory