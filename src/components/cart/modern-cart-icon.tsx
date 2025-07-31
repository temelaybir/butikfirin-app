'use client'

import { useCart } from '@/context/cart-context'
import { useCurrency } from '@/context/currency-context'
import { ModernCartSidebar } from './modern-cart-sidebar'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ModernCartIcon() {
  const { cart, getTotalPrice, getTotalItems } = useCart()
  const { formatPrice } = useCurrency()
  
  const items = cart?.items || []
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const hasItems = totalItems > 0

  return (
    <ModernCartSidebar>
      <div className="relative cursor-pointer group">
        {/* Cart Button */}
        <div className={cn(
          "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl",
          hasItems 
            ? "bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white shadow-orange-200/50 hover:shadow-orange-300/50 hover:scale-105" 
            : "bg-white/90 backdrop-blur-sm border-2 border-orange-200/50 text-orange-700 hover:border-orange-300 hover:bg-orange-50/50"
        )}>
          {/* Cart Icon with Animation */}
          <div className="relative">
            <ShoppingCart className={cn(
              "h-5 w-5 transition-transform duration-300",
              hasItems && "group-hover:scale-110"
            )} />
            
            {/* Item Count Badge */}
            {hasItems && (
              <div className="absolute -top-2 -right-2 h-5 w-5 bg-white text-orange-600 rounded-full flex items-center justify-center text-xs font-bold shadow-sm animate-pulse">
                {totalItems}
              </div>
            )}
          </div>

          {/* Price Display (Desktop) */}
          <div className="hidden sm:flex flex-col">
            <span className="text-xs opacity-80">
              {hasItems ? 'Sepet' : 'Sepetim'}
            </span>
            <span className="font-bold text-sm">
              {hasItems ? formatPrice(totalPrice) : formatPrice(0)}
            </span>
          </div>

          {/* Mobile Price Badge */}
          {hasItems && (
            <div className="sm:hidden absolute -top-1 -right-1 bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
              {formatPrice(totalPrice)}
            </div>
          )}

          {/* Shimmer Effect */}
          {hasItems && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>

        {/* Floating Items Preview (Desktop Hover) */}
        {hasItems && (
          <div className="hidden lg:block absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Sepetiniz</h3>
                <span className="text-sm text-orange-600">{totalItems} ürün</span>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50/50 transition-colors">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-orange-700">
                        {item.quantity}x
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-orange-600">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {items.length > 3 && (
                  <div className="text-center py-2">
                    <span className="text-xs text-gray-500">
                      +{items.length - 3} ürün daha
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-orange-100">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Toplam:</span>
                  <span className="font-bold text-orange-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-orange-100/50 transform rotate-45" />
          </div>
        )}

        {/* Pulse Animation for New Items */}
        {hasItems && (
          <div className="absolute inset-0 rounded-2xl bg-orange-400/20 animate-ping opacity-0 group-hover:opacity-100" />
        )}
      </div>
    </ModernCartSidebar>
  )
}