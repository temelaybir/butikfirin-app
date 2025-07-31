'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/context/user-context'
import { useWishlist } from '@/context/wishlist-context'
import { useCart } from '@/context/cart-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Heart,
  Package,
  MapPin,
  LogOut,
  Edit,
  Plus,
  Trash2,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  Calendar,
  Settings,
  Home,
  Phone,
  Mail,
  Star,
  ShoppingCart
} from 'lucide-react'
import { toast } from 'sonner'

// Tab components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Status mappings
const statusMap = {
  pending: { label: 'Beklemede', color: 'bg-yellow-500', icon: Clock },
  processing: { label: 'Hazırlanıyor', color: 'bg-blue-500', icon: Package },
  shipped: { label: 'Kargoda', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Teslim Edildi', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'İptal Edildi', color: 'bg-red-500', icon: XCircle },
  refunded: { label: 'İade Edildi', color: 'bg-gray-500', icon: RotateCcw }
}

function ProfilePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoggedIn, logout, deleteAddress, setDefaultAddress } = useUser()
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState('orders')
  
  const formatPrice = (price: number) => `₺${price.toFixed(2)}`
  
  const handleAddToCart = (product: any) => {
    try {
      addToCart(product);
      toast.success(`${product.name} sepete eklendi!`, {
        duration: 2000,
        className: 'toast-custom'
      });
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      toast.error('Ürün sepete eklenirken bir hata oluştu');
    }
  };
  
  // URL'den tab parametresini al
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['orders', 'addresses', 'favorites', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.push('/')
    }
  }, [isLoggedIn, user, router])

  if (!isLoggedIn || !user) {
    return null
  }

  const handleLogout = () => {
    logout()
    toast.success('Başarıyla çıkış yaptınız')
    router.push('/')
  }

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm('Bu adresi silmek istediğinize emin misiniz?')) {
      deleteAddress(addressId)
      toast.success('Adres başarıyla silindi')
    }
  }

  const handleSetDefaultAddress = (addressId: string) => {
    setDefaultAddress(addressId)
    toast.success('Varsayılan adres güncellendi')
  }

  const memberDuration = () => {
    const memberDate = new Date(user.memberSince)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - memberDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return `${diffDays} gün`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay`
    return `${Math.floor(diffDays / 365)} yıl`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{user.firstName} {user.lastName}</h1>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Üyelik: {memberDuration()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{user.orders.length} Sipariş</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.addresses.length} Adres</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">
            <Package className="h-4 w-4 mr-2" />
            Siparişlerim
          </TabsTrigger>
          <TabsTrigger value="addresses">
            <MapPin className="h-4 w-4 mr-2" />
            Adreslerim
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Heart className="h-4 w-4 mr-2" />
            Favorilerim
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Ayarlar
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Geçmişi</CardTitle>
              <CardDescription>
                Tüm siparişlerinizi buradan takip edebilirsiniz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.orders.length === 0 ? (
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Henüz siparişiniz yok</p>
                  <Link href="/urunler">
                    <Button size="sm" className="mt-4">
                      Alışverişe Başla
                    </Button>
                  </Link>
                </div>
              ) : (
                user.orders.map((order) => {
                  const StatusIcon = statusMap[order.status].icon
                  return (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.date).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge className={`${statusMap[order.status].color} text-white`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusMap[order.status].label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.productName} x{item.quantity}</span>
                              <span className="font-medium">
                                {((item.price || 0) * (item.quantity || 0)).toLocaleString('tr-TR')} ₺
                              </span>
                            </div>
                          ))}
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium">Toplam</span>
                            <span className="font-bold text-lg">
                              {(order.total || 0).toLocaleString('tr-TR')} ₺
                            </span>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm text-muted-foreground">
                              <strong>Teslimat Adresi:</strong> {order.deliveryAddress.addressLine1}, 
                              {order.deliveryAddress.district}/{order.deliveryAddress.city}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Ödeme:</strong> {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          {(order.status === 'pending' || order.status === 'processing' || order.status === 'shipped') && (
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="flex-1"
                              asChild
                            >
                              <Link href={`/siparis-takibi/${order.orderNumber}`}>
                                <Package className="h-4 w-4 mr-1" />
                                Takip Et
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="flex-1">
                            Sipariş Detayı
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kayıtlı Adreslerim</CardTitle>
                  <CardDescription>
                    Teslimat ve fatura adreslerinizi yönetin
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Adres Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {user.addresses.map((address) => (
                  <Card key={address.id} className={address.isDefault ? 'border-primary' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{address.fullName}</span>
                            {address.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Varsayılan
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.district} / {address.city} {address.postalCode}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {address.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {address.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteAddress(address.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {!address.isDefault && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => handleSetDefaultAddress(address.id!)}
                        >
                          Varsayılan Yap
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Favori Ürünlerim</CardTitle>
              <CardDescription>
                Beğendiğiniz ürünleri buradan takip edebilirsiniz
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wishlistItems.length === 0 ? (
                <div className="text-center">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Favori listeniz boş</p>
                  <Link href="/urunler">
                    <Button size="sm" className="mt-4">
                      Ürünleri Keşfet
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                      <CardHeader className="p-0">
                        <div className="relative">
                          <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                          {product && (product as any).is_featured && (
                            <Badge className="absolute top-2 left-2" variant="secondary">
                              Öne Çıkan
                            </Badge>
                          )}
                          {product.product.stock < 10 && (
                            <Badge className="absolute bottom-2 left-2" variant="outline">
                              Son {product.product.stock} adet
                            </Badge>
                          )}
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFromWishlist(Number(product.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold line-clamp-1">{product.product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.product.category}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.product.rating}</span>
                          <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 100)})</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">
                              {formatPrice(product.product.price)}
                            </span>
                            {product.product.comparePrice && product.product.comparePrice > product.product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.product.comparePrice)}
                              </span>
                            )}
                          </div>
                        
                        <div className="flex gap-2">
                          <Button
                              size="sm"
                              onClick={() => handleAddToCart(product.product)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Sepete Ekle
                            </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/urunler/${product.id}`}>
                              İncele
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hesap Ayarları</CardTitle>
              <CardDescription>
                Kişisel bilgilerinizi ve hesap ayarlarınızı yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Kişisel Bilgiler</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Ad Soyad</label>
                      <p className="text-sm text-muted-foreground">{user.firstName} {user.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefon</label>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">E-posta</label>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button variant="outline">Bilgileri Güncelle</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Güvenlik</h3>
                <Button variant="outline">Şifre Değiştir</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Bildirimler</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Sipariş güncellemeleri</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Kampanya ve fırsatlar</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Ürün önerileri</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container py-8">Yükleniyor...</div>}>
      <ProfilePageContent />
    </Suspense>
  )
} 