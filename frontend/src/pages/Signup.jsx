import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'


import {
  User,
  Mail,
  Lock,
  Camera,
  ArrowRight
} from 'lucide-react'


function Signup() {
  const slides = [
    {
      image: '/images/auth-slide-1.jpg',
      title: 'Start your AI fitness journey.',
      text: 'Create your profile and get personalized workout guidance.'
    },
    {
      image: '/images/auth-slide-2.jpg',
      title: 'Track your transformation.',
      text: 'Store workouts, reps, calories, goals, and progress history.'
    },
    {
      image: '/images/auth-slide-3.jpg',
      title: 'Train with purpose.',
      text: 'Let AI guide your fitness, nutrition, and recovery.'
    }
  ]

  const [activeSlide, setActiveSlide] = useState(0)

  const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  gender: '',
  age: '',
  height: '',
  weight: '',
  fitnessGoal: 'Strength & Fat Loss',
  level: 'Beginner',
  profileImage: ''
})

const [selectedImage, setSelectedImage] = useState(null)


const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}

const handleImageChange = (e) => {
  setSelectedImage(e.target.files[0])
}

const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    let uploadedImagePath = ''

    if (selectedImage) {
      const imageData = new FormData()
      imageData.append('profileImage', selectedImage)

      const uploadResponse = await fetch(
        'http://localhost:5000/api/upload/profile',
        {
          method: 'POST',
          body: imageData
        }
      )

      const uploadResult = await uploadResponse.json()

      if (!uploadResponse.ok) {
        alert(uploadResult.message)
        return
      }

      uploadedImagePath = uploadResult.imagePath
    }

    const signupData = {
      ...formData,
      profileImage: uploadedImagePath
    }

    const response = await fetch(
      'http://localhost:5000/api/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message)
      return
    }

    localStorage.setItem('userInfo', JSON.stringify(data))

    alert('Account created successfully')

    window.location.href = '/'

  } catch (error) {
    alert('Something went wrong')
    console.log(error)
  }
}


  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 3500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="signup-page">

      <div className="signup-form-side">

        <div className="signup-brand">
          <span>FITFUSION</span>
          <h1>Create account</h1>
          <p>Set up your profile to begin personalized AI fitness tracking.</p>
        </div>
<form
  className="signup-form"
  onSubmit={handleSubmit}
>

  <label className="profile-upload-circle">

  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    hidden
  />

  <Camera size={22} />

  <p>
    {selectedImage ? selectedImage.name : 'Upload Photo'}
  </p>

</label>

  <div className="signup-two-col">

    <div>
      <label>Full Name</label>
      <div className="signup-input">
        <User size={18} />
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
    </div>

    <div>
      <label>Email</label>
      <div className="signup-input">
        <Mail size={18} />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
    </div>

  </div>

  <div className="signup-two-col">

    <div>
      <label>Password</label>
      <div className="signup-input">
        <Lock size={18} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
    </div>

    <div>
      <label>Confirm</label>
      <div className="signup-input">
        <Lock size={18} />
        <input
          type="password"
          placeholder="Confirm"
        />
      </div>
    </div>

  </div>

  <div className="signup-two-col">

    <div>
      <label>Height</label>
      <div className="signup-input">
        <input
          type="number"
          name="height"
          placeholder="Enter height"
          value={formData.height}
          onChange={handleChange}
        />
      </div>
    </div>

    <div>
      <label>Weight</label>
      <div className="signup-input">
        <input
          type="number"
          name="weight"
          placeholder="Enter weight"
          value={formData.weight}
          onChange={handleChange}
        />
      </div>
    </div>

  </div>

  <div className="signup-two-col">

    <div>
      <label>Age</label>
      <div className="signup-input">
        <input
          type="number"
          name="age"
          placeholder="Enter age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>
    </div>

    <div>
      <label>Gender</label>
      <select
        className="signup-select"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      >
        <option value="">Select Gender</option>
        <option>Female</option>
        <option>Male</option>
        <option>Other</option>
      </select>
    </div>

  </div>

  <label>Fitness Goal</label>
  <select
    className="signup-select"
    name="fitnessGoal"
    value={formData.fitnessGoal}
    onChange={handleChange}
  >
    <option>Strength & Fat Loss</option>
    <option>Weight Loss</option>
    <option>Muscle Gain</option>
    <option>General Fitness</option>
  </select>

  <label>Level</label>
  <select
    className="signup-select"
    name="level"
    value={formData.level}
    onChange={handleChange}
  >
    
    <option>Beginner</option>
    <option>Intermediate</option>
    <option>Advanced</option>
  </select>

  <button className="signup-main-btn">
    Create Account
    <ArrowRight size={18} />
  </button>

  <p className="login-text">
  Already have an account? <Link to="/login">Login</Link>
</p>

</form>

      </div>

      <div
        className="signup-image-side"
        style={{
          backgroundImage:
            `linear-gradient(to top, rgba(5,12,5,.78), rgba(5,12,5,.18)), url(${slides[activeSlide].image})`
        }}
      >

        <div className="signup-slide-content">
          <span>AI FITNESS SYSTEM</span>
          <h2>{slides[activeSlide].title}</h2>
          <p>{slides[activeSlide].text}</p>

          <div className="slide-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={activeSlide === index ? 'active' : ''}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

export default Signup