import { useState } from 'react'
import { Search, Play } from 'lucide-react'

function RecipeVideos() {

  const videos = [
    {
      title: 'Greek Yogurt Protein Bowl',
      duration: '0:20 min',
      thumbnail: '/images/greek-yogurt.jpg',
      video: '/videos/greek-yogurt.mp4'
    },
    {
      title: 'Peanut Butter Banana Smoothie',
      duration: '0:39 min',
      thumbnail: '/images/smoothie-thumb.jpg',
      video: '/videos/smoothie.mp4'
    },
    {
      title: 'Grilled Chicken Wrap',
      duration: '0:12 min',
      thumbnail: '/images/chicken-wrap.jpg',
      video: '/videos/chicken-wrap.mp4'
    },
    {
      title: 'Avocado Toast Deluxe',
      duration: '0:37 min',
      thumbnail: '/images/avacado-toast.jpg',
      video: '/videos/avacado-toast.mp4'
    }
  ]

  const [selectedVideo, setSelectedVideo] =
    useState(videos[0])

  return (
    <div className="recipe-videos-page">

      <div className="recipes-heading-block">

        <span>VIDEO LIBRARY</span>

        <h1>Recipe Videos</h1>

      </div>

      <div className="recipe-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search recipes..."
        />

      </div>

      <div className="video-player-section">

        <video
          controls
          src={selectedVideo.video}
          poster={selectedVideo.thumbnail}
        />

        <h2>
          {selectedVideo.title}
        </h2>

      </div>

      <div className="video-list">

        {videos.map((video) => (

          <div
            key={video.title}
            className="video-item"
            onClick={() =>
              setSelectedVideo(video)
            }
          >

            <img
              src={video.thumbnail}
              alt=""
            />

            <div>

              <h3>{video.title}</h3>

              <p>
                {video.duration}
              </p>

            </div>

            <Play size={18} />

          </div>

        ))}

      </div>

    </div>
  )
}

export default RecipeVideos