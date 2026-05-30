import {
  Home,
  Dumbbell,
  Utensils,
  FileText,
  Video,
  TrendingUp,
  User,
  Bot,
  Bell,
  Menu,
  X,
  Settings,
  Camera,
  Flame,
  Target,
  Calendar,
  Trophy,
  Plus,
  Trash2,

  Award,
  Medal,
  Star,
  Crown,
  ShieldCheck

} from 'lucide-react'

function Profile() {
  return (
    <div className="profile-shell">

      <aside className="profile-sidebar">
        <div className="profile-logo">
          <span>🌿</span>
          <div>
            <h2>FITFUSION</h2>
            <p>AI FITNESS</p>
          </div>
        </div>

        <nav>
          <a><Home size={20} /> Home</a>
          <a><Dumbbell size={20} /> Workouts</a>
          <a><Utensils size={20} /> Diet</a>
          <a><FileText size={20} /> Written Recipes</a>
          <a><Video size={20} /> Video Recipes</a>
          <a><TrendingUp size={20} /> Progress</a>
          <a className="active"><User size={20} /> Profile</a>
          <a><Bot size={20} /> AI Coach</a>
        </nav>

        <div className="premium-box">
          <h3>👑 Go Premium</h3>
          <p>Unlock exclusive content & features</p>
          <button>Upgrade Now</button>
        </div>
      </aside>

      <main className="profile-content">

        <div className="profile-top">
          <div>
            <span>USER FITNESS PROFILE</span>
            <h1>Profile </h1>
          </div>

          <div className="top-actions">
            <button className="icon-btn"><Bell size={19} /></button>
            <button className="icon-btn"><Settings size={19} /></button>
          </div>
        </div>

        <section className="profile-overview">
          <div className="profile-card-main">
            <div className="profile-photo-wrap">
              <img src="/images/profile-user.jpg" alt="" />
              <button className="photo-upload-btn"><Camera size={18} /></button>
            </div>

            <div>
              <span className="active-badge">● ACTIVE MEMBER</span>
              <h2>Chandra S Nair</h2>
              <p>snairchandra@gmail.com · Member since May 2024</p>
              <small>“Stronger every day, better every choice.”</small>
            </div>
          </div>

          <div className="mini-stat green"><Flame /><h3>32</h3><p>Day Streak</p></div>
          <div className="mini-stat blue"><Dumbbell /><h3>128</h3><p>Workouts</p></div>
          <div className="mini-stat orange"><Flame /><h3>2,450</h3><p>Calories</p></div>
          <div className="mini-stat purple"><Trophy /><h3>85%</h3><p>AI Score</p></div>
        </section>

        <section className="profile-grid-new">

          <div className="profile-panel">
            <h3><User size={20} /> Personal Details</h3>

            <div className="details-mini-grid">
              <p><span>Gender</span><strong>Female</strong></p>
              <p><span>Age</span><strong>21 Years</strong></p>
              <p><span>Height</span><strong>172 cm</strong></p>
              <p><span>Weight</span><strong>68 kg</strong></p>
              <p><span>Fitness Goal</span><strong>Strength & Fat Loss</strong></p>
              <p><span>Level</span><strong>Intermediate</strong></p>
            </div>
          </div>

          <div className="profile-panel">
            <h3><TrendingUp size={20} /> Activity Summary</h3>

            <div className="progress-line"><span>Total Workouts</span><strong>18</strong></div>
            <div className="bar"><i style={{ width: '70%' }}></i></div>

            <div className="progress-line"><span>Calories Burned</span><strong>2,450 kcal</strong></div>
            <div className="bar orange-bar"><i style={{ width: '58%' }}></i></div>

            <div className="progress-line"><span>Consistency</span><strong>85%</strong></div>
            <div className="bar blue-bar"><i style={{ width: '85%' }}></i></div>

            <button className="full-progress-btn">View Full Progress</button>
          </div>

          <div className="profile-panel contributions-big">
            <div className="panel-head">
              <h3>My Contributions</h3>
              <button><Plus size={16} /> Submit</button>
            </div>

            <div className="tabs">
              <button className="active">All</button>
              <button>Written Recipes</button>
              <button>Video Recipes</button>
              <button>Pending</button>
            </div>

            <div className="contribution-row">
              <img src="/images/lunch-thumb.jpg" alt="" />
              <div>
                <h4>High Protein Recovery Bowl</h4>
                <p>Written Recipe <b className="pending">Pending</b></p>
              </div>
              <Trash2 size={17} />
            </div>

            <div className="contribution-row">
              <img src="/images/smoothie.jpg" alt="" />
              <div>
                <h4>Banana Smoothie Prep</h4>
                <p>Video Recipe <b className="approved">Approved</b></p>
              </div>
              <Trash2 size={17} />
            </div>
          </div>

        </section>

        <section className="profile-bottom-grid">
          <div className="profile-panel achievements">

  <div className="achievements-header">
    <h3>
      <Trophy size={20} />
      Achievements & Badges
    </h3>

    <button>See All →</button>
  </div>

  <div className="achievement-grid">

    <div className="achievement-card">
      <Trophy className="achievement-icon green" />
      <p>7 Day Streak</p>
    </div>

    <div className="achievement-card">
      <ShieldCheck className="achievement-icon blue" />
      <p>Consistency Master</p>
    </div>

    <div className="achievement-card">
      <Flame className="achievement-icon orange" />
      <p>Calories Crusher</p>
    </div>

    <div className="achievement-card">
      <Target className="achievement-icon purple" />
      <p>Form Expert</p>
    </div>

    <div className="achievement-card">
      <Award className="achievement-icon cyan" />
      <p>Community Helper</p>
    </div>

    <div className="achievement-card">
      <Star className="achievement-icon gold" />
      <p>Rising Star</p>
    </div>

  </div>

</div>

          <div className="profile-panel quick-actions">
            <h3>Quick Actions</h3>
            <button>Edit Profile</button>
            <button>Change Goal</button>
            <button>Upload Photo</button>
            <button>Account Settings</button>
          </div>
        </section>

      </main>
    </div>
  )
}

export default Profile