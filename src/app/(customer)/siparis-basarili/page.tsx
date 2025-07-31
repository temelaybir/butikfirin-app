'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ShoppingBag, Clock, User, Phone, Hash, ChefHat, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface OrderDetails {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string | null
  customer_email: string | null
  table_number: string | null
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
}

interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  notes?: string
  variant?: string
}

const statusLabels = {
  pending: 'Beklemede',
  confirmed: 'Onaylandı',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi'
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderNumber = searchParams.get('orderNumber')
        
        if (!orderNumber) {
          setError('Sipariş numarası bulunamadı')
          setIsLoading(false)
          return
        }

        const response = await fetch(`/api/orders?orderNumber=${orderNumber}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          setOrderDetails(data.data)
        } else {
          setError('Sipariş bilgileri alınamadı')
        }
      } catch (err) {
        console.error('Order fetch error:', err)
        setError('Sipariş bilgileri yüklenirken hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [searchParams])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Sipariş bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Sipariş Bulunamadı</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button asChild>
                <Link href="/urunler">Menüye Dön</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Siparişiniz Alındı! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Siparişiniz başarıyla oluşturuldu ve restoranımıza iletildi.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Sipariş Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sipariş Numarası</p>
                    <p className="font-medium">{orderDetails.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tarih</p>
                    <p className="font-medium">{formatDate(orderDetails.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Durum</p>
                    <Badge className={statusColors[orderDetails.status]}>
                      {statusLabels[orderDetails.status]}
                    </Badge>
                  </div>
                  {orderDetails.table_number && (
                    <div>
                      <p className="text-sm text-muted-foreground">Masa</p>
                      <p className="font-medium">{orderDetails.table_number}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Müşteri Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Ad Soyad</p>
                  <p className="font-medium">{orderDetails.customer_name}</p>
                </div>
                {orderDetails.customer_phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telefon</p>
                    <p className="font-medium">{orderDetails.customer_phone}</p>
                  </div>
                )}
                {orderDetails.customer_email && (
                  <div>
                    <p className="text-sm text-muted-foreground">E-posta</p>
                    <p className="font-medium">{orderDetails.customer_email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Sipariş Öğeleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">{item.variant}</p>
                        )}
                        {item.notes && (
                          <p className="text-sm text-muted-foreground italic">Not: {item.notes}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.total_price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Toplam</span>
                  <span>{formatPrice(orderDetails.total_amount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {orderDetails.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Sipariş Notları</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{orderDetails.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Sipariş Durumu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <Badge className={`${statusColors[orderDetails.status]} px-4 py-2 text-base`}>
                    {statusLabels[orderDetails.status]}
                  </Badge>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Siparişiniz alındı ve onay bekliyor</p>
                    <p>• Onaylandıktan sonra hazırlanmaya başlanacak</p>
                    <p>• Hazır olduğunda size bildirilecek</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estimated Time */}
            <Card>
              <CardHeader>
                <CardTitle>Tahmini Hazırlanma Süresi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15-25</div>
                  <p className="text-muted-foreground">dakika</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/urunler">
                  Menüye Dön
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  Ana Sayfaya Dön
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>İletişim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>Restoran: (0212) 555 0123</span>
                  </div>
                  <p className="text-muted-foreground">
                    Sorularınız için bizi arayabilirsiniz.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  )
}