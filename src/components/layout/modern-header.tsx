'use client'

import { ModernCartIcon } from '@/components/cart/modern-cart-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Heart, Menu, Search, User, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SimpleLogo } from './simple-logo'

const categories = [
  { name: 'Pasta', href: '/kategoriler/pasta' },
  { name: 'Ekmek Çeşitleri', href: '/kategoriler/ekmek-cesitleri' },
  { name: 'Börekler', href: '/kategoriler/borekler' },
  { name: 'Poğaça', href: '/kategoriler/pogaca' },
  { name: 'Şerbetli Tatlılar', href: '/kategoriler/serbetli-tatlilar' }
]

export function ModernHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [logoSettings, setLogoSettings] = useState({
    logoUrl: '',
    logoText: 'Butik Fırın',
    headerSlogan: 'Ev Yapımı Lezzetler',
    displayMode: 'logo_with_text' as 'logo_only' | 'logo_with_text',
    logoSize: 'medium' as 'small' | 'medium' | 'large'
  })

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/arama?q=${encodeURIComponent(searchQuery.trim())}`
    }
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
      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white shadow-lg border-b border-gray-200"
          : "bg-white shadow-sm"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-48">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <SimpleLogo className={getLogoSize()} />
              {isMounted && logoSettings.displayMode === 'logo_with_text' && (
                <div className="hidden sm:block">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {logoSettings.logoText}
                  </h1>
                  {logoSettings.headerSlogan && (
                    <p className="text-xs text-gray-600 -mt-1">{logoSettings.headerSlogan}</p>
                  )}
                </div>
              )}
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full group">
                <Input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-orange-500 bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-500"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Search - Mobile */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 hover:bg-gray-50 rounded-lg"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-gray-700 hover:text-gray-900"
                asChild
              >
                <Link href="/favoriler">
                  <Heart className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">Favoriler</span>
                </Link>
              </Button>

              {/* Profile */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-gray-700 hover:text-gray-900"
                asChild
              >
                <Link href="/giris">
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">Giriş</span>
                </Link>
              </Button>

              {/* Cart */}
              <ModernCartIcon />

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </Button>
            </div>
          </div>

          {/* Categories Navigation - Desktop */}
          <div className="hidden lg:block border-t border-gray-200">
            <nav className="py-0">
              <div className="flex items-center justify-center">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors border-b-2 border-transparent hover:border-gray-900"
                  >
                    {category.name.toUpperCase()}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-orange-500 bg-white"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </form>

              {/* Mobile Categories */}
              <div className="space-y-1 mb-4">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="space-y-1 pt-4 border-t border-gray-200">
                <Link
                  href="/favoriler"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Favorilerim</span>
                </Link>
                <Link
                  href="/giris"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Giriş Yap</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}