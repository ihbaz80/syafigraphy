'use client'
import { useState, useRef, useEffect } from 'react'

const videos = [
  {
    src: "/videos/vid01.mp4",
    poster: "/images/gallery/khat1.jpg",
    title: "Calligraphy Creation Process - Part 1",
    description: "Watch the intricate process of creating traditional Arabic calligraphy from start to finish."
  },
  {
    src: "/videos/vid02.mp4",
    poster: "/images/gallery/khat2.jpg",
    title: "Calligraphy Creation Process - Part 2",
    description: "Experience the art of Arabic calligraphy with detailed brushwork and technique demonstration."
  },
  {
    src: "/videos/vid03.mp4",
    poster: "/images/gallery/khat3.jpg",
    title: "Calligraphy Creation Process - Part 3",
    description: "Discover the mastery behind each stroke and the spiritual connection in Arabic calligraphy."
  },
  {
    src: "/videos/vid04.mp4",
    poster: "/images/gallery/khat4.jpg",
    title: "Calligraphy Creation Process - Part 4",
    description: "Witness the final touches and the transformation of blank canvas into timeless art."
  }
]

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsLoading(true)
        videoRef.current.play().then(() => {
          setIsLoading(false)
          setIsPlaying(true)
        }).catch((error) => {
          console.error('Error playing video:', error)
          setIsLoading(false)
          setIsPlaying(false)
        })
      }
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
    // Auto-advance to next video
    setCurrentVideo((prev) => (prev + 1) % videos.length)
  }

  const handleVideoChange = async (index: number) => {
    if (index === currentVideo) return // Don't change if same video
    
    setCurrentVideo(index)
    setIsPlaying(false)
    setIsLoading(true)
    
    if (videoRef.current) {
      // Reset video
      videoRef.current.currentTime = 0
      videoRef.current.pause()
      
      // Update video source
      const videoElement = videoRef.current
      const sourceElement = videoElement.querySelector('source')
      if (sourceElement) {
        sourceElement.src = videos[index].src
      }
      
      // Load the new video
      try {
        await videoElement.load()
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading video:', error)
        setIsLoading(false)
      }
    }
  }

  // Effect to handle video source changes
  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current
      
      const handleLoadedData = () => {
        setIsLoading(false)
      }
      
      const handleLoadStart = () => {
        setIsLoading(true)
      }
      
      const handleError = () => {
        console.error('Video loading error')
        setIsLoading(false)
        setIsPlaying(false)
      }
      
      videoElement.addEventListener('loadeddata', handleLoadedData)
      videoElement.addEventListener('loadstart', handleLoadStart)
      videoElement.addEventListener('error', handleError)
      
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData)
        videoElement.removeEventListener('loadstart', handleLoadStart)
        videoElement.removeEventListener('error', handleError)
      }
    }
  }, [currentVideo])

  const currentVideoData = videos[currentVideo]

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-orange-900/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="text-2xl lg:text-4xl font-arabic text-amber-600 dark:text-amber-400 mb-3">
            فن الخط العربي
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Watch the Art Come to Life
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Experience the mesmerizing process of Arabic calligraphy creation.
          </p>
        </div>

        {/* Video Container */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            {/* Video Background */}
            <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl overflow-hidden shadow-lg dark:shadow-gray-900/50">
              {/* Video Element with constrained height */}
              <div className="relative w-full" style={{ maxHeight: '400px' }}>
                <video
                  ref={videoRef}
                  className="w-full h-auto max-h-[400px] object-contain rounded-xl"
                  poster={currentVideoData.poster}
                  onEnded={handleVideoEnded}
                  onLoadStart={() => setIsLoading(true)}
                  onCanPlay={() => setIsLoading(false)}
                  onError={() => {
                    console.error('Video error')
                    setIsLoading(false)
                    setIsPlaying(false)
                  }}
                  muted
                  loop={false}
                  preload="metadata"
                >
                  <source src={currentVideoData.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400"></div>
                </div>
              )}

              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 transition-opacity duration-300 group-hover:bg-black/30 dark:group-hover:bg-black/50 rounded-xl">
                <button
                  onClick={handlePlayPause}
                  disabled={isLoading}
                  className="w-12 h-12 lg:w-14 lg:h-14 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600 dark:border-amber-400"></div>
                  ) : isPlaying ? (
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-amber-600 dark:text-amber-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 dark:bg-black/70 rounded-lg p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">
                    {isPlaying ? 'Playing' : 'Paused'} - {currentVideoData.title}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs opacity-75">Click to {isPlaying ? 'pause' : 'play'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-400 dark:bg-amber-500 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-orange-400 dark:bg-orange-500 rounded-full opacity-60 animate-pulse delay-1000"></div>
          </div>

          {/* Video Thumbnails */}
          <div className="mt-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 text-center">
              Choose a Video
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {videos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => handleVideoChange(index)}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentVideo === index 
                      ? 'border-amber-600 dark:border-amber-400 shadow-md' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500'
                  }`}
                >
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                    <img
                      src={video.poster}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-1 bg-white dark:bg-gray-800">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      Part {index + 1}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Video Description */}
          <div className="mt-4 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {currentVideoData.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed text-sm">
                {currentVideoData.description}
              </p>
              
              {/* Video Features */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="flex items-center justify-center space-x-1 text-amber-600 dark:text-amber-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-xs">HD</span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-amber-600 dark:text-amber-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-xs">Behind Scenes</span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-amber-600 dark:text-amber-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium text-xs">Step by Step</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-amber-600 dark:bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Loading...
                  </>
                ) : isPlaying ? (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Play
                  </>
                )}
              </button>
              
              <a
                href="/gallery"
                className="inline-flex items-center px-4 py-2 border-2 border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 font-semibold rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 transform hover:scale-105 text-sm"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Gallery
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 