'use client'

import { Button } from '@/components/ui/button'
import { SafeImage } from '@/components/ui/safe-image'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
  backgroundColor: string
  textColor: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Bahar Sezonunun Favorileri",
    subtitle: "Yeni Tatlar Geldi",
    description: "Taze malzemelerle hazırlanan özel böreklerimiz ve aromalı kahvelerimizle güne başlayın.",
    image: "/images/hero/spring-special.svg",
    ctaText: "Keşfet",
    ctaLink: "/menu",
    backgroundColor: "from-green-600 to-green-700",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "Premium Kahve Deneyimi",
    subtitle: "Evde Barista Kalitesi",
    description: "Özenle seçilmiş çekirdeklerimizle evde profesyonel kahve deneyimi yaşayın.",
    image: "/images/hero/coffee-experience.svg",
    ctaText: "Sipariş Ver",
    ctaLink: "/coffee",
    backgroundColor: "from-amber-600 to-orange-600",
    textColor: "text-white"
  },
  {
    id: 3,
    title: "Taze Fırın Ürünleri",
    subtitle: "Her Gün Taze",
    description: "Günlük taze pişirilen börekler, poğaçalar ve tatlılarımızla lezzet yolculuğuna çıkın.",
    image: "/images/hero/fresh-bakery.svg",
    ctaText: "Menüyü Gör",
    ctaLink: "/bakery",
    backgroundColor: "from-slate-700 to-slate-800",
    textColor: "text-white"
  }
]

export function StarbucksHeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="relative w-full h-[60vh] lg:h-[70vh] overflow-hidden bg-gray-100">
      {/* Background with gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.backgroundColor} transition-all duration-1000`}>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <SafeImage
          src={currentSlideData.image}
          alt={currentSlideData.title}
          fill
          className="object-contain transition-transform duration-[2000ms] hover:scale-105"
          priority
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            {/* Animated content */}
            <div
              key={currentSlide}
              className={`space-y-6 animate-fade-in-up ${currentSlideData.textColor}`}
            >
              {/* Subtitle */}
              <div className="flex items-center space-x-2">
                <div className="w-12 h-0.5 bg-current opacity-60"></div>
                <span className="text-sm lg:text-base font-medium tracking-wide uppercase opacity-90">
                  {currentSlideData.subtitle}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                {currentSlideData.title}
              </h1>

              {/* Description */}
              <p className="text-lg lg:text-xl leading-relaxed opacity-90 max-w-lg">
                {currentSlideData.description}
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <a href={currentSlideData.ctaLink}>
                    {currentSlideData.ctaText}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
        onClick={goToNext}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/70'
              }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        >
          {isAutoPlaying ? (
            <div className="w-2 h-2 bg-current"></div>
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-100 linear"
            style={{
              width: `${((currentSlide + 1) / heroSlides.length) * 100}%`
            }}
          ></div>
        </div>
      )}
    </section>
  )
}