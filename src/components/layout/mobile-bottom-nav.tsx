'use client'

import Link from 'next/link'
import { Home, User, Heart, ShoppingCart } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useCart } from '@/context/cart-context'
import { Badge } from '@/components/ui/badge'

const navItems = [
  {
    name: 'Menü',
    href: '/',
    icon: Home
  },
  {
    name: 'Favoriler',
    href: '/favoriler',
    icon: Heart
  },
  {
    name: 'Profil',
    href: '/profil',
    icon: User
  }
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { openCart, getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href === '/' && pathname === '/')
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-orange-600" : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
        
        {/* Sepet Butonu */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors text-orange-600 hover:text-orange-700 relative"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-orange-600 text-white text-[10px] font-bold">
                {totalItems}
              </Badge>
            )}
          </div>
          <span>Sepet</span>
        </button>
      </div>
    </div>
  )
}