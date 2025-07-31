'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'

// Butik Fırın için restoran kategorileri
const restaurantCategories = [
  {
    title: 'Böreklerimiz',
    categories: [
      { id: 1, name: 'Tuzlu Börekler', slug: 'tuzlu-borekler', productCount: 4 },
      { id: 2, name: 'Tatlı Börekler', slug: 'tatli-borekler', productCount: 3 },
    ]
  },
  {
    title: 'Lezzetlerimiz',
    categories: [
      { id: 3, name: 'Poğaça & Açma', slug: 'pogaca-acma', productCount: 5 },
      { id: 6, name: 'Tatlılar', slug: 'tatlilar', productCount: 4 },
    ]
  },
  {
    title: 'İçeceklerimiz',
    categories: [
      { id: 4, name: 'Sıcak İçecekler', slug: 'sicak-icecekler', productCount: 3 },
      { id: 5, name: 'Soğuk İçecekler', slug: 'soguk-icecekler', productCount: 3 },
    ]
  }
]

interface MegaMenuProps {
  className?: string
}

export function MegaMenu({ className }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    setIsOpen(false)
  }

  return (
    <div 
      className={cn("relative", className)} 
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        className="flex items-center gap-2 text-base font-semibold hover:text-orange-600 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <UtensilsCrossed className="w-4 h-4" />
        Kategoriler
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {restaurantCategories.map((column, columnIndex) => (
                <div key={columnIndex}>
                  <h3 className="font-semibold text-orange-600 mb-3 text-sm uppercase tracking-wide">
                    {column.title}
                  </h3>
                  <ul className="space-y-2">
                    {column.categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/kategoriler/${category.slug}`}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 transition-colors group"
                        >
                          <span className="font-medium text-gray-700 group-hover:text-orange-600">
                            {category.name}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {category.productCount}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link
                href="/urunler"
                className="flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                <UtensilsCrossed className="w-4 h-4" />
                Tüm Menüyü Görüntüle
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}