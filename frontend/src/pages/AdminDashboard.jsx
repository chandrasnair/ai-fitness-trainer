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
            <button className="icon-btn"><Bell size={19} /></button>
            <button className="icon-btn"><Settings size={19} /></button>
          </div>
        </div>

        <section className="admin-stats">

          <div className="admin-stat-card">
            <Users size={24} />
            <h3>1,248</h3>
            <p>Total Users</p>
          </div>

          <div className="admin-stat-card">
            <Clock size={24} />
            <h3>18</h3>
            <p>Pending Recipes</p>
          </div>

          <div className="admin-stat-card">
            <Video size={24} />
            <h3>7</h3>
            <p>Pending Videos</p>
          </div>

          <div className="admin-stat-card">
            <Dumbbell size={24} />
            <h3>3,920</h3>
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

            <div className="approval-row">

              <div className="approval-info">
                <FileText size={20} />

                <div>
                  <h3>High Protein Recovery Bowl</h3>
                  <p>Written Recipe · Pending</p>
                  <small>
                    Submitted by: Chandra S Nair · snairchandra@gmail.com
                  </small>
                </div>
              </div>

              <div className="admin-actions">
                <button className="view-user-btn">
                  <Eye size={15} />
                  Profile
                </button>

                <button className="read-recipe-btn">
                  Read Recipe
                </button>

                <button className="approve-btn">
                  <Check size={16} />
                </button>

                <button className="reject-btn">
                  <X size={16} />
                </button>
              </div>

            </div>

            <div className="approval-row">

              <div className="approval-info">
                <PlayCircle size={20} />

                <div>
                  <h3>Banana Smoothie Prep</h3>
                  <p>Video Recipe · Pending</p>
                  <small>
                    Submitted by: Anu Joseph · anu@example.com
                  </small>
                </div>
              </div>

              <div className="admin-actions">
                <button className="view-user-btn">
                  <Eye size={15} />
                  Profile
                </button>

                <button className="read-recipe-btn">
                  Watch Video
                </button>

                <button className="approve-btn">
                  <Check size={16} />
                </button>

                <button className="reject-btn">
                  <X size={16} />
                </button>
              </div>

            </div>

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
              <p>New recipe submitted for approval.</p>
            </div>

            <div className="activity-admin-item">
              <Users size={18} />
              <p>New user registered today.</p>
            </div>

            <div className="activity-admin-item">
              <Dumbbell size={18} />
              <p>Workout report generated.</p>
            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default AdminDashboard