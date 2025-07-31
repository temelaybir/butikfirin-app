'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/context/cart-context'
import { useCurrency } from '@/context/currency-context'
import { cn } from '@/lib/utils'
import { CreditCard, Minus, Package, Plus, ShoppingCart, Sparkles, Truck, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface OrderDrawerProps {
  open: boolean
  onClose: () => void
}

export function OrderDrawer({ open, onClose }: OrderDrawerProps) {
  const { cart, updateQuantity, removeFromCart, getShippingInfo, getFinalTotal } = useCart()
  const { formatPrice } = useCurrency()
  const shippingInfo = getShippingInfo()

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:w-[480px] p-0 flex flex-col",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          "sm:data-[state=open]:slide-in-from-right-0 sm:data-[state=closed]:slide-out-to-right-0",
          // Mobile: full screen bottom sheet
          "max-sm:w-full max-sm:h-[85vh] max-sm:rounded-t-3xl",
          "max-sm:data-[state=open]:slide-in-from-bottom max-sm:data-[state=closed]:slide-out-to-bottom"
        )}
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold">Siparişiniz</SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  {cart.totalItems} ürün • {formatPrice(cart.subtotal)}
                </SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sipariş listeniz boş</h3>
              <p className="text-muted-foreground mb-6">
                Henüz siparişinize ürün eklemediniz. Lezzetli ürünlerimizi keşfetmeye başlayın!
              </p>
              <Button onClick={onClose} className="w-full max-w-xs">
                <Sparkles className="w-4 h-4 mr-2" />
                Ürünleri Keşfet
              </Button>
            </div>
          ) : (
            <>
              {/* Order Items */}
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 py-4">
                  {cart.items.map((item) => (
                    <Card key={item.id} className="border-0 shadow-sm bg-muted/20">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image_url || '/placeholder-product.svg'}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-product.svg'
                              }}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm leading-tight mb-1 truncate">
                              {item.product.name}
                            </h4>

                            {/* Variant info */}
                            {item.variant && (
                              <div className="text-xs text-muted-foreground mb-2">
                                {item.variant.name}
                              </div>
                            )}

                            {/* Special notes */}
                            {item.notes && (
                              <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded mb-2">
                                🍰 {item.notes}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>

                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>

                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= (item.maxQuantity || 999)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <div className="text-sm font-semibold">
                                  {formatPrice(item.product.price * item.quantity)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatPrice(item.product.price)} × {item.quantity}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              {/* Order Summary & Actions */}
              <div className="border-t bg-background/95 backdrop-blur-sm">
                <div className="px-6 py-4 space-y-4">
                  {/* Shipping Info */}
                  {shippingInfo.remainingForFreeShipping > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <Truck className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {formatPrice(shippingInfo.remainingForFreeShipping)} daha ekleyin, ücretsiz kargo kazanın!
                        </span>
                      </div>
                    </div>
                  )}

                  {shippingInfo.isFree && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Ücretsiz Kargo
                        </Badge>
                        <span className="text-sm">100 TL üzeri siparişlerde bedava!</span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ara Toplam</span>
                      <span>{formatPrice(cart.subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Kargo</span>
                      <span>
                        {shippingInfo.isFree ? (
                          <span className="text-green-600 font-medium">Ücretsiz</span>
                        ) : (
                          formatPrice(shippingInfo.cost)
                        )}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-semibold">
                      <span>Toplam</span>
                      <span className="text-primary">{formatPrice(getFinalTotal())}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <Button
                      className="w-full h-12 text-lg font-medium"
                      size="lg"
                      asChild
                    >
                      <Link href="/sepet">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Siparişi Tamamla
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={onClose}
                    >
                      Alışverişe Devam Et
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Güvenli Ödeme
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Hızlı Teslimat
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Taze Ürünler
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 