import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../api'

function UploadRecipeVideo() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [duration, setDuration] = useState('')
  const [preview, setPreview] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')} min`
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    setVideoFile(file)

    const url = URL.createObjectURL(file)
    setPreview(url)

    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = url

    video.onloadedmetadata = () => {
      setDuration(formatDuration(video.duration))
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setMessage('Video title is required.')
      return
    }

    if (!videoFile) {
      setMessage('Video file is required.')
      return
    }

    if (!thumbnailFile) {
      setMessage('Thumbnail image is required.')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const userInfo = JSON.parse(localStorage.getItem('userInfo'))

      const formData = new FormData()
      formData.append('title', title)
      formData.append('video', videoFile)
      formData.append('thumbnail', thumbnailFile)
      formData.append('duration', duration)

      const response = await fetch(`${API_URL}/api/recipes/video`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userInfo?.token}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Failed to submit video')
        return
      }

      setMessage('Video submitted for admin approval.')

      setTimeout(() => {
        navigate('/recipe-videos')
      }, 1200)
    } catch (error) {
      setMessage('Something went wrong')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-recipe-page">

      <div className="add-recipe-header">
        <span>COMMUNITY VIDEO RECIPE</span>
        <h1>Upload Recipe Video</h1>
        <p>Your video will be visible after admin approval.</p>
      </div>

      <form className="add-recipe-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Video Recipe Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Banana Smoothie Prep"
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Video *</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Thumbnail *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
          />
        </div>

        {thumbnailPreview && (
          <img
            className="thumbnail-upload-preview"
            src={thumbnailPreview}
            alt="Thumbnail preview"
          />
        )}

        {duration && (
          <p className="video-upload-info">
            Duration: {duration}
          </p>
        )}

        {preview && (
          <video
            className="video-upload-preview"
            src={preview}
            controls
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Video for Approval'}
        </button>

        {message && <p className="recipe-message">{message}</p>}

      </form>

    </div>
  )
}

export default UploadRecipeVideo