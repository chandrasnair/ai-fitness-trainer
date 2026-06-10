import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'

function NotificationBell() {

    const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notificationsSeen, setNotificationsSeen] = useState(
  localStorage.getItem('notificationsSeen') === 'true'
)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))

        const notificationSettings =
          JSON.parse(localStorage.getItem('notificationSettings')) || {
            workoutReminders: true,
            recipeAlerts: true,
            aiCoachTips: true
          }

        const generatedNotifications = []

        const statsResponse = await fetch(
          'http://localhost:5000/api/history/stats',
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`
            }
          }
        )

        const statsData = await statsResponse.json()

        const historyResponse = await fetch(
          'http://localhost:5000/api/history',
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`
            }
          }
        )

        const historyData = await historyResponse.json()

        const contributionResponse = await fetch(
          'http://localhost:5000/api/recipes/my-contributions',
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`
            }
          }
        )

        const contributionData = await contributionResponse.json()

        if (notificationSettings.workoutReminders && historyResponse.ok) {
          const today = new Date().toISOString().split('T')[0]

          const workedOutToday = historyData.some((item) => {
            const workoutDate =
              item.date_time?.split(' ')[0] ||
              item.createdAt?.split('T')[0]

            return workoutDate === today
          })

         generatedNotifications.push({
  title: workedOutToday ? 'Workout Completed' : 'Workout Reminder',
  message: workedOutToday
    ? 'Great job! You completed a workout today.'
    : 'You have not completed a workout today. Start one AI-guided session.',
  route: workedOutToday ? '/progress' : '/workouts'
})
        }

        if (notificationSettings.recipeAlerts && contributionResponse.ok) {
          const pendingCount = contributionData.filter(
            (item) => item.status === 'pending'
          ).length

          const approvedCount = contributionData.filter(
            (item) => item.status === 'approved'
          ).length

          const rejectedCount = contributionData.filter(
            (item) => item.status === 'rejected'
          ).length

          if (pendingCount > 0) {
            generatedNotifications.push({
  title: 'Recipe Pending',
  message: `${pendingCount} contribution is waiting for admin review.`,
  route: '/profile'
})
          }

          if (approvedCount > 0) {
            generatedNotifications.push({
  title: 'Recipe Approved',
  message: `${approvedCount} contribution is approved and visible.`,
  route: '/profile'
})
          }

          if (rejectedCount > 0) {
            generatedNotifications.push({
  title: 'Recipe Rejected',
  message: `${rejectedCount} contribution needs changes.`,
  route: '/profile'
})
          }
        }

        if (notificationSettings.aiCoachTips && statsResponse.ok) {
          const totalWorkouts = statsData.totalWorkouts || 0
          const dayStreak = statsData.dayStreak || 0
          const totalCalories = statsData.totalCalories || 0

          let aiScore = 0

          if (totalWorkouts > 0) {
            aiScore = 50

            if (totalWorkouts >= 5) aiScore += 10
            if (totalWorkouts >= 10) aiScore += 10
            if (dayStreak >= 3) aiScore += 10
            if (dayStreak >= 7) aiScore += 10
            if (totalCalories >= 1000) aiScore += 10
          }
        generatedNotifications.push({
  title: 'AI Coach Tip',
  message:
    totalWorkouts === 0
      ? 'Start your first workout to generate personalized progress insights.'
      : aiScore < 60
        ? 'Build consistency with short daily workouts and clean form.'
        : aiScore < 80
          ? 'Your progress is improving. Keep training regularly.'
          : 'Excellent consistency! Keep maintaining your workout rhythm.',
  route: '/ai-coach'
})
        }

        setNotifications(generatedNotifications)
      } catch (error) {
        console.log(error)
      }
    }

    fetchNotifications()
  }, [])

  const notificationPanel = showNotifications ? (
    <div className="global-notification-panel">
      <h4>Notifications</h4>

      {notifications.length === 0 && (
        <div className="notification-item">
          <strong>No notifications</strong>
          <p>You are all caught up.</p>
        </div>
      )}

      {notifications.map((item, index) => (
  <div
    className="notification-item"
    key={index}
    onClick={() => {
      if (item.route) {
        setShowNotifications(false)
        navigate(item.route)
      }
    }}
  >
    <strong>{item.title}</strong>
    <p>{item.message}</p>
  </div>
))}
    </div>
  ) : null

  return (
    <>
      <button
        className="icon-btn notification-btn"
        onClick={() => {
  setShowNotifications(!showNotifications)
  setNotificationsSeen(true)
  localStorage.setItem('notificationsSeen', 'true')
}}
      >
        <Bell size={19} />

        {notifications.length > 0 && !notificationsSeen && (
          <span className="notification-badge">
            {notifications.length}
          </span>
        )}
      </button>

      {createPortal(notificationPanel, document.body)}
    </>
  )
}

export default NotificationBell