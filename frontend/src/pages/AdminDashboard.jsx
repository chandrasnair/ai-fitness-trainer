import { useEffect, useState } from 'react'
import NotificationBell from '../components/NotificationBell'

import {
  Users,
  Clock,
  Video,
  Dumbbell,
  Check,
  X,
  Eye,
  Bell,
  Settings,
  ShieldCheck,
  FileText,
  PlayCircle
} from 'lucide-react'

function AdminDashboard() {
  const [pendingItems, setPendingItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const fetchPendingItems = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/recipes/pending',
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`
          }
        }
      )

      const data = await response.json()

      if (response.ok) {
        setPendingItems(data)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingItems()
  }, [])

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/${id}/approve`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userInfo?.token}`
          }
        }
      )

      if (response.ok) {
        setSelectedItem(null)
        fetchPendingItems()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/${id}/reject`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userInfo?.token}`
          }
        }
      )

      if (response.ok) {
        setSelectedItem(null)
        fetchPendingItems()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const pendingWritten = pendingItems.filter(
    item => item.type === 'written'
  ).length

  const pendingVideos = pendingItems.filter(
    item => item.type === 'video'
  ).length

  return (
    <div className="admin-page">

      <aside className="admin-sidebar">
        <h2>FitFusion</h2>
        <span>ADMIN PANEL</span>

        <nav>
          <a className="active">Dashboard</a>
          <a>Users</a>
          <a>Recipe Approvals</a>
          <a>Video Approvals</a>
          <a>Reports</a>
          <a>Settings</a>
        </nav>
      </aside>

      <main className="admin-main">

        <div className="admin-topbar">
          <div>
            <span>ADMIN CONTROL CENTER</span>
            <h1>Dashboard</h1>
          </div>

          <div className="top-actions">
            <NotificationBell />
            <button className="icon-btn"><Settings size={19} /></button>
          </div>
        </div>

        <section className="admin-stats">

          <div className="admin-stat-card">
            <Users size={24} />
            <h3>1</h3>
            <p>Total Admin</p>
          </div>

          <div className="admin-stat-card">
            <Clock size={24} />
            <h3>{pendingWritten}</h3>
            <p>Pending Recipes</p>
          </div>

          <div className="admin-stat-card">
            <Video size={24} />
            <h3>{pendingVideos}</h3>
            <p>Pending Videos</p>
          </div>

          <div className="admin-stat-card">
            <Dumbbell size={24} />
            <h3>Live</h3>
            <p>Workout Sessions</p>
          </div>

        </section>

        <section className="admin-grid">

          <div className="approval-panel">

            <div className="admin-section-head">
              <div>
                <span>CONTENT APPROVALS</span>
                <h2>Pending submissions</h2>
              </div>
            </div>

            {loading && (
              <p>Loading pending submissions...</p>
            )}

            {!loading && pendingItems.length === 0 && (
              <p>No pending submissions.</p>
            )}

            {pendingItems.map((item) => (
              <div className="approval-row" key={item._id}>

                <div className="approval-info">
                  {item.type === 'written' ? (
                    <FileText size={20} />
                  ) : (
                    <PlayCircle size={20} />
                  )}

                  <div>
                    <h3>{item.title}</h3>

                    <p>
                      {item.type === 'written'
                        ? 'Written Recipe'
                        : 'Video Recipe'} · Pending
                    </p>

                    <small>
                      Submitted by:{' '}
                      {item.submittedBy?.name || 'Unknown'} ·{' '}
                      {item.submittedBy?.email || 'No email'}
                    </small>
                  </div>
                </div>

                <div className="admin-actions">
                  <button className="view-user-btn">
                    <Eye size={15} />
                    Profile
                  </button>

                  <button
                    className="read-recipe-btn"
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.type === 'written'
                      ? 'Read Recipe'
                      : 'Watch Video'}
                  </button>

                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(item._id)}
                  >
                    <Check size={16} />
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(item._id)}
                  >
                    <X size={16} />
                  </button>
                </div>

              </div>
            ))}

          </div>

          <div className="activity-panel-admin">

            <div className="admin-section-head">
              <div>
                <span>LIVE ACTIVITY</span>
                <h2>Recent actions</h2>
              </div>
            </div>

            <div className="activity-admin-item">
              <ShieldCheck size={18} />
              <p>{pendingItems.length} submissions waiting for approval.</p>
            </div>

            <div className="activity-admin-item">
              <Users size={18} />
              <p>Admin account active.</p>
            </div>

            <div className="activity-admin-item">
              <Dumbbell size={18} />
              <p>Workout report generated.</p>
            </div>

          </div>

        </section>

      </main>

      {selectedItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">

            <button
              className="modal-close-btn"
              onClick={() => setSelectedItem(null)}
            >
              <X size={18} />
            </button>

            <span>
              {selectedItem.type === 'written'
                ? 'WRITTEN RECIPE'
                : 'VIDEO RECIPE'}
            </span>

            <h2>{selectedItem.title}</h2>

            {selectedItem.type === 'written' && (
              <>
                {selectedItem.image && (
                  <img
                    src={`http://localhost:5000${selectedItem.image}`}
                    alt={selectedItem.title}
                    className="admin-recipe-image"
                  />
                )}

                <h4>Ingredients</h4>
                <p>{selectedItem.ingredients}</p>

                <h4>Way of Cooking</h4>
                <p>{selectedItem.instructions}</p>
              </>
            )}

            {selectedItem.type === 'video' && (
              <>
                <video
                  controls
                  className="admin-video-preview"
                  src={`http://localhost:5000${selectedItem.videoUrl}`}
                />

                <p>
                  Duration: {selectedItem.duration || 'Not available'}
                </p>
              </>
            )}

            <small>
              Submitted by:{' '}
              {selectedItem.submittedBy?.name || 'Unknown'} ·{' '}
              {selectedItem.submittedBy?.email || 'No email'}
            </small>

            <div className="modal-actions">
              <button
                className="approve-btn"
                onClick={() => handleApprove(selectedItem._id)}
              >
                <Check size={16} />
                Approve
              </button>

              <button
                className="reject-btn"
                onClick={() => handleReject(selectedItem._id)}
              >
                <X size={16} />
                Reject
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboard