"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const images = [
  {
    src: "/images/gallery/khat1.jpg",
    alt: "Arabic calligraphy artwork - Traditional verse"
  },
  {
    src: "/images/gallery/khat2.jpg",
    alt: "Arabic calligraphy artwork - Beautiful script"
  },
  {
    src: "/images/gallery/khat3.jpg",
    alt: "Arabic calligraphy artwork - Artistic composition"
  },
  {
    src: "/images/gallery/khat4.jpg",
    alt: "Arabic calligraphy artwork - Elegant design"
  },
  {
    src: "/images/gallery/khat6.jpg",
    alt: "Arabic calligraphy artwork - Modern interpretation"
  },
  {
    src: "/images/gallery/khat7.jpg",
    alt: "Arabic calligraphy artwork - Classic style"
  },
  {
    src: "/images/gallery/khat8.jpg",
    alt: "Arabic calligraphy artwork - Contemporary piece"
  },
  {
    src: "/images/gallery/khat9.jpg",
    alt: "Arabic calligraphy artwork - Traditional beauty"
  },
  {
    src: "/images/gallery/khat10.jpg",
    alt: "Arabic calligraphy artwork - Artistic expression"
  },
  {
    src: "/images/gallery/khat11.jpg",
    alt: "Arabic calligraphy artwork - Handcrafted excellence"
  },
  {
    src: "/images/gallery/khat12.jpg",
    alt: "Arabic calligraphy artwork - Timeless art"
  },
  {
    src: "/images/gallery/khat13.jpg",
    alt: "Arabic calligraphy artwork - Cultural heritage"
  },
  {
    src: "/images/gallery/khat14.jpg",
    alt: "Arabic calligraphy artwork - Masterpiece"
  },
  {
    src: "/images/gallery/khat16.jpg",
    alt: "Arabic calligraphy artwork - Spiritual art"
  },
  {
    src: "/images/gallery/khat17.jpg",
    alt: "Arabic calligraphy artwork - Traditional craft"
  },
  {
    src: "/images/gallery/khat18.jpg",
    alt: "Arabic calligraphy artwork - Artistic tradition"
  },
  {
    src: "/images/gallery/khat19.jpg",
    alt: "Arabic calligraphy artwork - Beautiful script"
  },
  {
    src: "/images/gallery/khat20.jpg",
    alt: "Arabic calligraphy artwork - Handcrafted beauty"
  }
]

export default function SlidingGallery() {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const total = images.length
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const goTo = (idx: number) => setCurrent((idx + total) % total)
  const prev = () => goTo(current - 1)
  const next = () => goTo(current + 1)

  // Auto-slide effect
  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setCurrent((prevIdx) => (prevIdx + 1) % total)
    }, 3000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isHovered, total])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-orange-900/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <div className="text-4xl lg:text-6xl font-arabic text-amber-600 dark:text-amber-400 mb-4">
              فن الخط العربي
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Artworks
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Explore our collection of handcrafted Arabic calligraphy pieces, each telling a unique story 
              of tradition, passion, and artistic excellence. From traditional verses to contemporary designs, 
              every piece is created with meticulous attention to detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="/gallery"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 dark:bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                View Gallery
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a 
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 font-semibold rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
            
            {/* Image Counter */}
            <div className="mt-8 text-center lg:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {current + 1} of {total} artworks
              </p>
            </div>
          </div>

          {/* Right Column - Carousel */}
          <div
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 aspect-square">
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-400"></div>
                </div>
              )}
              
              {/* Image */}
              <Image
                src={images[current].src}
                alt={images[current].alt}
                fill
                className="object-cover object-center transition-all duration-700"
                onLoad={handleImageLoad}
                priority={current === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
            
            {/* Left Arrow */}
            <button
              aria-label="Previous image"
              onClick={prev}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 text-amber-600 dark:text-amber-400 p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 hover:scale-110 transition-all duration-300 z-10"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Right Arrow */}
            <button
              aria-label="Next image"
              onClick={next}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 text-amber-600 dark:text-amber-400 p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 hover:scale-110 transition-all duration-300 z-10"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => goTo(idx)}
                  className={`w-3 h-3 rounded-full border-2 border-amber-600 dark:border-amber-400 transition-all duration-300 hover:scale-125 ${
                    idx === current ? 'bg-amber-600 dark:bg-amber-400 scale-125' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
            
            {/* Auto-play Indicator */}
            <div className="text-center mt-4">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className={`w-2 h-2 rounded-full ${isHovered ? 'bg-red-400' : 'bg-green-400'} animate-pulse`}></div>
                <span>{isHovered ? 'Paused' : 'Auto-playing'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 