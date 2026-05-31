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

        <form className="signup-form">

          <div className="profile-upload-circle">
            <Camera size={22} />
            <p>Upload Photo</p>
          </div>

          <div className="signup-two-col">

            <div>
              <label>Full Name</label>
              <div className="signup-input">
                <User size={18} />
                <input type="text" placeholder="Enter name" />
              </div>
            </div>

            <div>
              <label>Email</label>
              <div className="signup-input">
                <Mail size={18} />
                <input type="email" placeholder="Enter email" />
              </div>
            </div>

          </div>

          <div className="signup-two-col">

            <div>
              <label>Password</label>
              <div className="signup-input">
                <Lock size={18} />
                <input type="password" placeholder="Password" />
              </div>
            </div>

            <div>
              <label>Confirm</label>
              <div className="signup-input">
                <Lock size={18} />
                <input type="password" placeholder="Confirm" />
              </div>
            </div>

          </div>

          <div className="signup-two-col">

            <div>
              <label>Height</label>
              <div className="signup-input">
                <input type="text" placeholder="172 cm" />
              </div>
            </div>

            <div>
              <label>Weight</label>
              <div className="signup-input">
                <input type="text" placeholder="68 kg" />
              </div>
            </div>

          </div>

          <label>Fitness Goal</label>
          <select className="signup-select">
            <option>Strength & Fat Loss</option>
            <option>Weight Loss</option>
            <option>Muscle Gain</option>
            <option>General Fitness</option>
          </select>

          <button className="signup-main-btn">
            Create Account
            <ArrowRight size={18} />
          </button>

          <p className="login-text">
            Already have an account? <a>Login</a>
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