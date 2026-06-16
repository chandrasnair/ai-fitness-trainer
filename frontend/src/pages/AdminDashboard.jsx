import { useEffect, useRef, useState } from 'react'
import NotificationBell from '../components/NotificationBell'
import { API_URL } from '../api'

import {
  Users,
  Clock,
  Video,
  Dumbbell,
  Check,
  X,
  Eye,
  Settings,
  ShieldCheck,
  FileText,
  PlayCircle
} from 'lucide-react'

function AdminDashboard() {
  const [pendingItems, setPendingItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeAdminPopup, setActiveAdminPopup] = useState(null)
  const approvalSectionRef = useRef(null)

  const [adminCounts, setAdminCounts] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalAccounts: 0
  })

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const fetchPendingItems = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/recipes/pending`,
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

  const fetchAdminCounts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/users/count`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`
          }
        }
      )

      const data = await response.json()

      if (response.ok) {
        setAdminCounts({
          totalUsers: data.totalUsers || 0,
          totalAdmins: data.totalAdmins || 0,
          totalAccounts: data.totalAccounts || 0
        })
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPendingItems()
    fetchAdminCounts()
  }, [])

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/recipes/${id}/approve`,
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
       `${API_URL}/api/recipes/${id}/reject`,
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

  const scrollToApprovalSection = () => {
  setActiveAdminPopup(null)

  setTimeout(() => {
    approvalSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }, 100)
}

  return (
    <div className="admin-page">

      <aside className="admin-sidebar">
        <h2>FitFusion</h2>
        <span>ADMIN PANEL</span>

        <nav>
          <button
            className={!activeAdminPopup ? 'active' : ''}
            onClick={() => setActiveAdminPopup(null)}
          >
            Dashboard
          </button>

          <button onClick={() => setActiveAdminPopup('users')}>
            Users
          </button>

          <button onClick={() => setActiveAdminPopup('recipes')}>
            Recipe Approvals
          </button>

          <button onClick={() => setActiveAdminPopup('videos')}>
            Video Approvals
          </button>

          <button onClick={() => setActiveAdminPopup('reports')}>
            Reports
          </button>

          <button onClick={() => setActiveAdminPopup('settings')}>
            Settings
          </button>
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
            <button
              className="icon-btn"
              onClick={() => setActiveAdminPopup('settings')}
            >
              <Settings size={19} />
            </button>
          </div>
        </div>

        <section className="admin-stats">

          <div className="admin-stat-card">
            <Users size={24} />
            <h3>{adminCounts.totalUsers}</h3>
            <p>Total Users</p>
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

          <div className="approval-panel" ref={approvalSectionRef}>

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
              <p>{adminCounts.totalUsers} member users registered.</p>
            </div>

            <div className="activity-admin-item">
              <Dumbbell size={18} />
              <p>Workout report generated.</p>
            </div>

          </div>

        </section>

      </main>

      {activeAdminPopup && (
        <div className="admin-side-popup-overlay">
          <div className="admin-side-popup">

            <button
              className="admin-side-popup-close"
              onClick={() => setActiveAdminPopup(null)}
            >
              <X size={18} />
            </button>

            {activeAdminPopup === 'users' && (
              <>
                <span>USER MANAGEMENT</span>
                <h2>Users Overview</h2>

                <div className="admin-popup-count-grid">
                  <div>
                    <h3>{adminCounts.totalUsers}</h3>
                    <p>Member Users</p>
                  </div>

                  <div>
                    <h3>{adminCounts.totalAdmins}</h3>
                    <p>Admin Accounts</p>
                  </div>

                  <div>
                    <h3>{adminCounts.totalAccounts}</h3>
                    <p>Total Accounts</p>
                  </div>
                </div>
              </>
            )}

            {activeAdminPopup === 'recipes' && (
              <>
                <span>RECIPE APPROVALS</span>
                <h2>Written Recipe Approvals</h2>

                <div className="admin-popup-count-grid">
                  <div>
                    <h3>{pendingWritten}</h3>
                    <p>Pending Written Recipes</p>
                  </div>
                </div>

                <p className="admin-popup-note">
                  Pending written recipes are listed in the main dashboard approval section.
                </p>
                <button
  className="admin-popup-action-btn"
  onClick={scrollToApprovalSection}
>
  Go to Approval Section
</button>
              </>
            )}

            {activeAdminPopup === 'videos' && (
              <>
                <span>VIDEO APPROVALS</span>
                <h2>Video Recipe Approvals</h2>

                <div className="admin-popup-count-grid">
                  <div>
                    <h3>{pendingVideos}</h3>
                    <p>Pending Video Recipes</p>
                  </div>
                </div>

                <p className="admin-popup-note">
                  Pending video recipes are listed in the main dashboard approval section.
                </p>
                <button
  className="admin-popup-action-btn"
  onClick={scrollToApprovalSection}
>
  Go to Approval Section
</button>
              </>
            )}

            {activeAdminPopup === 'reports' && (
              <>
                <span>ADMIN REPORTS</span>
                <h2>Platform Summary</h2>

                <div className="admin-popup-count-grid">
                  <div>
                    <h3>{pendingItems.length}</h3>
                    <p>Total Pending</p>
                  </div>

                  <div>
                    <h3>{pendingWritten}</h3>
                    <p>Written Pending</p>
                  </div>

                  <div>
                    <h3>{pendingVideos}</h3>
                    <p>Video Pending</p>
                  </div>
                </div>
              </>
            )}

            {activeAdminPopup === 'settings' && (
              <>
                <span>ADMIN SETTINGS</span>
                <h2>Settings</h2>

                <p className="admin-popup-note">
                  Admin can verify user submissions, approve recipes, reject unsuitable content,
                  and monitor platform activity from this dashboard.
                </p>

                <div className="admin-popup-count-grid">
                  <div>
                    <h3>Active</h3>
                    <p>Admin Mode</p>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

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
                    src={`${API_URL}${selectedItem.image}`}
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
                  src={`${API_URL}${selectedItem.videoUrl}`}
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