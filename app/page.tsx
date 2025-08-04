import Image from 'next/image'
import Link from 'next/link'
import HeroSection from '../components/HeroSection'
import FeaturedGallery from '../components/FeaturedGallery'
import AboutSection from '../components/AboutSection'
import TestimonialsSection from '../components/TestimonialsSection'
import CTASection from '../components/CTASection'
import SlidingGallery from '../components/SlidingGallery'
import VideoSection from '../components/VideoSection'
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Analytics/>
      {/* Hero Section */}
      <HeroSection />
      <SlidingGallery />
      
      {/* Video Section */}
      <VideoSection />
      
      {/* Featured Gallery */}
      <FeaturedGallery />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Call to Action */}
      <CTASection />
    </div>
  )
}
