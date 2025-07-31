'use client'

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SafeImage } from '@/components/ui/safe-image'
import { useCart } from '@/context/cart-context'
import { useCurrency } from '@/context/currency-context'
import { ShoppingCart, Plus, Minus, Trash2, Package, ArrowRight, Sparkles, Heart, X, Gift, Coffee, Award } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ModernCartSidebarProps {
  children: React.ReactNode
}

export function ModernCartSidebar({ children }: ModernCartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, isOpen, closeCart, openCart } = useCart()
  const { formatPrice } = useCurrency()
  
  // Get items from cart
  const items = cart?.items || []
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
      return
    }

    setAnimatingItems(prev => new Set(prev).add(itemId))
    updateQuantity(itemId, newQuantity)
    
    setTimeout(() => {
      setAnimatingItems(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }, 300)
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
    toast.success('Ürün sepetten çıkarıldı', {
      className: 'toast-custom',
      duration: 2000
    })
  }

  const handleSendOrder = async () => {
    if (items.length === 0) {
      toast.error('Sepetiniz boş!')
      return
    }

    try {
      // Create order object
      const order = {
        items: items.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity
        })),
        totalPrice: totalPrice,
        orderDate: new Date().toISOString(),
        status: 'pending'
      }

      // Send order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
      })

      const data = await response.json()

      if (data.success) {
        // Show success message with order number
        toast.success(`Siparişiniz alındı! Sipariş No: ${data.order.order_number}`, {
          duration: 5000,
          className: 'toast-custom'
        })

        // Clear the cart
        items.forEach(item => removeFromCart(item.id))
        
        // Close the sidebar
        closeCart()
      } else {
        throw new Error('Sipariş gönderilemedi')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      toast.error('Sipariş gönderilirken bir hata oluştu')
    }
  }


  return (
    <>
      <div onClick={openCart} className="cursor-pointer">
        {children}
      </div>
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md p-0 bg-white" side="right">
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="relative px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
            <div className="flex items-center justify-between pr-8">
              <SheetTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                Sepetim
              </SheetTitle>
              {totalItems > 0 && (
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs sm:text-sm">
                  {totalItems} ürün
                </Badge>
              )}
            </div>
            {/* Close Button */}
            <button
              onClick={closeCart}
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </SheetHeader>

          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
              <div className="p-6 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full mb-6">
                <ShoppingCart className="h-12 w-12 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h3>
              <p className="text-gray-600 text-center mb-6 max-w-xs">
                Lezzetli ürünlerimizi keşfetmek için hemen alışverişe başlayın
              </p>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={closeCart}
              >
                <Package className="mr-2 h-4 w-4" />
                Ürünleri Keşfet
              </Button>
            </div>
          ) : (
            <>

              {/* Cart Items */}
              <ScrollArea className="flex-1">
                <div className="px-4 sm:px-6 py-4 space-y-3">
                  {/* Loyalty Program Banner - Show one relevant message */}
                  {totalItems > 0 && (
                    <div className="mb-3">
                      {(() => {
                        // Check if cart has beverages
                        const hasBeverages = items.some(item => 
                          item.product.category_name === 'İçecekler' || 
                          item.product.category_name === 'Kahve'
                        )
                        
                        // Check if cart has desserts/pastries
                        const hasDesserts = items.some(item => 
                          item.product.category_name === 'Pastalar' || 
                          item.product.category_name === 'Tatlılar'
                        )
                        
                        // Select appropriate message
                        let message, Icon, colorClasses
                        
                        if (totalItems < 5) {
                          message = {
                            title: "5. siparişinize Türk Kahvesi hediye!",
                            subtitle: `${5 - totalItems} sipariş daha tamamlayın`,
                            icon: Coffee,
                            bgClass: "bg-gradient-to-r from-amber-50 to-orange-50",
                            borderClass: "border-amber-200",
                            iconBg: "bg-white",
                            iconColor: "text-amber-600",
                            titleColor: "text-amber-800",
                            subtitleColor: "text-amber-600"
                          }
                        } else if (totalItems < 10) {
                          message = {
                            title: "10 sipariş tamamla, %20 indirim kazan!",
                            subtitle: `${10 - totalItems} sipariş kaldı`,
                            icon: Gift,
                            bgClass: "bg-gradient-to-r from-purple-50 to-pink-50",
                            borderClass: "border-purple-200",
                            iconBg: "bg-white",
                            iconColor: "text-purple-600",
                            titleColor: "text-purple-800",
                            subtitleColor: "text-purple-600"
                          }
                        } else if (hasBeverages) {
                          message = {
                            title: "Her 7. içecek bizden!",
                            subtitle: "Sadakat kartınızı kasada gösterin",
                            icon: Sparkles,
                            bgClass: "bg-gradient-to-r from-blue-50 to-cyan-50",
                            borderClass: "border-blue-200",
                            iconBg: "bg-white",
                            iconColor: "text-blue-600",
                            titleColor: "text-blue-800",
                            subtitleColor: "text-blue-600"
                          }
                        } else if (hasDesserts) {
                          message = {
                            title: "3 arkadaşını getir, 1 tatlı hediye",
                            subtitle: "Detaylar için personele sorun",
                            icon: Heart,
                            bgClass: "bg-gradient-to-r from-red-50 to-pink-50",
                            borderClass: "border-red-200",
                            iconBg: "bg-white",
                            iconColor: "text-red-600",
                            titleColor: "text-red-800",
                            subtitleColor: "text-red-600"
                          }
                        } else {
                          return null
                        }
                        
                        const MessageIcon = message.icon
                        
                        return (
                          <div className={`${message.bgClass} rounded-lg p-3 border ${message.borderClass}`}>
                            <div className="flex items-center gap-2">
                              <div className={`${message.iconBg} rounded-full p-2 shadow-sm`}>
                                <MessageIcon className={`w-4 h-4 ${message.iconColor}`} />
                              </div>
                              <div className="flex-1">
                                <p className={`text-xs font-semibold ${message.titleColor}`}>
                                  {message.title}
                                </p>
                                <p className={`text-[10px] ${message.subtitleColor}`}>
                                  {message.subtitle}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "bg-gray-50 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:bg-gray-100",
                        animatingItems.has(item.id) && "scale-105 shadow-md"
                      )}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {/* Product Image */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-orange-50 flex-shrink-0">
                          <SafeImage
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-0.5">
                            {item.product.name}
                          </h4>
                          <p className="text-orange-600 font-bold text-sm mb-2">
                            {formatPrice(item.product.price)}
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-orange-50 rounded-xl p-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-white rounded-lg"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <span className="w-8 text-center text-sm font-semibold text-gray-900">
                                {item.quantity}
                              </span>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-white rounded-lg"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Summary & Checkout */}
              <div className="border-t border-gray-200 bg-gray-50">
                {/* Order Summary */}
                <div className="px-4 sm:px-6 py-4 space-y-3">
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Ara Toplam</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <span className="font-semibold text-gray-900 text-lg">Toplam</span>
                      <span className="font-bold text-xl text-orange-600">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 text-center bg-orange-50 rounded-md p-2">
                    ⓘ Ödeme kasada nakit veya kredi kartı ile yapılacaktır
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="px-4 sm:px-6 pb-6 space-y-3">
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white w-full py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    onClick={handleSendOrder}
                  >
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Siparişi Gönder
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full py-3 rounded-xl transition-all"
                    onClick={closeCart}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Siparişe Devam Et
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
    </>
  )
}