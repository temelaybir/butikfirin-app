'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import { getActiveCategories } from '@/data/mock-products'
import { cn } from '@/lib/utils'
import { Calendar, ChefHat, Clock, Coffee, Heart, Home, Mail, Menu, Phone, Search, ShoppingCart, User, UtensilsCrossed } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { OrderDrawer } from '../cart/order-drawer'
import { SimpleLogo } from './simple-logo'

interface Category {
  id: number
  name: string
  slug: string
}

// Butik Fırın için pastane kategorileri
const restaurantCategories = [
  { id: 1, name: 'Kekler & Muffinler', slug: 'kekler-muffinler', icon: '🧁' },
  { id: 2, name: 'Kurabiyeler', slug: 'kurabiyeler', icon: '🍪' },
  { id: 3, name: 'Pastalar', slug: 'pastalar', icon: '🎂' },
  { id: 4, name: 'Tatlılar', slug: 'tatlilar', icon: '🍮' },
  { id: 5, name: 'Ekmekler', slug: 'ekmekler', icon: '🍞' },
  { id: 6, name: 'İçecekler', slug: 'icecekler', icon: '☕' },
  { id: 7, name: 'Börekler & Tuzlular', slug: 'borekler-tuzlular', icon: '🥧' },
  { id: 8, name: 'Özel Siparişler', slug: 'ozel-siparisler', icon: '✨' },
]

export function NewHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [logoSettings, setLogoSettings] = useState({
    logoUrl: '',
    logoText: 'Butik Fırın',
    headerSlogan: 'Ev Yapımı Lezzetler',
    displayMode: 'logo_with_text' as 'logo_only' | 'logo_with_text',
    logoSize: 'medium' as 'small' | 'medium' | 'large'
  })
  const [isMounted, setIsMounted] = useState(false)

  const { getTotalItems, toggleCart } = useCart()
  const { getTotalWishlistItems } = useWishlist()

  const totalCartItems = getTotalItems()
  const totalWishlistItems = getTotalWishlistItems()

  // Component mount kontrolü
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Logo ayarlarını yükle ve değişiklikleri dinle
  useEffect(() => {
    if (!isMounted) return

    const loadLogoSettings = () => {
      if (typeof window === 'undefined') return

      try {
        const savedSettings = localStorage.getItem('butik-firin-site-settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          setLogoSettings({
            logoUrl: settings.site_logo_url || '',
            logoText: settings.site_name || 'Butik Fırın',
            headerSlogan: settings.site_slogan || 'Ev Yapımı Lezzetler',
            displayMode: settings.logo_display_mode || 'logo_with_text',
            logoSize: settings.logo_size || 'medium'
          })
        }
      } catch (error) {
        console.error('Site ayarları yüklenemedi:', error)
      }
    }

    // İlk yükleme
    loadLogoSettings()

    // Storage değişikliklerini dinle
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'butik-firin-site-settings') {
        loadLogoSettings()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Custom event for same-tab updates
    const handleSiteSettingsUpdate = () => {
      loadLogoSettings()
    }

    window.addEventListener('siteSettingsUpdated', handleSiteSettingsUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('siteSettingsUpdated', handleSiteSettingsUpdate)
    }
  }, [isMounted])

  // Kategorileri yükle
  useEffect(() => {
    try {
      const activeCategories = getActiveCategories()
      setCategories(activeCategories)
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error)
      setCategories([])
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openOrderDrawer = () => {
    setIsOrderDrawerOpen(true)
  }

  const closeOrderDrawer = () => {
    setIsOrderDrawerOpen(false)
  }

  // Logo boyutunu hesapla
  const getLogoSize = () => {
    switch (logoSettings.logoSize) {
      case 'small': return 'w-32 h-32'
      case 'large': return 'w-64 h-64'
      default: return 'w-48 h-48'
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
        {/* Top Bar - Restaurant Info */}
        <div className="border-b bg-orange-50 text-orange-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span className="font-medium">(0212) 555 0123</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span className="font-medium">info@butikfirin.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">Her Gün 08:00 - 22:00</span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-4 text-xs">
                <span className="bg-orange-200 px-2 py-1 rounded-full font-medium">
                  📍 Pastane Mahallesi, Lezzet Sokak No:123
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className={cn(
          "transition-all duration-200",
          isScrolled && "shadow-md"
        )}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-48 py-3">
              {/* Mobile Menu & Logo */}
              <div className="flex items-center gap-4">
                {/* Mobile Menu */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 text-orange-600">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Menüyü aç</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <div className="flex flex-col h-full">
                      <div className="p-6 border-b bg-orange-50">
                        <div className="flex items-center gap-3">
                          <SimpleLogo className="w-10 h-10" />
                          {isMounted && logoSettings.displayMode === 'logo_with_text' && (
                            <div>
                              <h1 className="text-xl font-bold text-orange-600">{logoSettings.logoText}</h1>
                              {logoSettings.headerSlogan && (
                                <p className="text-xs text-orange-700">{logoSettings.headerSlogan}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <nav className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-6">
                          <div>
                            <Link
                              href="/"
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors mb-4"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Home className="w-5 h-5 text-orange-600" />
                              <span className="font-medium">Ana Sayfa</span>
                            </Link>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-orange-600">Pastane Kategorileri</h3>
                            <div className="space-y-2">
                              {restaurantCategories.map((category) => (
                                <Link
                                  key={category.id}
                                  href={`/kategoriler/${category.slug}`}
                                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <span className="text-xl">{category.icon}</span>
                                  <span className="font-medium">{category.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>

                          <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4 text-orange-600">Hızlı Erişim</h3>
                            <div className="space-y-2">
                              <Link
                                href="/urunler"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                                <span className="font-medium">Tüm Ürünler</span>
                              </Link>
                              <Link
                                href="/gunluk-ozel"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <Calendar className="w-5 h-5 text-orange-600" />
                                <span className="font-medium">Günün Özel Lezzetleri</span>
                              </Link>
                              <Link
                                href="/hakkimizda"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <Coffee className="w-5 h-5 text-orange-600" />
                                <span className="font-medium">Hakkımızda</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </nav>

                      <div className="border-t p-6 bg-orange-50">
                        <div className="text-center">
                          <p className="text-sm text-orange-700 font-medium mb-2">
                            📞 Sipariş Hattı: (0212) 555 0123
                          </p>
                          <p className="text-xs text-orange-600">
                            Her gün 08:00 - 22:00 arası açığız
                          </p>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Logo */}
                <div className="flex items-center">
                  <Link href="/" className="flex items-center gap-3">
                    <SimpleLogo className={getLogoSize()} />
                    {isMounted && logoSettings.displayMode === 'logo_with_text' && (
                      <div className="hidden sm:block">
                        <h1 className="text-2xl font-bold text-orange-600">{logoSettings.logoText}</h1>
                        {logoSettings.headerSlogan && (
                          <p className="text-xs text-orange-700 -mt-1">{logoSettings.headerSlogan}</p>
                        )}
                      </div>
                    )}
                  </Link>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <Link
                  href="/"
                  className="text-base font-semibold hover:text-orange-600 transition-colors flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Ana Sayfa
                </Link>
                <Link
                  href="/urunler"
                  className="text-base font-semibold hover:text-orange-600 transition-colors flex items-center gap-2"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Tüm Ürünler
                </Link>

                {/* Categories Dropdown */}
                <div className="relative group">
                  <button className="text-base font-semibold hover:text-orange-600 transition-colors flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    Kategoriler
                    <span className="text-xs ml-1">▼</span>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 space-y-2">
                      {restaurantCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/kategoriler/${category.slug}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/gunluk-ozel"
                  className="text-base font-semibold hover:text-orange-600 transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Günün Özel
                </Link>
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-4">
                {/* Desktop Search */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Pasta, kek, kurabiye ara..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-80"
                    />
                  </div>
                </div>


                {/* Wishlist */}
                <Button variant="ghost" size="icon" className="relative h-10 w-10 text-orange-600" asChild>
                  <Link href="/favoriler">
                    <Heart className="h-5 w-5" />
                    {totalWishlistItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                        {totalWishlistItems}
                      </Badge>
                    )}
                    <span className="sr-only">Favoriler</span>
                  </Link>
                </Button>

                {/* Order - Mobile */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 text-orange-600"
                    onClick={openOrderDrawer}
                  >
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {totalCartItems > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-orange-600">
                          {totalCartItems}
                        </Badge>
                      )}
                    </div>
                    <span className="sr-only">Sipariş</span>
                  </Button>
                </div>

                {/* Order - Desktop */}
                <div className="hidden md:block">
                  <Button
                    onClick={openOrderDrawer}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-medium">Siparişim</span>
                    {totalCartItems > 0 && (
                      <Badge className="bg-orange-800 text-white">
                        {totalCartItems}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Admin Link */}
                <Button variant="ghost" size="icon" className="hidden md:flex h-10 w-10 text-orange-600" asChild>
                  <Link href="/admin">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Yönetim</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Order Drawer */}
      <OrderDrawer open={isOrderDrawerOpen} onClose={closeOrderDrawer} />
    </>
  )
}