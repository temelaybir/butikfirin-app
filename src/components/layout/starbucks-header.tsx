'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/context/cart-context'
import { ModernCartSidebar } from '@/components/cart/modern-cart-sidebar'
import { 
  ShoppingBag, 
  MapPin, 
  User, 
  Menu as MenuIcon, 
  X,
  Coffee,
  Heart,
  Gift
} from 'lucide-react'
import { SimpleLogo } from './simple-logo'

export function StarbucksHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  const navigationItems = [
    { name: 'Rewards', href: '/rewards', icon: Gift },
    { name: 'Menü', href: '/menu', icon: Coffee },
    { name: 'Mağazalar', href: '/stores', icon: MapPin },
    { name: 'Kurumsal', href: '/corporate', icon: null },
    { name: 'Sosyal Sorumluluk', href: '/social-responsibility', icon: Heart },
  ]

  return (
    <>
      {/* Top Banner - Optional Promotion */}
      <div className="bg-gradient-to-r from-gray-800 to-black text-white text-center py-2 text-sm">
        <p>
          <span className="font-semibold">Yeni!</span> Bahar Sezonunda Özel İndirimler ✨
          <Link href="/offers" className="underline ml-2 hover:text-orange-200">
            Detayları Gör
          </Link>
        </p>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <SimpleLogo className="w-10 h-10 lg:w-12 lg:h-12" />
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Butik Fırın
                </h1>
                <p className="text-xs text-orange-600 font-medium -mt-1">
                  Premium Coffee & Bakery
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200 relative group"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-200 group-hover:w-full"></div>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Find Store */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              >
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Mağaza Bul</span>
              </Button>

              {/* Login Button */}
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center space-x-1 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span>Giriş Yap</span>
              </Button>

              {/* Join Button */}
              <Button
                size="sm"
                className="hidden sm:flex bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
              >
                Üye Ol
              </Button>

              {/* Cart */}
              <ModernCartSidebar>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full px-1">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </ModernCartSidebar>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <MenuIcon className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              
              {/* Mobile Navigation */}
              <nav className="space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 font-medium py-2 px-3 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Mağaza Bul
                </Button>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Giriş Yap
                  </Button>
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                    Üye Ol
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}