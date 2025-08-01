'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SafeImage } from '@/components/ui/safe-image'
import { useCart } from '@/context/cart-context'
import { useCurrency } from '@/context/currency-context'
import { useThemeConfig } from '@/context/theme-context'
import { useWishlist } from '@/context/wishlist-context'
import { cn } from '@/lib/utils'
import { Clock, Eye, Heart, ShoppingCart, Star, TrendingUp, Truck } from 'lucide-react'
import Link from 'next/link'
import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'

interface ProductCardProps {
  product: {
    id: number | string
    name: string
    slug: string
    price: number
    compare_price?: number | null
    images: Array<{ url: string; alt: string | null; is_main: boolean }>
    category?: { name: string; slug: string }
    stock_quantity: number
    is_active: boolean
    is_featured?: boolean
    tags?: string[] | null
  }
}

// Utility function to safely convert ID to number
const safeIdToNumber = (id: string | number): number => {
  if (typeof id === 'number') return id
  const numericId = parseInt(id)
  if (!isNaN(numericId)) return numericId

  // Convert string UUID to number using simple hash
  return Math.abs(id.toString().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0))
}

// Mock data generators
const generateMockData = (productId: number | string) => {
  const numericId = safeIdToNumber(productId)
  const ratings = [4.2, 4.5, 4.8, 4.1, 4.7, 4.3, 4.6, 4.4]
  const reviewCounts = [127, 89, 234, 567, 98, 156, 445, 78]
  const soldCounts = [1234, 892, 3421, 567, 2198, 1156, 4445, 778]

  return {
    rating: ratings[numericId % ratings.length],
    reviewCount: reviewCounts[numericId % reviewCounts.length],
    soldCount: soldCounts[numericId % soldCounts.length],
    isBestSeller: numericId % 3 === 0,
    isNew: numericId % 5 === 0,
    isFreeShipping: numericId % 2 === 0,
    fastDelivery: numericId % 4 === 0,
    inStock: true
  }
}

function ProductCardComponent({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { formatPrice } = useCurrency()
  const { theme, isLoading } = useThemeConfig()
  
  // Intersection Observer for lazy loading
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // Stop observing once visible
        }
      },
      {
        rootMargin: '100px', // Load 100px before entering viewport
        threshold: 0.15
      }
    )
    
    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  // Calculate discount percentage if compare_price exists - memoized
  const discountPercentage = useMemo(() => {
    return product.compare_price && product.compare_price > product.price
      ? Math.round((1 - (product.price / product.compare_price)) * 100)
      : 0
  }, [product.price, product.compare_price])

  // Get main image or fallback - memoized
  const { mainImage, imageUrl, imageAlt } = useMemo(() => {
    const img = product.images?.find(img => img.is_main) || product.images?.[0]
    return {
      mainImage: img,
      imageUrl: img?.url || '/placeholder-product.svg',
      imageAlt: img?.alt || product.name
    }
  }, [product.images, product.name])

  const numericId = useMemo(() => safeIdToNumber(product.id), [product.id])
  const isWishlistItem = isInWishlist(numericId)

  // Generate mock data for enhanced display - memoized to prevent re-calculation
  const mockData = useMemo(() => generateMockData(product.id), [product.id])

  const handleAddToCart = useCallback(() => {
    addToCart({
      id: numericId,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity: 1
    })
    toast.success(`${product.name} siparişe eklendi`)
  }, [addToCart, numericId, product.name, product.price, imageUrl])

  const handleWishlistToggle = useCallback(() => {
    if (isWishlistItem) {
      removeFromWishlist(numericId)
      toast.success('Favorilerden çıkarıldı')
    } else {
      addToWishlist({
        id: numericId,
        name: product.name,
        price: product.price,
        image: imageUrl
      })
      toast.success('Favorilere eklendi')
    }
  }, [isWishlistItem, removeFromWishlist, addToWishlist, numericId, product.name, product.price, imageUrl])

  // Tema yüklenene kadar default style kullan
  const cardStyle = (!isLoading && theme?.productCardStyle) ? theme.productCardStyle : 'default'
  
  // Show placeholder until visible for performance
  if (!isVisible) {
    return (
      <div 
        ref={cardRef}
        className="bg-gray-100 rounded-lg h-[420px] w-full flex items-center justify-center"
        style={{ minHeight: '420px' }}
      >
        <div className="animate-pulse w-full h-full bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  // Handler functions with preventDefault for proper touch handling
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleWishlistToggle()
  }

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stock_quantity <= 0) {
      toast.error('Bu ürün stokta yok')
      return
    }

    handleAddToCart()
  }

  // Default Style
  if (cardStyle === 'default') {
    return (
      <div className="group relative" ref={cardRef}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden h-[460px] md:h-[460px] sm:h-[380px] flex flex-col touch-manipulation">
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none will-change-auto">
            <div className="flex flex-col gap-2">
              {mockData.isBestSeller && (
                <Badge className="bg-slate-800 text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm pointer-events-none">
                  Çok Satan
                </Badge>
              )}
              {mockData.isNew && (
                <Badge className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm pointer-events-none">
                  Yeni
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm pointer-events-none">
                  %{discountPercentage}
                </Badge>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-sm opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 sm:opacity-100 transition-opacity duration-200 hover:bg-white pointer-events-auto touch-manipulation z-20"
                onClick={handleWishlist}
              >
                <Heart className={cn("h-4 w-4", isWishlistItem ? "fill-red-500 text-red-500" : "text-gray-600")} />
              </Button>
            </div>
          </div>

          {/* Product Image */}
          <Link
            href={`/urunler/${product.slug}`}
            className="block px-6 pt-6 sm:px-4 sm:pt-4 touch-manipulation cursor-pointer"
            style={{
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              touchAction: 'manipulation'
            }}
          >
            <div className="relative w-full h-48 sm:h-32 overflow-hidden rounded-xl bg-gray-50">
              <SafeImage
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-102"
              />
            </div>
          </Link>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-between px-6 pb-6 sm:px-4 sm:pb-4 touch-manipulation">
            <div className="space-y-3 sm:space-y-2">
              {product.category && (
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {product.category.name}
                </p>
              )}

              <Link
                href={`/urunler/${product.slug}`}
                className="block touch-manipulation cursor-pointer"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                <h3 className="text-base sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center gap-2 pointer-events-none">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm sm:text-xs font-medium text-gray-900">{mockData.rating}</span>
                </div>
                <span className="text-xs sm:text-xs text-gray-500">({mockData.reviewCount})</span>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-3 mt-4 sm:mt-3">
              <div className="space-y-1 pointer-events-none">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-sm sm:text-xs text-gray-500 line-through">
                      {formatPrice(product.compare_price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:flex-col sm:gap-2 relative z-20">
                <Button
                  variant="outline"
                  className="flex-1 sm:w-full text-sm touch-manipulation"
                  asChild
                >
                  <Link
                    href={`/urunler/${product.slug}`}
                    className="touch-manipulation cursor-pointer"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'none',
                      userSelect: 'none'
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2 sm:h-3 sm:w-3" />
                    Detay
                  </Link>
                </Button>
                <Button
                  className="flex-1 sm:w-full bg-orange-500 hover:bg-orange-600 text-white text-sm touch-manipulation relative z-30"
                  onClick={handleAddToCartClick}
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2 sm:h-3 sm:w-3" />
                  {product.stock_quantity === 0 ? 'Stokta Yok' : 'Siparişe Ekle'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Minimal Style
  if (cardStyle === 'minimal') {
    return (
      <div className="group relative" ref={cardRef}>
        <div className="bg-white rounded-lg hover:shadow-sm transition-shadow duration-150 overflow-hidden h-[380px] flex flex-col touch-manipulation">
          {/* Image Container */}
          <Link
            href={`/urunler/${product.slug}`}
            className="block relative h-[200px] bg-gray-50 touch-manipulation cursor-pointer"
            style={{
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <SafeImage
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 z-10 pointer-events-none">
                <Badge className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 pointer-events-none">
                  -{discountPercentage}%
                </Badge>
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:bg-white pointer-events-auto touch-manipulation"
                onClick={handleWishlist}
              >
                <Heart className={cn("h-3.5 w-3.5", isWishlistItem ? "fill-red-500 text-red-500" : "text-gray-600")} />
              </Button>
            </div>
          </Link>

          {/* Product Info */}
          <div className="flex-1 p-4 space-y-2 flex flex-col touch-manipulation">
            <Link
              href={`/urunler/${product.slug}`}
              className="touch-manipulation cursor-pointer"
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs pointer-events-none">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{mockData.rating}</span>
              <span className="text-gray-400">({mockData.reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 pointer-events-none">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 pointer-events-none">
              {mockData.freeShipping && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0 pointer-events-none">
                  <Truck className="h-2.5 w-2.5 mr-0.5" />
                  Ücretsiz Kargo
                </Badge>
              )}
              {mockData.fastDelivery && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0 pointer-events-none">
                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                  Hızlı Teslimat
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 mt-auto relative z-20">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 touch-manipulation"
                asChild
              >
                <Link
                  href={`/urunler/${product.slug}`}
                  className="touch-manipulation cursor-pointer"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Detay
                </Link>
              </Button>
              <Button
                size="sm"
                className="flex-1 touch-manipulation relative z-30"
                onClick={handleAddToCartClick}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                {product.stock_quantity === 0 ? 'Stokta Yok' : 'Siparişe Ekle'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Trendyol Style
  if (cardStyle === 'trendyol') {
    return (
      <div className="group relative" ref={cardRef}>
        <div className="bg-white rounded-lg border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all duration-150 overflow-hidden h-[420px] flex flex-col touch-manipulation">
          {/* Image Container */}
          <Link
            href={`/urunler/${product.slug}`}
            className="block relative h-[240px] bg-gray-50 touch-manipulation cursor-pointer"
            style={{
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <SafeImage
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
            />

            {/* Badges */}
            {(mockData.isBestSeller || mockData.isNew || discountPercentage > 0) && (
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                {mockData.isBestSeller && (
                  <Badge className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
                    ÇOK SATAN
                  </Badge>
                )}
                {mockData.isNew && (
                  <Badge className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
                    YENİ
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
                    %{discountPercentage} İNDİRİM
                  </Badge>
                )}
              </div>
            )}

            {/* Wishlist */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white z-20 pointer-events-auto touch-manipulation"
              onClick={handleWishlist}
            >
              <Heart className={cn("h-4 w-4", isWishlistItem ? "fill-red-500 text-red-500" : "text-gray-600")} />
            </Button>
          </Link>

          {/* Product Info */}
          <div className="flex-1 p-3 space-y-1.5 flex flex-col touch-manipulation">
            {/* Brand & Name */}
            <div>
              <p className="text-xs font-medium text-gray-600 pointer-events-none">
                {product.category?.name || 'Marka'}
              </p>
              <Link
                href={`/urunler/${product.slug}`}
                className="touch-manipulation cursor-pointer"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                <h3 className="text-sm text-gray-800 line-clamp-2 hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* Rating & Sold Count */}
            <div className="flex items-center gap-2 text-xs pointer-events-none">
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                <span className="font-medium">{mockData.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{mockData.soldCount} satıldı</span>
            </div>

            {/* Price */}
            <div className="space-y-0.5 pointer-events-none">
              {product.compare_price && product.compare_price > product.price && (
                <p className="text-xs text-gray-500 line-through">
                  {formatPrice(product.compare_price)}
                </p>
              )}
              <p className="text-lg font-bold text-orange-600">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Shipping Info */}
            <div className="flex items-center gap-1 text-[10px] pointer-events-none">
              {mockData.freeShipping && (
                <Badge variant="outline" className="border-green-500 text-green-600 px-1 py-0 pointer-events-none">
                  Kargo Bedava
                </Badge>
              )}
              {mockData.fastDelivery && (
                <span className="text-gray-500">• 2 gün içinde kargoda</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 mt-auto relative z-20">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs touch-manipulation"
                asChild
              >
                <Link
                  href={`/urunler/${product.slug}`}
                  className="touch-manipulation cursor-pointer"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Detay
                </Link>
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs touch-manipulation relative z-30"
                onClick={handleAddToCartClick}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                {product.stock_quantity === 0 ? 'Stokta Yok' : 'Siparişe Ekle'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Wolt Style
  if (cardStyle === 'wolt') {
    return (
      <div className="group relative" ref={cardRef}>
        <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200 h-[400px] flex flex-col touch-manipulation">
          {/* Image Container */}
          <Link
            href={`/urunler/${product.slug}`}
            className="block relative h-[200px] bg-gray-50 touch-manipulation cursor-pointer"
            style={{
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <SafeImage
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
            />

            {/* Delivery Time Badge */}
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <Badge className="bg-black/80 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                <Clock className="h-3 w-3 mr-1" />
                10-20 dk
              </Badge>
            </div>

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full pointer-events-none">
                  %{discountPercentage}
                </div>
              </div>
            )}
          </Link>

          {/* Product Info */}
          <div className="flex-1 p-4 space-y-3 flex flex-col touch-manipulation">
            {/* Name & Category */}
            <div>
              <Link
                href={`/urunler/${product.slug}`}
                className="touch-manipulation cursor-pointer"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                <h3 className="text-base font-semibold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mt-0.5 pointer-events-none">
                {product.category?.name || 'Kategori'} • {mockData.soldCount}+ satış
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 pointer-events-none">
              <div className="flex items-center gap-0.5 bg-gray-100 px-2 py-0.5 rounded-full">
                <Star className="h-3.5 w-3.5 fill-gray-700 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">{mockData.rating}</span>
              </div>
              <span className="text-xs text-gray-500">({mockData.reviewCount})</span>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between">
              <div className="pointer-events-none">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.compare_price)}
                    </span>
                  )}
                </div>
                {mockData.freeShipping && (
                  <p className="text-xs text-green-600 font-medium mt-0.5">
                    Ücretsiz teslimat
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 rounded-full border-gray-300 pointer-events-auto touch-manipulation"
                  onClick={handleWishlist}
                >
                  <Heart className={cn("h-4 w-4", isWishlistItem ? "fill-red-500 text-red-500" : "text-gray-600")} />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto relative z-20">
              <Button
                variant="outline"
                className="flex-1 touch-manipulation"
                asChild
              >
                <Link
                  href={`/urunler/${product.slug}`}
                  className="touch-manipulation cursor-pointer"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Detay Gör
                </Link>
              </Button>
              <Button
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white touch-manipulation relative z-30"
                onClick={handleAddToCartClick}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock_quantity === 0 ? 'Stokta Yok' : 'Siparişe Ekle'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Detailed Style
  if (cardStyle === 'detailed') {
    return (
      <div className="group relative" ref={cardRef}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200 overflow-hidden h-[520px] flex flex-col touch-manipulation">
          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
            <div className="flex flex-col gap-2">
              {mockData.isBestSeller && (
                <Badge className="bg-purple-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm pointer-events-none">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Çok Satan
                </Badge>
              )}
              {mockData.isNew && (
                <Badge className="bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm pointer-events-none">
                  <Star className="h-3 w-3 mr-1 fill-white" />
                  Yeni
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm pointer-events-none">
                  %{discountPercentage} İndirim
                </Badge>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-lg opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 sm:opacity-100 transition-opacity duration-150 hover:bg-white pointer-events-auto touch-manipulation z-20"
                onClick={handleWishlist}
              >
                <Heart className={cn("h-5 w-5", isWishlistItem ? "fill-red-500 text-red-500" : "text-gray-600")} />
              </Button>
            </div>
          </div>

          {/* Product Image - Fixed Height */}
          <div className="relative px-6 pt-6 sm:px-4 sm:pt-4">
            <Link
              href={`/urunler/${product.slug}`}
              className="block touch-manipulation cursor-pointer"
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                touchAction: 'manipulation'
              }}
            >
              <div className="relative w-full h-48 overflow-hidden rounded-xl bg-gray-50">
                <SafeImage
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-102"
                />
              </div>
            </Link>
          </div>

          {/* Product Info - Flexible Content Area */}
          <div className="flex-1 flex flex-col min-h-0 px-6 pb-6 sm:px-4 sm:pb-4 touch-manipulation">
            {/* Content Section - Flexible Height */}
            <div className="flex-1 min-h-0 pt-4 space-y-3">
              {/* Category */}
              {product.category && (
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {product.category.name}
                </p>
              )}

              {/* Product Name - Fixed Line Clamp */}
              <Link
                href={`/urunler/${product.slug}`}
                className="block touch-manipulation cursor-pointer"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                <h3 className="text-lg sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors min-h-[3rem]">
                  {product.name}
                </h3>
              </Link>

              {/* Detailed Rating & Reviews - Compact */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= Math.floor(mockData.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="font-medium text-gray-900 ml-1">{mockData.rating}</span>
                </div>
                <span className="text-xs text-gray-500">({mockData.reviewCount})</span>
                <span className="text-xs text-green-600 font-medium">{mockData.soldCount} satıldı</span>
              </div>

              {/* Features - Compact */}
              <div className="flex flex-wrap gap-1.5">
                {mockData.isFreeShipping && (
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Truck className="h-3 w-3" />
                    Ücretsiz Kargo
                  </div>
                )}
                {mockData.fastDelivery && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    Hızlı Teslimat
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section - Fixed Height */}
            <div className="flex-shrink-0 space-y-3 pt-3">
              {/* Price Section */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.compare_price)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">KDV Dahil • Kargo: 29,90 ₺</p>
              </div>

              {/* Action Buttons - Fixed Position */}
              <div className="flex gap-3 sm:flex-col sm:gap-2 relative z-20">
                <Button
                  variant="outline"
                  className="flex-1 sm:w-full text-sm touch-manipulation h-10"
                  asChild
                >
                  <Link
                    href={`/urunler/${product.slug}`}
                    className="touch-manipulation cursor-pointer"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'none',
                      userSelect: 'none'
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    İncele
                  </Link>
                </Button>
                <Button
                  className="flex-1 sm:w-full bg-orange-500 hover:bg-orange-600 text-white text-sm touch-manipulation relative z-30 h-10"
                  onClick={handleAddToCartClick}
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock_quantity === 0 ? 'Stokta Yok' : 'Siparişe Ekle'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Compact Style
  if (cardStyle === 'compact') {
    return (
      <div className="group relative" ref={cardRef}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-sm transition-shadow duration-150 overflow-hidden h-[300px] flex flex-col touch-manipulation">
          {/* Compact Image */}
          <Link
            href={`/urunler/${product.slug}`}
            className="block relative h-[140px] bg-gray-50 touch-manipulation cursor-pointer"
            style={{
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <SafeImage
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Compact Badges */}
            <div className="absolute top-1 left-1 flex gap-1 z-10 pointer-events-none">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 pointer-events-none">
                  -{discountPercentage}%
                </Badge>
              )}
              {mockData.isNew && (
                <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5 pointer-events-none">
                  YENİ
                </Badge>
              )}
            </div>

            {/* Compact Wishlist */}
            <div className="absolute top-1 right-1 z-20">
              <Button
                size="icon"
                variant="secondary"
                className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:bg-white pointer-events-auto touch-manipulation"
                onClick={handleWishlist}
              >
                <Heart className={cn("h-3 w-3", isWishlistItem ? "fill-red-500 text-red-500" : "text-gray-600")} />
              </Button>
            </div>
          </Link>

          {/* Compact Info */}
          <div className="flex-1 p-3 space-y-2 flex flex-col touch-manipulation">
            <Link
              href={`/urunler/${product.slug}`}
              className="touch-manipulation cursor-pointer"
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors leading-tight">
                {product.name}
              </h3>
            </Link>

            {/* Compact Rating */}
            <div className="flex items-center gap-1 text-xs pointer-events-none">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{mockData.rating}</span>
              <span className="text-gray-400">({mockData.reviewCount})</span>
            </div>

            {/* Compact Price */}
            <div className="flex items-baseline gap-2 pointer-events-none">
              <span className="text-base font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>

            {/* Compact Action */}
            <div className="pt-1 mt-auto relative z-20">
              <Button
                size="sm"
                className="w-full h-8 text-xs touch-manipulation relative z-30"
                onClick={handleAddToCartClick}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                {product.stock_quantity === 0 ? 'Stokta Yok' : 'Siparişe Ekle'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback to default style instead of null
  return (
    <div className="group relative">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden h-[460px] md:h-[460px] sm:h-[380px] flex flex-col touch-manipulation">
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
          <div className="flex flex-col gap-2">
            {mockData.isBestSeller && (
              <Badge className="bg-slate-800 text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm pointer-events-none">
                Çok Satan
              </Badge>
            )}
            {mockData.isNew && (
              <Badge className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm pointer-events-none">
                Yeni
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm pointer-events-none">
                %{discountPercentage}
              </Badge>
            )}
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-sm opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 sm:opacity-100 transition-opacity duration-150 hover:bg-white pointer-events-auto touch-manipulation z-20"
              onClick={handleWishlist}
            >
              <Heart className={cn("h-4 w-4", isWishlistItem ? "fill-red-500 text-red-500" : "text-gray-600")} />
            </Button>
          </div>
        </div>

        {/* Product Image */}
        <Link
          href={`/urunler/${product.slug}`}
          className="block px-6 pt-6 sm:px-4 sm:pt-4 touch-manipulation cursor-pointer"
          style={{
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            touchAction: 'manipulation'
          }}
        >
          <div className="relative w-full h-48 sm:h-32 overflow-hidden rounded-xl bg-gray-50">
            <SafeImage
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between px-6 pb-6 sm:px-4 sm:pb-4 touch-manipulation">
          <div className="space-y-3 sm:space-y-2">
            {product.category && (
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {product.category.name}
              </p>
            )}

            <Link
              href={`/urunler/${product.slug}`}
              className="block touch-manipulation cursor-pointer"
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              <h3 className="text-base sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-2 pointer-events-none">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm sm:text-xs font-medium text-gray-900">{mockData.rating}</span>
              </div>
              <span className="text-xs sm:text-xs text-gray-500">({mockData.reviewCount})</span>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-3 mt-4 sm:mt-3">
            <div className="space-y-1 pointer-events-none">
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="text-sm sm:text-xs text-gray-500 line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:flex-col sm:gap-2 relative z-20">
              <Button
                variant="outline"
                className="flex-1 sm:w-full text-sm touch-manipulation"
                asChild
              >
                <Link
                  href={`/urunler/${product.slug}`}
                  className="touch-manipulation cursor-pointer"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <Eye className="h-4 w-4 mr-2 sm:h-3 sm:w-3" />
                  Detay
                </Link>
              </Button>
              <Button
                className="flex-1 sm:w-full bg-orange-500 hover:bg-orange-600 text-white text-sm touch-manipulation relative z-30"
                onClick={handleAddToCartClick}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2 sm:h-3 sm:w-3" />
                {product.stock_quantity === 0 ? 'Stokta Yok' : 'Siparişe Ekle'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const ProductCard = React.memo(ProductCardComponent, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if product data actually changes
  const prevProduct = prevProps.product
  const nextProduct = nextProps.product
  
  return (
    prevProduct.id === nextProduct.id &&
    prevProduct.name === nextProduct.name &&
    prevProduct.price === nextProduct.price &&
    prevProduct.compare_price === nextProduct.compare_price &&
    prevProduct.stock_quantity === nextProduct.stock_quantity &&
    prevProduct.is_active === nextProduct.is_active &&
    prevProduct.is_featured === nextProduct.is_featured &&
    JSON.stringify(prevProduct.images) === JSON.stringify(nextProduct.images) &&
    JSON.stringify(prevProduct.tags) === JSON.stringify(nextProduct.tags)
  )
})