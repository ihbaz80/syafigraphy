'use client'
import { useState } from 'react'

const testimonials = [
  {
    id: 1,
    name: "Ahmad Zulkarnain",
    role: "Business Owner",
    content: "The calligraphy piece I ordered for my office is absolutely stunning. The quality and attention to detail exceeded my expectations. Highly recommended!",
    rating: 5,
    image: "/images/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    role: "Interior Designer",
    content: "I've used Syafigraphy's artwork in several of my projects. The pieces always receive compliments from clients. The artist's skill is truly remarkable.",
    rating: 5,
    image: "/images/testimonial-2.jpg"
  },
  {
    id: 3,
    name: "Mohammad Faisal",
    role: "Religious Scholar",
    content: "As someone who appreciates traditional Islamic art, I can say that these calligraphy pieces are authentic and beautifully executed. Perfect for any home or mosque.",
    rating: 5,
    image: "/images/testimonial-3.jpg"
  },
  {
    id: 4,
    name: "Nurul Ain",
    role: "Art Collector",
    content: "The custom piece I commissioned was delivered exactly as promised. The artist took time to understand my vision and created something truly special.",
    rating: 5,
    image: "/images/testimonial-4.jpg"
  },
  {
    id: 5,
    name: "Khairul Anwar",
    role: "Architect",
    content: "I've been collecting Arabic calligraphy for years, and Syafigraphy's work stands out for its quality and authenticity. A true master of the craft.",
    rating: 5,
    image: "/images/testimonial-5.jpg"
  }
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our valued customers have to say 
            about their experience with Syafigraphy.
          </p>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 lg:p-12 shadow-xl relative">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 text-amber-200">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            
            <div className="relative z-10">
              {/* Rating */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-amber-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              
              {/* Content */}
              <blockquote className="text-xl lg:text-2xl text-gray-700 text-center mb-8 leading-relaxed italic">
                "{testimonials[activeIndex].content}"
              </blockquote>
              
              {/* Author */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                  {testimonials[activeIndex].name.charAt(0)}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {testimonials[activeIndex].name}
                </h4>
                <p className="text-amber-600 font-medium">
                  {testimonials[activeIndex].role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white border-2 border-amber-200 rounded-full flex items-center justify-center hover:border-amber-400 hover:bg-amber-50 transition-colors duration-300"
            >
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === activeIndex ? 'bg-amber-600' : 'bg-amber-200'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white border-2 border-amber-200 rounded-full flex items-center justify-center hover:border-amber-400 hover:bg-amber-50 transition-colors duration-300"
            >
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">100%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">5.0</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  )
} 