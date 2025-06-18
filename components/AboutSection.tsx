'use client'
import Link from 'next/link'

export default function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                About the Artist
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Meet the Master
              <span className="block text-amber-600">Calligrapher</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              With over 5 years of dedicated practice in Arabic calligraphy, I have developed a deep passion 
              for transforming sacred texts and beautiful verses into visual masterpieces. Each stroke carries 
              meaning, each curve tells a story.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              My journey began with traditional Islamic calligraphy, studying under master calligraphers 
              and learning the ancient techniques that have been passed down through generations. Today, 
              I blend traditional methods with contemporary design to create unique pieces that honor 
              both heritage and modern aesthetics.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Handcrafted</h4>
                  <p className="text-sm text-gray-600">Each piece is individually crafted by hand</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Premium Materials</h4>
                  <p className="text-sm text-gray-600">Using the finest papers and inks available</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Custom Designs</h4>
                  <p className="text-sm text-gray-600">Personalized artwork for special occasions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Authentic Style</h4>
                  <p className="text-sm text-gray-600">Traditional techniques with modern appeal</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Learn More About Me
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-amber-600 text-amber-600 font-semibold rounded-lg hover:bg-amber-600 hover:text-white transition-all duration-300"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          
          {/* Image/Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Main Image */}
              <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-600/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl font-arabic text-amber-600 mb-6 opacity-80">محمد</div>
                    <p className="text-xl text-amber-700 font-medium">The Prophet's Name</p>
                    <p className="text-sm text-amber-600 mt-2">Handcrafted with love</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-200 rounded-full opacity-60 animate-pulse delay-1000"></div>
              
              {/* Experience Badge */}
              <div className="absolute top-6 right-6 bg-white rounded-full p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">5+</div>
                  <div className="text-xs text-gray-600">Years</div>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-lg p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-amber-600">100+</div>
                <div className="text-sm text-gray-600">Artworks</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-amber-600">50+</div>
                <div className="text-sm text-gray-600">Clients</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-amber-600">10+</div>
                <div className="text-sm text-gray-600">Styles</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 