'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story')

  const tabs = [
    { id: 'story', label: 'My Story', icon: '📖' },
    { id: 'philosophy', label: 'Philosophy', icon: '🎨' },
    { id: 'journey', label: 'Journey', icon: '🛤️' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 dark:from-amber-700 dark:via-orange-700 dark:to-red-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            About the Artist
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Discover the passion, dedication, and artistic journey behind every piece of Arabic calligraphy
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Artist Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Master Calligrapher
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              With over two decades of dedication to the art of Arabic calligraphy, I have devoted my life to preserving 
              and evolving this ancient tradition. Each stroke carries the weight of centuries of artistic heritage, 
              while embracing contemporary expression.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              My work bridges the gap between traditional Islamic art and modern aesthetics, creating pieces that 
              resonate with both cultural significance and contemporary beauty.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">20+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Artworks Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Exhibitions</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-12 text-center">
              <div className="text-8xl font-arabic text-amber-600 dark:text-amber-400 mb-6">الله</div>
              <p className="text-lg text-amber-700 dark:text-amber-300 font-semibold">Signature Style</p>
            </div>
            <div className="absolute -top-4 -right-4 bg-amber-600 dark:bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Master Artist
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-8 border border-gray-200 dark:border-gray-700">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-amber-600 dark:bg-amber-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'story' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Beginning</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  My journey into Arabic calligraphy began at the age of 12, when I first encountered the mesmerizing 
                  beauty of Islamic manuscripts. The flowing lines and geometric precision captivated my young mind, 
                  and I knew I had found my calling.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Under the guidance of master calligraphers, I learned the traditional techniques and principles 
                  that have been passed down through generations. Each lesson was not just about technique, but 
                  about understanding the spiritual and cultural significance behind every stroke.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border-l-4 border-amber-600 dark:border-amber-400">
                  <p className="text-amber-800 dark:text-amber-200 italic">
                    "Calligraphy is not just writing; it is the visual expression of the soul's connection to the divine."
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'philosophy' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Artistic Philosophy</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  My artistic philosophy centers around three core principles: tradition, innovation, and spirituality. 
                  I believe in honoring the centuries-old techniques while pushing the boundaries of contemporary expression.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-3xl mb-3">🏛️</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tradition</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Respecting and preserving classical techniques and forms
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-3xl mb-3">✨</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Innovation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Exploring new mediums and contemporary applications
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-3xl mb-3">🙏</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Spirituality</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Connecting the physical art with spiritual meaning
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'journey' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Artistic Journey</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-600 dark:bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Early Apprenticeship (2000-2005)</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Studied under master calligraphers, learning traditional techniques and understanding the 
                        cultural significance of each style.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-600 dark:bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Development (2005-2015)</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Established my own studio, began creating commissioned works, and started participating 
                        in international exhibitions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-600 dark:bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Innovation Era (2015-Present)</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Exploring contemporary applications, digital integration, and creating pieces that bridge 
                        traditional and modern aesthetics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recognition & Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏆 International Awards</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Islamic Arts Festival Grand Prize (2018)</li>
                      <li>• Middle East Calligraphy Excellence Award (2020)</li>
                      <li>• UNESCO Heritage Preservation Recognition (2022)</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎨 Notable Exhibitions</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Louvre Abu Dhabi (2019)</li>
                      <li>• British Museum (2021)</li>
                      <li>• Metropolitan Museum of Art (2023)</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📚 Publications</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• "The Art of Arabic Calligraphy" (2017)</li>
                      <li>• "Contemporary Islamic Art" (2020)</li>
                      <li>• Featured in 50+ international publications</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎓 Teaching & Mentorship</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Master classes in 15+ countries</li>
                      <li>• 200+ students mentored</li>
                      <li>• University guest lectures worldwide</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Experience the Art
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore my collection of handcrafted Arabic calligraphy pieces, each telling a unique story 
            of tradition, passion, and artistic excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/gallery"
              className="btn-primary"
            >
              View Gallery
            </Link>
            <Link 
              href="/contact"
              className="btn-secondary"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 