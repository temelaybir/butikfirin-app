'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SafeImage } from '@/components/ui/safe-image'
import { cn } from '@/lib/utils'
import { Award, ChevronLeft, ChevronRight, Clock, ShoppingCart, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const heroSlides = [
  {
    id: 1,
    title: "Taze Fırından\nLezzetler",
    subtitle: "Her sabah taze pişirilen böreklerimizle güne başlayın",
    image: "/images/hero/hero-01-desktop.jpg",
    cta: "Böreklerimizi Keşfet",
    href: "/kategoriler/borekler-tuzlular",
    badge: "Yeni Lezzetler",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 2,
    title: "Özel Günler İçin\nPastalarımız",
    subtitle: "Doğum günü, düğün ve özel anlarınız için özenle hazırlanan pastalar",
    image: "/images/hero/mobilhero.jpg",
    cta: "Pasta Siparişi Ver",
    href: "/kategoriler/pastalar",
    badge: "Özel Sipariş",
    color: "from-pink-500 to-purple-500"
  },
  {
    id: 3,
    title: "Geleneksel\nTürkiye Lezzetleri",
    subtitle: "Baklava, künefe ve daha fazlası... Geleneksel tatlarımızı keşfedin",
    image: "/images/hero/hero-01-desktop.jpg",
    cta: "Tatlıları Gör",
    href: "/kategoriler/tatlilar",
    badge: "Geleneksel",
    color: "from-amber-500 to-orange-500"
  }
]

const features = [
  {
    icon: Clock,
    title: "Hızlı Teslimat",
    description: "30 dk içinde kapınızda"
  },
  {
    icon: Award,
    title: "Kalite Garantisi",
    description: "Taze ve lezzetli ürünler"
  },
  {
    icon: Star,
    title: "4.9 Müşteri Puanı",
    description: "Binlerce memnun müşteri"
  }
]

export function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden bg-gray-100">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full flex items-center justify-center">
          <SafeImage
            src={currentSlideData.image}
            alt={currentSlideData.title}
            fill
            className="object-contain transition-all duration-1000"
            priority
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center min-h-[600px] lg:min-h-[700px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-white space-y-8">
            {/* Badge */}
            <div className="flex items-center gap-4">
              <Badge className={cn(
                "bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2 text-sm font-semibold rounded-full",
                "hover:bg-white/30 transition-all duration-300"
              )}>
                <Sparkles className="w-4 h-4 mr-2" />
                {currentSlideData.badge}
              </Badge>
              <div className="flex items-center gap-2 text-white/80">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.9/5 Müşteri Puanı</span>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {currentSlideData.title.split('\n').map((line, index) => (
                  <div key={index} className="animate-slide-in" style={{ animationDelay: `${index * 0.2}s` }}>
                    {line}
                  </div>
                ))}
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 max-w-lg leading-relaxed">
                {currentSlideData.subtitle}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bakery-button px-8 py-4 text-lg font-semibold rounded-2xl group"
                asChild
              >
                <Link href={currentSlideData.href}>
                  <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  {currentSlideData.cta}
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
                asChild
              >
                <Link href="/kategoriler">
                  Tüm Ürünleri Gör
                </Link>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3 group-hover:bg-white/30 transition-all duration-300">
                    <feature.icon className="w-6 h-6 mx-auto text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-white/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Product Preview */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              {/* Floating Product Cards */}
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((item, index) => (
                  <div
                    key={item}
                    className={cn(
                      "bakery-card w-48 h-48 p-4 animate-slide-in",
                      index % 2 === 0 ? "mt-8" : "mb-8"
                    )}
                    style={{ animationDelay: `${(index + 2) * 0.3}s` }}
                  >
                    <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl mb-3 flex items-center justify-center">
                      <span className="text-2xl font-bold text-orange-600">🥐</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Su Böreği</h4>
                    <p className="text-orange-600 font-bold text-sm">₺25,90</p>
                  </div>
                ))}
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index)
              setIsAutoPlaying(false)
            }}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>

      {/* Auto-play Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-100 ease-linear"
          style={{
            width: isAutoPlaying ? '100%' : '0%',
            animation: isAutoPlaying ? 'progress 5s linear infinite' : 'none'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  )
}