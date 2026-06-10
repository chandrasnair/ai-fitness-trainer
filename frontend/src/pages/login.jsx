import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Mail, Lock, ArrowRight } from 'lucide-react'


function Login() {
 

  const slides = [
    {
      image: '/images/auth-slide-1.jpg',
      title: 'Train smarter with AI.',
      text: 'Personalized coaching that adapts to your progress.'
    },
    {
      image: '/images/auth-slide-2.jpg',
      title: 'Track every rep.',
      text: 'Measure form, calories, consistency, and workout history.'
    },
    {
      image: '/images/auth-slide-3.jpg',
      title: 'Build discipline daily.',
      text: 'Small actions become visible progress over time.'
    }
  ]

  const [activeSlide, setActiveSlide] = useState(0)
const [formData, setFormData] = useState({
  email: '',
  password: ''
})

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}

const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const response = await fetch(
      'http://localhost:5000/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message)
      return
    }

    localStorage.setItem('userInfo', JSON.stringify(data))

    alert('Login successful')

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
    <div className="login-page">

      <div className="login-form-side">

        <div className="login-brand">
          <span>FITFUSION</span>
          <h1>Welcome back</h1>
          <p>Login to continue your AI fitness journey.</p>
        </div>

        <form
  className="login-form"
  onSubmit={handleSubmit}
>

          <label>Email Address</label>
          <div className="login-input">
            <Mail size={18} />
           <input
  type="email"
  name="email"
  placeholder="Enter your email"
  value={formData.email}
  onChange={handleChange}
/>
          </div>

          <label>Password</label>
          <div className="login-input">
            <Lock size={18} />
            <input
  type="password"
  name="password"
  placeholder="Enter your password"
  value={formData.password}
  onChange={handleChange}
/>
          </div>

          <div className="login-options">
            <span>Remember me</span>
            <a>Forgot password?</a>
          </div>

          <button className="login-main-btn">
            Login
            <ArrowRight size={18} />
          </button>

         <p className="login-text">
  Don’t have an account? <Link to="/signup">Sign up</Link>
</p>  

        </form>









      </div>

      <div
        className="login-image-side"
        style={{
          backgroundImage:
            `linear-gradient(to top, rgba(5,12,5,.78), rgba(5,12,5,.18)), url(${slides[activeSlide].image})`
        }}
      >

        <div className="login-slide-content">
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

export default Login