'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Coffee, Leaf, Award, Cake, Wine } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryItem {
  id: number
  name: string
  description: string
  icon: any
  color: string
  bgGradient: string
}

const categories: CategoryItem[] = [
  {
    id: 1,
    name: 'Premium Kahveler',
    description: 'Özenle seçilmiş çekirdekler',
    icon: Coffee,
    color: 'text-orange-600',
    bgGradient: 'from-orange-100 to-orange-200'
  },
  {
    id: 2,
    name: 'Taze Börekler',
    description: 'Günlük taze börekler',
    icon: Leaf,
    color: 'text-gray-800',
    bgGradient: 'from-gray-100 to-gray-200'
  },
  {
    id: 3,
    name: 'Özel Tatlılar',
    description: 'Geleneksel lezzetler',
    icon: Cake,
    color: 'text-orange-500',
    bgGradient: 'from-orange-50 to-orange-100'
  },
  {
    id: 4,
    name: 'Sıcak İçecekler',
    description: 'Aromalı çaylar ve kahveler',
    icon: Wine,
    color: 'text-gray-700',
    bgGradient: 'from-gray-50 to-gray-100'
  }
]

export function CategoryCarousel() {
  return (
    <div className="w-full">
      {/* Mobile: 2x2 Grid, Desktop: 4 items in a row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="group cursor-pointer"
          >
            <div className="text-center px-2">
              {/* Circular Icon */}
              <div className={cn(
                "w-20 h-20 lg:w-28 lg:h-28 mx-auto mb-4 lg:mb-6 rounded-full bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl",
                category.bgGradient
              )}>
                <category.icon className={cn("w-8 h-8 lg:w-12 lg:h-12", category.color)} />
              </div>
              
              {/* Category Info */}
              <div>
                <h3 className="font-bold text-sm lg:text-lg text-gray-900 mb-1 lg:mb-2 group-hover:text-orange-600 transition-colors duration-200 leading-tight">
                  {category.name}
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed px-1">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}