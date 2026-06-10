import { useEffect, useState } from 'react'
import { Dumbbell, Flame, Calendar, CheckCircle } from 'lucide-react'

function WorkoutHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))

        const response = await fetch(
          'http://localhost:5000/api/history',
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
          setHistory(data)
        } else {
          console.log(data.message)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <div className="history-page">
      <div className="history-header">
        <span>FITFUSION ACTIVITY</span>
        <h1>Workout History</h1>
        <p>Your completed AI-guided workout sessions.</p>
      </div>

      {loading && (
        <p>Loading workout history...</p>
      )}

      {!loading && history.length === 0 && (
        <p>No workout history found.</p>
      )}

      <div className="history-grid">
        {history.map((item) => (
          <div className="history-card" key={item._id}>
            <div className="history-card-top">
              <Dumbbell size={24} />
              <h3>{item.exercise}</h3>
            </div>

            <div className="history-details">
              <p>
                <CheckCircle size={16} />
                {item.reps_completed || 0} reps
              </p>

              <p>
                <Flame size={16} />
                {item.calories_burned || 0} calories
              </p>

              <p>
                <Calendar size={16} />
                {item.date_time
                  ? item.date_time
                  : item.createdAt?.split('T')[0]}
              </p>
            </div>

            <span className="history-status">
              Completed
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkoutHistory