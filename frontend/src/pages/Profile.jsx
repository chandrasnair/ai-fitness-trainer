import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NotificationBell from '../components/NotificationBell'
import { API_URL } from '../api'

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
  Settings,
  Camera,
  Flame,
  Target,
  Trophy,
  Plus,
  X,
  Menu,
  Trash2,
  Award,
  Star,
  ShieldCheck
} from 'lucide-react'

function Profile() {
  const navigate = useNavigate()
  
  const fileInputRef = useRef(null)

const [showPhotoOptions, setShowPhotoOptions] = useState(false)

const [currentUser, setCurrentUser] = useState(
  JSON.parse(localStorage.getItem('userInfo'))
)
const userInfo = currentUser
const [showEditProfile, setShowEditProfile] = useState(false)

const [editForm, setEditForm] = useState({
  name: userInfo?.name || '',
  gender: userInfo?.gender || '',
  age: userInfo?.age || '',
  height: userInfo?.height || '',
  weight: userInfo?.weight || '',
  fitnessGoal: userInfo?.fitnessGoal || '',
  level: userInfo?.level || ''
})

const [showSubmitChoice, setShowSubmitChoice] = useState(false)
const [showChangePassword, setShowChangePassword] = useState(false)

const [passwordForm, setPasswordForm] = useState({
  currentPassword: '',
  newPassword: ''
})

const [passwordMessage, setPasswordMessage] = useState('')

  const [contributions, setContributions] = useState([])
  const [loading, setLoading] = useState(true)
const [profileStats, setProfileStats] = useState({
  dayStreak: 0,
  totalWorkouts: 0,
  totalCalories: 0,
  totalReps: 0,
  aiScore: 0
})


 const genderValue = userInfo?.gender?.toLowerCase()

const profileImage = userInfo?.profileImage
 ? `${API_URL}${userInfo.profileImage}`
  : genderValue === 'female'
    ? '/images/default-female.jpg'
    : genderValue === 'male'
      ? '/images/default-male.jpg'
      : '/images/default-female.jpg'
   const [showGenderPrompt, setShowGenderPrompt] = useState(false)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(
         `${API_URL}/api/recipes/my-contributions`,
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
          setContributions(data)
        } else {
          console.log(data.message)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
    const fetchProfileStats = async () => {
  try {
   const userInfo = JSON.parse(localStorage.getItem('userInfo'))

const response = await fetch(
  `${API_URL}/api/history/stats`,
  {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`
    }
  }
)
    const data = await response.json()

    if (response.ok) {
      const aiScore = calculateAiScore(data)

      setProfileStats({
        dayStreak: data.dayStreak || 0,
        totalWorkouts: data.totalWorkouts || 0,
        totalCalories: data.totalCalories || 0,
        totalReps: data.totalReps || 0,
        aiScore
      })
    }
  } catch (error) {
    console.log(error)
  }
}

fetchProfileStats()
  }, [])

  const getContributionImage = (item) => {
    if (item.type === 'written' && item.image) {
      return `${API_URL}${item.image}`
    }

    if (item.type === 'video' && item.thumbnail) {
      return `${API_URL}${item.thumbnail}`
    }

    return '/images/nutrition-summary.jpg'
  }

  const [activeContributionTab, setActiveContributionTab] = useState('all')



const updateUserProfile = async (updatedData) => {
  const response = await fetch(`${API_URL}/api/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo?.token}`
    },
    body: JSON.stringify(updatedData)
  })

  const data = await response.json()

  if (response.ok) {
    localStorage.setItem('userInfo', JSON.stringify(data))
    setCurrentUser(data)
    setShowPhotoOptions(false)
  } else {
    alert(data.message || 'Profile update failed')
  }
}

const handleProfileImageChange = async (event) => {
  const file = event.target.files[0]

  if (!file) return

  const imageData = new FormData()
  imageData.append('profileImage', file)

  const uploadResponse = await fetch(
    `${API_URL}/api/upload/profile`,
    {
      method: 'POST',
      body: imageData
    }
  )

  const uploadResult = await uploadResponse.json()

  if (!uploadResponse.ok) {
    alert(uploadResult.message || 'Image upload failed')
    return
  }

  await updateUserProfile({
    profileImage: uploadResult.imagePath
  })
}

const removeProfileImage = async () => {
  if (!userInfo?.gender || userInfo.gender === 'Not set') {
    setShowPhotoOptions(false)
    setShowGenderPrompt(true)
    return
  }

  await updateUserProfile({
    profileImage: ''
  })
}

const handleLogout = () => {
  localStorage.removeItem('userInfo')
  navigate('/login')
}
const handleEditChange = (e) => {
  setEditForm({
    ...editForm,
    [e.target.name]: e.target.value
  })
}

const [sidebarOpen, setSidebarOpen] = useState(false)
const handlePasswordChange = (e) => {
  setPasswordForm({
    ...passwordForm,
    [e.target.name]: e.target.value
  })
}

const handleChangePasswordSubmit = async (e) => {
  e.preventDefault()

  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
    setPasswordMessage('Both fields are required.')
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/api/users/change-password`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify(passwordForm)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setPasswordMessage(data.message || 'Password change failed')
      return
    }

    setPasswordMessage('Password changed successfully.')

    setPasswordForm({
      currentPassword: '',
      newPassword: ''
    })

    setTimeout(() => {
      setShowChangePassword(false)
      setPasswordMessage('')
    }, 1200)
  } catch (error) {
    setPasswordMessage('Something went wrong')
    console.log(error)
  }
}

const handleEditProfileSubmit = async (e) => {
  e.preventDefault()

  await updateUserProfile(editForm)

  setShowEditProfile(false)
}

const calculateAiScore = (stats) => {
  if (stats.totalWorkouts === 0) {
    return 0
  }

  let score = 50

  if (stats.totalWorkouts >= 5) {
    score += 10
  }

  if (stats.totalWorkouts >= 10) {
    score += 10
  }

  if (stats.dayStreak >= 3) {
    score += 10
  }

  if (stats.dayStreak >= 7) {
    score += 10
  }

  if (stats.totalCalories >= 1000) {
    score += 10
  }

  return Math.min(score, 100)
}

const achievements = [
  {
    title: '7 Day Streak',
    icon: <Trophy className="achievement-icon green" />,
    unlocked: profileStats.dayStreak >= 7
  },
  {
    title: 'Consistency Master',
    icon: <ShieldCheck className="achievement-icon blue" />,
    unlocked: profileStats.aiScore >= 80
  },
  {
    title: 'Calories Crusher',
    icon: <Flame className="achievement-icon orange" />,
    unlocked: profileStats.totalCalories >= 1000
  },
  {
    title: 'Form Expert',
    icon: <Target className="achievement-icon purple" />,
    unlocked: profileStats.aiScore >= 85
  },
  {
    title: 'Community Helper',
    icon: <Award className="achievement-icon cyan" />,
    unlocked: contributions.some(item => item.status === 'approved')
  },
  {
    title: 'Rising Star',
    icon: <Star className="achievement-icon gold" />,
    unlocked: profileStats.totalWorkouts >= 5
  }
]
const [showAllBadges, setShowAllBadges] = useState(false)
const handleContributionSubmit = () => {
  if (activeContributionTab === 'written') {
    navigate('/add-written-recipe')
    return
  }

  if (activeContributionTab === 'video') {
    navigate('/upload-recipe-video')
    return
  }

  setShowSubmitChoice(true)
}

const filteredContributions = contributions.filter((item) => {
  if (activeContributionTab === 'all') {
    return true
  }

  if (activeContributionTab === 'written') {
    return item.type === 'written'
  }

  if (activeContributionTab === 'video') {
    return item.type === 'video'
  }

  if (activeContributionTab === 'pending') {
    return item.status === 'pending'
  }

  return true
})

const [showAccountSettings, setShowAccountSettings] = useState(false)
const [showNotificationSettings, setShowNotificationSettings] = useState(false)
const [showThemeSettings, setShowThemeSettings] = useState(false)

const [notificationSettings, setNotificationSettings] = useState(
  JSON.parse(localStorage.getItem('notificationSettings')) || {
    workoutReminders: true,
    recipeAlerts: true,
    aiCoachTips: true
  }
)

const [themeMode, setThemeMode] = useState(
  localStorage.getItem('themeMode') || 'light'
)

const toggleNotificationSetting = (key) => {
  const updatedSettings = {
    ...notificationSettings,
    [key]: !notificationSettings[key]
  }

  setNotificationSettings(updatedSettings)

  localStorage.setItem(
    'notificationSettings',
    JSON.stringify(updatedSettings)
  )
}

const updateThemeMode = (mode) => {
  setThemeMode(mode)
  localStorage.setItem('themeMode', mode)

  if (mode === 'dark') {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
}

const handleDownloadMyData = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/users/download-data`,
      {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Failed to download data')
      return
    }

    const fileData = JSON.stringify(data, null, 2)

    const blob = new Blob([fileData], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'fitfusion-my-data.json'
    link.click()

    URL.revokeObjectURL(url)
  } catch (error) {
    alert('Something went wrong')
    console.log(error)
  }
}

const [showDeleteAccount, setShowDeleteAccount] = useState(false)
const [deleteConfirmText, setDeleteConfirmText] = useState('')
const [deleteMessage, setDeleteMessage] = useState('')
const handleDeleteAccount = async () => {
  if (deleteConfirmText !== 'DELETE') {
    setDeleteMessage('Type DELETE to confirm account deletion.')
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/api/users/delete-account`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo?.token}`
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setDeleteMessage(data.message || 'Failed to delete account')
      return
    }

    localStorage.removeItem('userInfo')
    navigate('/signup')
  } catch (error) {
    setDeleteMessage('Something went wrong')
    console.log(error)
  }
}

const handleGenderAvatarSelect = async (genderValue) => {
  await updateUserProfile({
    gender: genderValue,
    profileImage: ''
  })

  setShowGenderPrompt(false)
}

  return (
    <div className="profile-shell">

      <aside className={`profile-sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <button
  className="sidebar-close-btn"
  onClick={() => setSidebarOpen(false)}
>
  <X size={20} />
</button>
        <div className="profile-logo">
  <span className="profile-logo-icon">
    <Dumbbell size={20} />
  </span>

  <div>
    <h2>FitFusion</h2>
    <p>AI FITNESS</p>
  </div>
</div>

        <nav>
          <Link to="/"><Home size={20} /> Home</Link>
          <Link to="/workouts"><Dumbbell size={20} /> Workouts</Link>
          <Link to="/diet"><Utensils size={20} /> Diet</Link>
          <Link to="/written-recipes"><FileText size={20} /> Written Recipes</Link>
          <Link to="/recipe-videos"><Video size={20} /> Video Recipes</Link>
          <Link to="/progress"><TrendingUp size={20} /> Progress</Link>
          <Link to="/profile" className="active"><User size={20} /> Profile</Link>
          <Link to="/ai-coach"><Bot size={20} /> AI Coach</Link>

          {userInfo?.role === 'admin' && (
            <Link to="/admin"><ShieldCheck size={20} /> Admin Dashboard</Link>
          )}
        </nav>

      
      </aside>

      <main className="profile-content">

        <div className="profile-top">
          <button
  className="sidebar-toggle-btn"
  onClick={() => setSidebarOpen(true)}
>
  <Menu size={22} />
</button>
          <div>
            <span>USER FITNESS PROFILE</span>
            <h1>Profile</h1>
          </div>

          <div className="top-actions">
           <NotificationBell />
            <button
  className="icon-btn"
  onClick={() => setShowAccountSettings(true)}
>
  <Settings size={19} />
</button>
          </div>
        </div>

        <section className="profile-overview">
          <div className="profile-card-main">
            <div className="profile-photo-wrap">
  <img src={profileImage} alt="Profile" />

  <button
    className="photo-upload-btn"
    onClick={() => setShowPhotoOptions(!showPhotoOptions)}
  >
    <Camera size={18} />
  </button>

  {showPhotoOptions && (
    <div className="photo-options-popup">
      <button
  type="button"
  onClick={() => fileInputRef.current?.click()}
>
  Change Profile Picture
</button>
      <button
  type="button"
  onClick={removeProfileImage}
>
  Remove Profile Picture
</button>
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handleProfileImageChange}
    hidden
  />
</div>

            <div>
              <span className="active-badge">● ACTIVE MEMBER</span>
              <h2>{userInfo?.name || 'User'}</h2>
              <p>{userInfo?.email} · Member</p>
              <small>“Stronger every day, better every choice.”</small>
            </div>
          </div>

          <div className="mini-stat green">
  <Flame />
  <h3>{profileStats.dayStreak}</h3>
  <p>Day Streak</p>
</div>

<div className="mini-stat blue">
  <Dumbbell />
  <h3>{profileStats.totalWorkouts}</h3>
  <p>Workouts</p>
</div>

<div className="mini-stat orange">
  <Flame />
  <h3>{profileStats.totalCalories}</h3>
  <p>Calories</p>
</div>

<div className="mini-stat purple">
  <Trophy />
  <h3>{profileStats.aiScore}%</h3>
  <p>AI Score</p>
</div>
        </section>

        <section className="profile-grid-new">

          <div className="profile-panel">
            <h3><User size={20} /> Personal Details</h3>

            <div className="details-mini-grid">
              <p><span>Gender</span><strong>{userInfo?.gender || 'Not set'}</strong></p>
              <p><span>Age</span><strong>{userInfo?.age || 'Not set'}</strong></p>
              <p><span>Height</span><strong>{userInfo?.height || 'Not set'}</strong></p>
              <p><span>Weight</span><strong>{userInfo?.weight || 'Not set'}</strong></p>
              <p><span>Fitness Goal</span><strong>{userInfo?.fitnessGoal || 'Not set'}</strong></p>
              <p><span>Level</span><strong>{userInfo?.level || 'Beginner'}</strong></p>
            </div>
          </div>

          <div className="profile-panel">
            <h3><TrendingUp size={20} /> Activity Summary</h3>

            <div className="progress-line">
  <span>Total Workouts</span>
  <strong>{profileStats.totalWorkouts}</strong>
</div>
<div className="bar">
  <i style={{ width: `${Math.min(profileStats.totalWorkouts * 10, 100)}%` }}></i>
</div>

<div className="progress-line">
  <span>Calories Burned</span>
  <strong>{profileStats.totalCalories} kcal</strong>
</div>
<div className="bar orange-bar">
  <i style={{ width: `${Math.min(profileStats.totalCalories / 20, 100)}%` }}></i>
</div>

<div className="progress-line">
  <span>AI Consistency</span>
  <strong>{profileStats.aiScore}%</strong>
</div>
<div className="bar blue-bar">
  <i style={{ width: `${profileStats.aiScore}%` }}></i>
</div>
           <button
  className="full-progress-btn"
  onClick={() => navigate('/progress')}
>
  View Full Progress
</button>
          </div>

          <div className="profile-panel contributions-big">
            <div className="panel-head">
              <h3>My Contributions</h3>

              <button onClick={handleContributionSubmit}>
  <Plus size={16} /> Submit
</button>
            </div>

            <div className="tabs">
  <button
    className={activeContributionTab === 'all' ? 'active' : ''}
    onClick={() => setActiveContributionTab('all')}
  >
    All
  </button>

  <button
    className={activeContributionTab === 'written' ? 'active' : ''}
    onClick={() => setActiveContributionTab('written')}
  >
    Written Recipes
  </button>

  <button
    className={activeContributionTab === 'video' ? 'active' : ''}
    onClick={() => setActiveContributionTab('video')}
  >
    Video Recipes
  </button>

  <button
    className={activeContributionTab === 'pending' ? 'active' : ''}
    onClick={() => setActiveContributionTab('pending')}
  >
    Pending
  </button>
</div>
        <div className="contributions-scroll-area">

  {loading && (
    <p>Loading contributions...</p>
  )}

  {!loading && filteredContributions.length === 0 && (
    <p>No contributions found.</p>
  )}

  {filteredContributions.map((item) => (
    <div className="contribution-row" key={item._id}>
      <img src={getContributionImage(item)} alt={item.title} />

      <div>
        <h4>{item.title}</h4>

        <p>
          {item.type === 'written' ? 'Written Recipe' : 'Video Recipe'}{' '}
          <b className={item.status}>
            {item.status}
          </b>
        </p>
      </div>

      <Trash2 size={17} />
    </div>
  ))}

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

              <button onClick={() => setShowAllBadges(true)}>
  See All →
</button>
            </div>

            <div className="achievement-grid">

  {achievements.map((badge) => (
    <div
      className={`achievement-card ${badge.unlocked ? '' : 'locked-badge'}`}
      key={badge.title}
    >
      {badge.icon}
      <p>{badge.title}</p>

      {!badge.unlocked && (
        <small>Locked</small>
      )}
    </div>
  ))}

</div>

          </div>

          <div className="profile-panel quick-actions">
            <h3>Quick Actions</h3>
            <button onClick={() => setShowEditProfile(true)}>
  Edit Profile
</button>   
            <button onClick={() => setShowChangePassword(true)}>
  Change Password
</button>
           <button
  onClick={() => {
    setShowPhotoOptions(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }}
>
  Upload Photo
</button>
            <button onClick={() => setShowAccountSettings(true)}>
  Account Settings
</button>
            <button className="logout-btn" onClick={handleLogout}>
  Logout
</button>
          </div>
        </section>

      </main>

{showEditProfile && (
  <div className="profile-edit-overlay">
    <div className="profile-edit-modal">

      <button
        className="profile-edit-close"
        onClick={() => setShowEditProfile(false)}
      >
        ×
      </button>

      <span>EDIT PROFILE</span>
      <h2>Update Your Details</h2>

      <form onSubmit={handleEditProfileSubmit}>

        <div className="edit-form-grid">

          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={editForm.gender}
              onChange={handleEditChange}
            >
              <option value="">Select Gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={editForm.age}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label>Height</label>
            <input
              type="number"
              name="height"
              value={editForm.height}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label>Weight</label>
            <input
              type="number"
              name="weight"
              value={editForm.weight}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label>Fitness Goal</label>
            <select
              name="fitnessGoal"
              value={editForm.fitnessGoal}
              onChange={handleEditChange}
            >
              <option>Strength & Fat Loss</option>
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>General Fitness</option>
            </select>
          </div>

          <div>
            <label>Level</label>
            <select
              name="level"
              value={editForm.level}
              onChange={handleEditChange}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

        </div>

        <button className="save-profile-btn" type="submit">
          Save Changes
        </button>

      </form>

    </div>
  </div>
)}

{showChangePassword && (
  <div className="profile-edit-overlay">
    <div className="profile-edit-modal">

      <button
        className="profile-edit-close"
        onClick={() => {
          setShowChangePassword(false)
          setPasswordMessage('')
        }}
      >
        ×
      </button>

      <span>ACCOUNT SECURITY</span>
      <h2>Change Password</h2>

      <form onSubmit={handleChangePasswordSubmit}>

        <div className="edit-form-grid">

          <div>
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
            />
          </div>

        </div>

        <button className="save-profile-btn" type="submit">
          Update Password
        </button>

        {passwordMessage && (
          <p className="recipe-message">
            {passwordMessage}
          </p>
        )}

      </form>

    </div>
  </div>
)}

{showAllBadges && (
  <div className="profile-edit-overlay">
    <div className="profile-edit-modal">

      <button
        className="profile-edit-close"
        onClick={() => setShowAllBadges(false)}
      >
        ×
      </button>

      <span>ACHIEVEMENTS</span>
      <h2>All Badges</h2>

      <div className="achievement-grid">
        {achievements.map((badge) => (
          <div
            className={`achievement-card ${badge.unlocked ? '' : 'locked-badge'}`}
            key={badge.title}
          >
            {badge.icon}
            <p>{badge.title}</p>

            <small>
              {badge.unlocked ? 'Unlocked' : 'Locked'}
            </small>
          </div>
        ))}
      </div>

    </div>
  </div>
)}

{showSubmitChoice && (
  <div className="profile-edit-overlay">
    <div className="profile-edit-modal submit-choice-modal">

      <button
        className="profile-edit-close"
        onClick={() => setShowSubmitChoice(false)}
      >
        ×
      </button>

      <span>NEW CONTRIBUTION</span>
      <h2>What do you want to submit?</h2>

      <div className="submit-choice-actions">

        <button
          onClick={() => navigate('/add-written-recipe')}
        >
          <FileText size={20} />
          Add Written Recipe
        </button>

        <button
          onClick={() => navigate('/upload-recipe-video')}
        >
          <Video size={20} />
          Upload Video Recipe
        </button>

      </div>

    </div>
  </div>
)}

{showAccountSettings && (
  <div className="profile-edit-overlay">
    <div className="profile-edit-modal account-settings-modal">

      <button
        className="profile-edit-close"
        onClick={() => setShowAccountSettings(false)}
      >
        ×
      </button>

      <span>ACCOUNT SETTINGS</span>
      <h2>Manage Your Account</h2>

      <div className="account-settings-list">

        <button
          onClick={() => {
            setShowAccountSettings(false)
            setShowEditProfile(true)
          }}
        >
          Edit Profile
        </button>

        <button
          onClick={() => {
            setShowAccountSettings(false)
            setShowChangePassword(true)
          }}
        >
          Change Password
        </button>

        <button
          onClick={() => {
            setShowAccountSettings(false)
            setShowPhotoOptions(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          Change Profile Picture
        </button>

        <button
          onClick={() => {
            setShowAccountSettings(false)
            removeProfileImage()
          }}
        >
          Remove Profile Picture
        </button>

        <button
  onClick={() => {
    setShowAccountSettings(false)
    setShowNotificationSettings(true)
  }}
>
  Notification Settings
</button>

<button
  onClick={() => {
    setShowAccountSettings(false)
    setShowThemeSettings(true)
  }}
>
  Theme Settings
</button>

        <button onClick={handleDownloadMyData}>
  Download My Data
</button>
       <button
  className="danger-setting"
  onClick={() => {
    setShowAccountSettings(false)
    setShowDeleteAccount(true)
  }}
>
  Delete Account
</button>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </div>
  </div>
)}
{showNotificationSettings && (
  <div className="profile-edit-overlay">
    <div className="profile-edit-modal account-settings-modal">

      <button
        className="profile-edit-close"
        onClick={() => setShowNotificationSettings(false)}
      >
        ×
      </button>

      <span>NOTIFICATIONS</span>
      <h2>Notification Settings</h2>

      <div className="settings-toggle-list">

        <label>
          <span>Workout Reminders</span>
          <input
            type="checkbox"
            checked={notificationSettings.workoutReminders}
            onChange={() => toggleNotificationSetting('workoutReminders')}
          />
        </label>

        <label>
          <span>Recipe Approval Alerts</span>
          <input
            type="checkbox"
            checked={notificationSettings.recipeAlerts}
            onChange={() => toggleNotificationSetting('recipeAlerts')}
          />
        </label>

        <label>
          <span>AI Coach Tips</span>
          <input
            type="checkbox"
            checked={notificationSettings.aiCoachTips}
            onChange={() => toggleNotificationSetting('aiCoachTips')}
          />
        </label>

      </div>

    </div>
  </div>
)}

{showThemeSettings && (
  <div className="profile-edit-overlay">
    <div className="profile-edit-modal account-settings-modal">

      <button
        className="profile-edit-close"
        onClick={() => setShowThemeSettings(false)}
      >
        ×
      </button>

      <span>APPEARANCE</span>
      <h2>Theme Settings</h2>

      <div className="theme-choice-list">

        <button
          className={themeMode === 'light' ? 'active-theme-choice' : ''}
          onClick={() => updateThemeMode('light')}
        >
          Light Mode
        </button>

        <button
          className={themeMode === 'dark' ? 'active-theme-choice' : ''}
          onClick={() => updateThemeMode('dark')}
        >
          Dark Mode
        </button>

      </div>

    </div>
  </div>
)}

{showDeleteAccount && (
  <div className="profile-edit-overlay">
    <div className="profile-edit-modal account-settings-modal">

      <button
        className="profile-edit-close"
        onClick={() => {
          setShowDeleteAccount(false)
          setDeleteConfirmText('')
          setDeleteMessage('')
        }}
      >
        ×
      </button>

      <span>DANGER ZONE</span>
      <h2>Delete Account</h2>

      <p>
        This will permanently delete your account and your recipe/video contributions.
        This action cannot be undone.
      </p>

      <label className="delete-confirm-label">
        Type DELETE to confirm
      </label>

      <input
        className="delete-confirm-input"
        type="text"
        value={deleteConfirmText}
        onChange={(e) => setDeleteConfirmText(e.target.value)}
        placeholder="Type DELETE"
      />

      <button
        className="delete-account-final-btn"
        onClick={handleDeleteAccount}
      >
        Delete My Account
      </button>

      {deleteMessage && (
        <p className="recipe-message">
          {deleteMessage}
        </p>
      )}

    </div>
  </div>
)}

{showGenderPrompt && (
  <div className="profile-edit-overlay">
    <div className="profile-edit-modal account-settings-modal">

      <button
        className="profile-edit-close"
        onClick={() => setShowGenderPrompt(false)}
      >
        ×
      </button>

      <span>SELECT AVATAR</span>
      <h2>Choose Your Gender</h2>

      <p>
        Select your gender so FitFusion can show the correct default avatar
        after removing your profile picture.
      </p>

      <div className="avatar-choice-actions">

        <button onClick={() => handleGenderAvatarSelect('Female')}>
          <img src="/images/default-female.jpg" alt="Female avatar" />
          <span>Female Avatar</span>
        </button>

        <button onClick={() => handleGenderAvatarSelect('Male')}>
          <img src="/images/default-male.jpg" alt="Male avatar" />
          <span>Male Avatar</span>
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  )
}

export default Profile