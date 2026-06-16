import { useEffect, useState } from 'react'
import { Search, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../api'

function RecipeVideos() {
  const navigate = useNavigate()

  const defaultVideos = [
    {
      _id: 'default-video-1',
      title: 'Greek Yogurt Protein Bowl',
      duration: '0:20 min',
      thumbnail: '/images/greek-yogurt.jpg',
      video: '/videos/greek-yogurt.mp4',
      source: 'default'
    },
    {
      _id: 'default-video-2',
      title: 'Peanut Butter Banana Smoothie',
      duration: '0:39 min',
      thumbnail: '/images/smoothie-thumb.jpg',
      video: '/videos/smoothie.mp4',
      source: 'default'
    },
    {
      _id: 'default-video-3',
      title: 'Grilled Chicken Wrap',
      duration: '0:12 min',
      thumbnail: '/images/chicken-wrap.jpg',
      video: '/videos/chicken-wrap.mp4',
      source: 'default'
    },
    {
      _id: 'default-video-4',
      title: 'Avocado Toast Deluxe',
      duration: '0:37 min',
      thumbnail: '/images/avacado-toast.jpg',
      video: '/videos/avacado-toast.mp4',
      source: 'default'
    }
  ]

  const [uploadedVideos, setUploadedVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(defaultVideos[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApprovedVideos = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/recipes/videos`
        )

        const data = await response.json()

        if (response.ok) {
          const formattedVideos = data.map((item) => ({
  _id: item._id,
  title: item.title,
  duration: item.duration || 'Duration not available',
  thumbnail: item.thumbnail
  ? `${API_URL}${item.thumbnail}`
  : '',
video: `${API_URL}${item.videoUrl}`,
  source: 'uploaded'
}))

          setUploadedVideos(formattedVideos)
        } else {
          console.log(data.message)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchApprovedVideos()
  }, [])

  const allVideos = [
    ...defaultVideos,
    ...uploadedVideos
  ]

  const filteredVideos = allVideos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="recipe-videos-page">

      <div className="recipes-header">

        <div className="recipes-heading-block">
          <span>VIDEO LIBRARY</span>
          <h1>Recipe Videos</h1>
        </div>

        <div className="recipe-header-actions">

          <div className="recipe-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="add-recipe-btn"
            onClick={() => navigate('/upload-recipe-video')}
          >
            + Upload Video
          </button>

        </div>

      </div>

      <div className="video-player-section">

        <video
          controls
          src={selectedVideo.video}
          poster={selectedVideo.thumbnail || ''}
        />

        <h2>
          {selectedVideo.title}
        </h2>

      </div>

      {loading && (
        <p>Loading approved videos...</p>
      )}

      {!loading && filteredVideos.length === 0 && (
        <p>No recipe videos found.</p>
      )}

      <div className="video-list">

        {filteredVideos.map((video) => (

          <div
            key={video._id}
            className="video-item"
            onClick={() =>
              setSelectedVideo(video)
            }
          >

          {video.thumbnail ? (
  <img
    src={video.thumbnail}
    alt={video.title}
  />
) : (
  <div className="uploaded-video-thumb">
    <video
      src={video.video}
      muted
      preload="metadata"
    />
    <div className="thumb-play-overlay">
      <Play size={20} fill="currentColor" />
    </div>
  </div>
)}

            <div>

              <h3>{video.title}</h3>

              <p>
                {video.duration}
              </p>

              <small>
                {video.source === 'default'
                  ? 'FitFusion Video'
                  : 'Community Approved Video'}
              </small>

            </div>

            <Play size={18} />

          </div>

        ))}

      </div>

    </div>
  )
}

export default RecipeVideos