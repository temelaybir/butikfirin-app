'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SafeImage } from '@/components/ui/safe-image'
import { useCart } from '@/context/cart-context'
import { getActiveCategories, getFeaturedProducts } from '@/data/mock-products'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Gift,
  Heart,
  Leaf,
  MapPin, Phone,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

// 2025 Animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Main loyalty program messages
const mainLoyaltyMessages = [
  { text: "5. siparişinize Türk Kahvesi hediye!", icon: Coffee, color: "text-amber-700 bg-amber-50", forAll: true },
  { text: "10 sipariş tamamla, %20 indirim kazan!", icon: Gift, color: "text-purple-600 bg-purple-50", forAll: true },
  { text: "Her 7. içecek bizden!", icon: Sparkles, color: "text-blue-600 bg-blue-50", categories: ['İçecekler', 'Kahve'] },
  { text: "Doğum günü pastanızda %30 indirim", icon: Award, color: "text-pink-600 bg-pink-50", categories: ['Pastalar'] },
  { text: "3 arkadaşını getir, 1 tatlı hediye", icon: Heart, color: "text-red-600 bg-red-50", categories: ['Tatlılar', 'Pastalar'] }
]

export default function HomePage() {
  const [baseCategories] = useState(() => getActiveCategories())
  const [allProducts] = useState(() => getFeaturedProducts())
  const [bottomSlides, setBottomSlides] = useState<any[]>([])
  const [heroBanners, setHeroBanners] = useState<any>({
    main: null,
    side1: null,
    side2: null
  })

  // Add "All Products" category at the beginning
  const categories = [
    { id: 0, name: 'Tüm Ürünler', slug: 'all', description: 'Tüm ürünler', image_url: '', is_active: true, display_order: 0, created_at: '', updated_at: '' },
    ...baseCategories
  ]

  const [activeCategory, setActiveCategory] = useState('all')
  const [categoryProducts, setCategoryProducts] = useState<Record<string, any[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const categoryScrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const { addToCart } = useCart()

  // Modal scroll lock - minimal approach
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'relative'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
    }
  }, [selectedProduct])

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIsMobile()
    
    // Listen to resize events
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Banner boyut hesaplama fonksiyonu
  const getBannerStyle = (banner: any) => {
    if (!banner) return {}
    
    const style: any = {}
    
    if (banner.custom_width) {
      style.width = `${banner.custom_width}${banner.size_unit || 'px'}`
    }
    
    if (banner.custom_height) {
      style.height = `${banner.custom_height}${banner.size_unit || 'px'}`
    }
    
    return style
  }

  // Load hero banners from API
  const loadHeroBanners = async () => {
    try {
      const response = await fetch('/api/admin/hero-banners')
      if (response.ok) {
        const data = await response.json()
        const banners = data.banners || []
        
        // Banner'ları pozisyonlarına göre ayır
        const bannerMap: any = {
          main: null,
          side1: null,
          side2: null
        }
        
        banners.forEach((banner: any) => {
          // Mobile kontrolü - state'den al
          const shouldShow = banner.is_active && 
                           (!isMobile || banner.show_on_mobile !== false) &&
                           bannerMap[banner.position] === null
          
          if (shouldShow) {
            bannerMap[banner.position] = banner
          }
        })
        
        setHeroBanners(bannerMap)
      }
    } catch (error) {
      console.error('Error loading hero banners:', error)
    }
  }

  // Load bottom slides from API
  const loadSlides = async () => {
    try {
      // First try to load from API
      const response = await fetch('/api/hero-slides')
      if (response.ok) {
        const data = await response.json()
        const slides = data.slides || []

        // Only bottom slides now
        const bottomSlidesData = slides.filter((slide: any) => slide.order_position >= 5 && slide.order_position <= 8)
        setBottomSlides(bottomSlidesData)

        // Save to localStorage for offline use
        localStorage.setItem('butik-firin-hero-slides', JSON.stringify(slides))
        return
      }
    } catch (error) {
      console.error('Error loading slides from API:', error)
    }

    // Fallback to localStorage if API fails
    try {
      const savedSlides = localStorage.getItem('butik-firin-hero-slides')
      if (savedSlides) {
        const slides = JSON.parse(savedSlides)

        // Filter only active slides
        const activeSlides = slides
          .filter((slide: any) => {
            // Check if slide is active
            if (!slide.is_active) return false
            // Check mobile visibility - state'den al
            if (isMobile && slide.show_on_mobile === false) return false
            return true
          })
          .sort((a: any, b: any) => a.order_position - b.order_position)

        // Only bottom slides now
        const bottomSlidesData = activeSlides.filter((slide: any) => slide.order_position >= 5 && slide.order_position <= 8)
        setBottomSlides(bottomSlidesData)
      }
    } catch (error) {
      console.error('Error loading slides from localStorage:', error)
    }
  }

  useEffect(() => {
    loadHeroBanners()
    loadSlides()

    const handleResize = () => {
      loadSlides()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Canlı arama fonksiyonu
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Tüm ürünlerde arama yap
    const results = allProducts.filter(product => {
      const searchTerm = query.toLowerCase()
      const productName = product.name.toLowerCase()
      const productDescription = (product.description || '').toLowerCase()
      const productShortDescription = (product.short_description || '').toLowerCase()
      const productTags = (product.tags || []).join(' ').toLowerCase()
      const categoryName = (product.category_name || '').toLowerCase()

      return (
        productName.includes(searchTerm) ||
        productDescription.includes(searchTerm) ||
        productShortDescription.includes(searchTerm) ||
        productTags.includes(searchTerm) ||
        categoryName.includes(searchTerm)
      )
    })

    // Sonuçları öncelik sırasına göre sırala
    const sortedResults = results.sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      const queryLower = query.toLowerCase()

      // Tam eşleşme öncelikli
      if (aName === queryLower && bName !== queryLower) return -1
      if (bName === queryLower && aName !== queryLower) return 1

      // Başlangıç eşleşmesi öncelikli
      if (aName.startsWith(queryLower) && !bName.startsWith(queryLower)) return -1
      if (bName.startsWith(queryLower) && !aName.startsWith(queryLower)) return 1

      // Kategori eşleşmesi öncelikli
      if (a.category_name?.toLowerCase().includes(queryLower) && !b.category_name?.toLowerCase().includes(queryLower)) return -1
      if (b.category_name?.toLowerCase().includes(queryLower) && !a.category_name?.toLowerCase().includes(queryLower)) return 1

      return 0
    })

    setSearchResults(sortedResults.slice(0, 10)) // En fazla 10 sonuç göster
    setIsSearching(false)
  }, [allProducts])

  // Arama query'si değiştiğinde canlı arama yap
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, performSearch])

  // Her kategori için ürünleri yükle
  useEffect(() => {
    const products: Record<string, any[]> = {}

    // Add all products
    products['all'] = allProducts

    baseCategories.forEach(category => {
      // Match products by category name
      const categoryProducts = allProducts.filter(product => {
        // Check both category_name and category fields
        return product.category_name === category.name ||
          product.category === category.name ||
          product.category_id === category.id
      })
      products[category.slug] = categoryProducts
    })

    setCategoryProducts(products)
  }, [allProducts, baseCategories])

  // Kategori scroll kontrolü - Throttled for performance
  const checkScrollButtons = useCallback(() => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current
      setShowLeftArrow(scrollLeft > 5)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }, [])

  // Throttled scroll handler to prevent excessive re-renders
  const throttledCheckScrollButtons = useCallback(() => {
    checkScrollButtons()
  }, [checkScrollButtons])

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      // Responsive scroll amount based on screen size
      const container = categoryScrollRef.current
      const scrollAmount = window.innerWidth < 640
        ? container.clientWidth * 0.8  // 80% of visible width on mobile
        : container.clientWidth * 0.5  // 50% of visible width on desktop

      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleAddToCart = (product: any, e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      const fullProduct = getFeaturedProducts().find(p => p.id === product.id)

      if (!fullProduct) {
        toast.error('Ürün bulunamadı')
        return
      }

      addToCart(fullProduct)

      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <SafeImage
              src={fullProduct.image_url}
              alt={fullProduct.name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">{fullProduct.name}</p>
            <p className="text-sm text-gray-600">Sepete eklendi</p>
          </div>
        </div>,
        {
          duration: 3000,
          className: 'toast-custom'
        }
      )
    } catch (error) {
      console.error('Sepete ekleme hatası:', error)
      toast.error('Ürün sepete eklenirken bir hata oluştu')
    }
  }

  // Filtrelenmiş ürünler
  const currentCategoryProducts = categoryProducts[activeCategory] || []
  const filteredProducts = searchQuery
    ? searchResults // Arama yapılıyorsa arama sonuçlarını kullan
    : currentCategoryProducts

  // Arama sonuçlarında kategori filtreleme
  const filteredSearchResults = searchQuery && activeCategory !== 'all'
    ? searchResults.filter(product => {
      const category = baseCategories.find(cat => cat.slug === activeCategory)
      return category && (
        product.category_name === category.name ||
        product.category === category.name ||
        product.category_id === category.id
      )
    })
    : searchResults

  // Final filtered products
  const finalFilteredProducts = searchQuery ? filteredSearchResults : filteredProducts

  // Modal close handler with smooth transition
  const closeModal = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  // Escape key handler for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProduct) {
        closeModal()
      }
    }

    if (selectedProduct) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [selectedProduct, closeModal])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <section className="w-full bg-white py-2 sm:py-4 lg:py-6 mb-2 sm:mb-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className={`gap-2 sm:gap-4 ${
            // Dynamic grid layout based on visible banners
            heroBanners.main && (!isMobile || heroBanners.main.show_on_mobile !== false) &&
            ((heroBanners.side1 && (!isMobile || heroBanners.side1.show_on_mobile !== false)) ||
             (heroBanners.side2 && (!isMobile || heroBanners.side2.show_on_mobile !== false)))
              ? 'grid grid-cols-1 lg:grid-cols-3' 
              : 'flex justify-center'
          }`}>
            {/* Sol: Hero Büyük Banner */}
            {heroBanners.main && (!isMobile || heroBanners.main.show_on_mobile !== false) && (
              <div 
                className="lg:col-span-2 relative rounded-xl overflow-hidden bg-gray-100 shadow-lg group"
                style={{
                  ...getBannerStyle(heroBanners.main),
                  // Default heights if no custom height
                  height: heroBanners.main.custom_height 
                    ? `${heroBanners.main.custom_height}${heroBanners.main.size_unit || 'px'}`
                    : isMobile ? '200px' : '400px'
                }}
              >
                {heroBanners.main ? (
                  <>
                    <img
                      src={heroBanners.main.image_url}
                      alt={heroBanners.main.alt_text || "Ana Banner"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!heroBanners.main.is_raw_image && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    )}
                    {!heroBanners.main.is_raw_image && (heroBanners.main.title || heroBanners.main.button_text) && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 lg:p-8">
                        {heroBanners.main.title && (
                          <h2 className="text-lg sm:text-2xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                            {heroBanners.main.title}
                          </h2>
                        )}
                        {heroBanners.main.subtitle && (
                          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-2 sm:mb-4">
                            {heroBanners.main.subtitle}
                          </p>
                        )}
                        {heroBanners.main.button_text && heroBanners.main.button_link && (
                          <Link href={heroBanners.main.button_link}>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                              {heroBanners.main.button_text}
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <img
                      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
                      alt="Taze Fırın Ürünleri"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </>
                )}
              </div>
            )}

            {/* Sağ: 2 Küçük Banner */}
            {((heroBanners.side1 && (!isMobile || heroBanners.side1.show_on_mobile !== false)) ||
              (heroBanners.side2 && (!isMobile || heroBanners.side2.show_on_mobile !== false))) && (
              <div className="lg:col-span-1 space-y-2 sm:space-y-4">
                {/* Banner 1 - Sağ Üst */}
                {heroBanners.side1 && (!isMobile || heroBanners.side1.show_on_mobile !== false) && (
                  <div 
                    className="relative rounded-xl overflow-hidden bg-gray-100 shadow-lg group"
                    style={{
                      ...getBannerStyle(heroBanners.side1),
                      height: heroBanners.side1.custom_height 
                        ? `${heroBanners.side1.custom_height}${heroBanners.side1.size_unit || 'px'}`
                        : isMobile ? '100px' : '190px'
                    }}
                  >
                  {heroBanners.side1 ? (
                    <>
                      <img
                        src={heroBanners.side1.image_url}
                        alt={heroBanners.side1.alt_text || "Yan Banner 1"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!heroBanners.side1.is_raw_image && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      )}
                      {!heroBanners.side1.is_raw_image && (heroBanners.side1.title || heroBanners.side1.button_text) && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                          {heroBanners.side1.title && (
                            <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white mb-1">
                              {heroBanners.side1.title}
                            </h3>
                          )}
                          {heroBanners.side1.subtitle && (
                            <p className="text-xs sm:text-sm text-white/90 mb-1 sm:mb-2">
                              {heroBanners.side1.subtitle}
                            </p>
                          )}
                          {heroBanners.side1.button_text && heroBanners.side1.button_link && (
                            <Link href={heroBanners.side1.button_link}>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 sm:px-4 sm:py-1.5 text-xs font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                                {heroBanners.side1.button_text}
                              </Button>
                            </Link>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <img
                        src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80"
                        alt="Tatlılar"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </>
                  )}
                  </div>
                )}

                {/* Banner 2 - Sağ Alt */}
                {heroBanners.side2 && (!isMobile || heroBanners.side2.show_on_mobile !== false) && (
                  <div 
                    className="relative rounded-xl overflow-hidden bg-gray-100 shadow-lg group"
                    style={{
                      ...getBannerStyle(heroBanners.side2),
                      height: heroBanners.side2.custom_height 
                        ? `${heroBanners.side2.custom_height}${heroBanners.side2.size_unit || 'px'}`
                        : isMobile ? '100px' : '190px'
                    }}
                  >
                  {heroBanners.side2 ? (
                    <>
                      <img
                        src={heroBanners.side2.image_url}
                        alt={heroBanners.side2.alt_text || "Yan Banner 2"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!heroBanners.side2.is_raw_image && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      )}
                      {!heroBanners.side2.is_raw_image && (heroBanners.side2.title || heroBanners.side2.button_text) && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                          {heroBanners.side2.title && (
                            <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white mb-1">
                              {heroBanners.side2.title}
                            </h3>
                          )}
                          {heroBanners.side2.subtitle && (
                            <p className="text-xs sm:text-sm text-white/90 mb-1 sm:mb-2">
                              {heroBanners.side2.subtitle}
                            </p>
                          )}
                          {heroBanners.side2.button_text && heroBanners.side2.button_link && (
                            <Link href={heroBanners.side2.button_link}>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 sm:px-4 sm:py-1.5 text-xs font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                                {heroBanners.side2.button_text}
                              </Button>
                            </Link>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <img
                        src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Kahve"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </>
                  )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Menu Section - Trendyol Style */}
      <section id="menu-section" className="py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Menu Card Container */}
          <div className="bg-white rounded shadow-sm border-2 border-gray-200 overflow-hidden">

            {/* Header - With Background Image */}
            <div className="relative h-[200px] overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src="/images/hero/menuback.jpg"
                  alt="Bakery Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center px-8">
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white">
                    Menümüz
                  </h2>
                </div>
              </div>
            </div>

            {/* Search Bar - Trendyol Style */}
            <div className="px-8 py-4 border-b border-gray-200">
              <div className="relative max-w-2xl mx-auto">
                <Input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsSearchFocused(true)
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    // Arama sonuçlarına tıklanması için biraz gecikme
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }}
                  className="w-full h-11 pl-12 pr-4 text-base border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Canlı Arama Sonuçları */}
                {isSearchFocused && (searchQuery || searchResults.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                        Aranıyor...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              setSelectedProduct(product)
                              setSearchQuery('')
                              setSearchResults([])
                              setIsSearchFocused(false)
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <SafeImage
                                src={product.image_url}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {product.category_name}
                              </div>
                              <div className="text-sm font-semibold text-orange-600">
                                ₺{product.price.toFixed(2)}
                              </div>
                            </div>
                          </button>
                        ))}
                        {searchResults.length >= 10 && (
                          <div className="px-4 py-2 text-sm text-gray-500 border-t">
                            Daha fazla sonuç için aramayı daraltın
                          </div>
                        )}
                      </div>
                    ) : searchQuery ? (
                      <div className="p-4 text-center text-gray-500">
                        "{searchQuery}" için sonuç bulunamadı
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Categories - Improved Mobile Experience */}
            <div className="bg-white sticky top-0 z-10 shadow-sm">
              <div className="relative overflow-hidden">
                {/* Left Arrow - Improved Design */}
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 z-20 flex items-center transition-all duration-300",
                    showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <div className="bg-gradient-to-r from-white via-white to-transparent pl-1 pr-6 py-3">
                    <button
                      onClick={() => scrollCategories('left')}
                      className="bg-white shadow-lg rounded-md p-2 hover:shadow-xl hover:scale-110 transition-all duration-200 border border-gray-100"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Right Arrow - Improved Design */}
                <div
                  className={cn(
                    "absolute right-0 top-0 bottom-0 z-20 flex items-center transition-all duration-300",
                    showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <div className="bg-gradient-to-l from-white via-white to-transparent pr-1 pl-6 py-3">
                    <button
                      onClick={() => scrollCategories('right')}
                      className="bg-white shadow-lg rounded-md p-2 hover:shadow-xl hover:scale-110 transition-all duration-200 border border-gray-100"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Categories Container - Fixed Padding */}
                <div className="">
                  <div
                    ref={categoryScrollRef}
                    onScroll={throttledCheckScrollButtons}
                    className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide scroll-smooth py-3 sm:py-4 px-16 sm:px-20"
                    style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                  >
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => setActiveCategory(category.slug)}
                        className={cn(
                          "flex-shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 rounded font-medium transition-all flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base",
                          activeCategory === category.slug
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                        )}
                      >
                        <span className="whitespace-nowrap">{category.name}</span>
                        <span className={cn(
                          "text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 font-semibold",
                          activeCategory === category.slug
                            ? searchQuery ? "bg-white/20 text-white" : "bg-white/20 text-white"
                            : searchQuery ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-600"
                        )}>
                          {searchQuery ? (
                            (() => {
                              if (category.slug === 'all') {
                                return searchResults.length
                              }
                              const categoryResults = searchResults.filter(product => {
                                return product.category_name === category.name ||
                                  product.category === category.name ||
                                  product.category_id === category.id
                              })
                              return categoryResults.length
                            })()
                          ) : (
                            categoryProducts[category.slug]?.length || 0
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid - Minimalist Design */}
            <div className="p-4 sm:p-6 lg:p-8">
              {finalFilteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {finalFilteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col h-full"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-50">
                        <SafeImage
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        {product.is_featured && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                              Öne Çıkan
                            </span>
                          </div>
                        )}

                        {product.discounted_price && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                              %{Math.round(((product.price - product.discounted_price) / product.price) * 100)}
                            </span>
                          </div>
                        )}

                        {!product.availability && (
                          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                            <span className="bg-gray-800 text-white px-4 py-2 rounded-md font-medium">
                              Tükendi
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info - Fixed Height Layout */}
                      <div className="p-3 sm:p-4 flex flex-col h-full">
                        {/* Product Name & Description - Fixed Height */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm sm:text-base">
                            {product.name}
                          </h3>

                          <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2 min-h-[2rem]">
                            {product.short_description || ' '}
                          </p>

                          {/* Loyalty Message - Show relevant messages */}
                          {(() => {
                            // Product ID'sine göre sabit sadakat mesajı göster
                            const productIdNum = typeof product.id === 'string' ? parseInt(product.id) : product.id
                            const shouldShow = (productIdNum % 10) > 3 // %60 oranında göster
                            
                            if (!shouldShow) return null
                            
                            // Filter messages relevant to this product
                            const relevantMessages = mainLoyaltyMessages.filter(msg =>
                              msg.forAll || (msg.categories && msg.categories.includes(product.category_name))
                            )

                            if (relevantMessages.length === 0) return null

                            // Product ID'sine göre sabit mesaj seç
                            const messageIndex = productIdNum % relevantMessages.length
                            const message = relevantMessages[messageIndex]
                            const Icon = message.icon
                            const [textColor, bgColor] = message.color.split(' ')

                            return (
                              <div className="mb-2">
                                <div className={`${bgColor} rounded-md px-2 py-1.5 flex items-center gap-1.5`}>
                                  <Icon className={`w-3 h-3 flex-shrink-0 ${textColor}`} />
                                  <span className={`text-[10px] sm:text-xs font-medium ${textColor} leading-tight`}>
                                    {message.text}
                                  </span>
                                </div>
                              </div>
                            )
                          })()}
                        </div>

                        {/* Price & Button - Always at Bottom */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              {product.discounted_price ? (
                                <>
                                  <p className="text-base sm:text-xl font-bold text-orange-600">
                                    ₺{product.discounted_price.toFixed(2)}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500 line-through">
                                    ₺{product.price.toFixed(2)}
                                  </p>
                                </>
                              ) : (
                                <p className="text-base sm:text-xl font-bold text-gray-900">
                                  ₺{product.price.toFixed(2)}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">4.8</span>
                            </div>
                          </div>

                          {/* Add to Order Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(product)
                            }}
                            disabled={!product.availability}
                            className={cn(
                              "w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2",
                              product.availability
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            )}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="text-xs sm:text-sm">Siparişe Ekle</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coffee className="w-10 h-10 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchQuery ? 'Aramanızla eşleşen ürün bulunamadı' : 'Bu kategoride henüz ürün bulunmuyor'}
                  </h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    {searchQuery ? 'Farklı bir arama terimi deneyin' : 'Lütfen başka bir kategori seçin'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner Section - After Menu */}
      {bottomSlides.length > 0 && (
        <section className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bottomSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="relative rounded-xl overflow-hidden group bg-gray-100 h-[200px] shadow-lg"
                >
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {slide.title}
                      </h3>
                      {slide.subtitle && (
                        <p className="text-sm text-white/90 mb-2">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.button_text && slide.link_url && (
                        <Link href={slide.link_url}>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 text-xs font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                            {slide.button_text}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section - Dynamic Style */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Neden Butik Fırın?
            </h2>
            <p className="text-gray-600">
              Kaliteli malzemeler, geleneksel tarifler ve modern sunum
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Taze Üretim",
                description: "Her gün taze olarak hazırlanan ürünler",
                color: "text-orange-500",
                bgColor: "bg-orange-50"
              },
              {
                icon: Award,
                title: "Ödüllü Tarifler",
                description: "Ustalarımızın özel tarifleri",
                color: "text-blue-500",
                bgColor: "bg-blue-50"
              },
              {
                icon: Leaf,
                title: "Doğal Malzemeler",
                description: "Katkısız ve organik içerikler",
                color: "text-green-500",
                bgColor: "bg-green-50"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center mb-4",
                  feature.bgColor
                )}>
                  <feature.icon className={cn("w-7 h-7", feature.color)} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Modern */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              İletişim Bilgileri
            </h2>
            <p className="text-gray-600">
              Sipariş vermek için bizi arayın veya mağazamızı ziyaret edin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "Çalışma Saatleri",
                lines: ["Pazartesi - Cumartesi: 08:00 - 22:00", "Pazar: 09:00 - 21:00"],
                color: "text-orange-500",
                bgColor: "bg-orange-50"
              },
              {
                icon: Phone,
                title: "Telefon",
                lines: ["(0212) 855 44 22"],
                color: "text-blue-500",
                bgColor: "bg-blue-50"
              },
              {
                icon: MapPin,
                title: "Merkez Adres",
                lines: ["Adnan Kahveci Mah.", "Engin Sk. No:20", "Beylikdüzü / İSTANBUL"],
                color: "text-green-500",
                bgColor: "bg-green-50"
              },
              {
                icon: MapPin,
                title: "Şube 1 Adres",
                lines: ["Cumhuriyet Mah.", "Atatürk Bulvarı No:8", "Bizimkent - Beylikdüzü / İSTANBUL"],
                color: "text-purple-500",
                bgColor: "bg-purple-50"
              }
            ].map((info, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto",
                  info.bgColor
                )}>
                  <info.icon className={cn("w-6 h-6", info.color)} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{info.title}</h3>
                {info.lines.map((line, i) => (
                  <p key={i} className="text-gray-600">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal - Simple */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl"
            >
              <div className="relative h-64 md:h-96 bg-gray-50">
                <SafeImage
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>

                {selectedProduct.discounted_price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md font-bold text-sm">
                    %{Math.round(((selectedProduct.price - selectedProduct.discounted_price) / selectedProduct.price) * 100)} İNDİRİM
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedProduct.name}
                </h2>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-gray-500">(245 Değerlendirme)</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">127 Satış</span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {selectedProduct.description || selectedProduct.short_description}
                </p>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Fiyat</p>
                      {selectedProduct.discounted_price ? (
                        <div>
                          <p className="text-3xl font-bold text-orange-600">
                            ₺{selectedProduct.discounted_price.toFixed(2)}
                          </p>
                          <p className="text-lg text-gray-500 line-through">
                            ₺{selectedProduct.price.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-3xl font-bold text-gray-900">
                          ₺{selectedProduct.price.toFixed(2)}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Kategori</p>
                      <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-md">
                        {selectedProduct.category_name}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct)
                    closeModal()
                  }}
                  disabled={!selectedProduct.availability}
                  className={cn(
                    "w-full h-12 text-base font-semibold rounded-lg transition-all",
                    selectedProduct.availability
                      ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {selectedProduct.availability ? 'Sepete Ekle' : 'Tükendi'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}