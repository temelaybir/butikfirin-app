'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  Search, 
  MoreHorizontal, 
  Eye,
  Clock,
  CheckCircle,
  ChefHat,
  Utensils,
  XCircle,
  RefreshCw,
  User,
  Phone,
  Mail,
  Hash,
  Calendar,
  Timer
} from 'lucide-react'

interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  notes?: string
  variant?: string
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string | null
  customer_email: string | null
  table_number: string | null
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'preparing' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
}

const statusLabels = {
  pending: 'Beklemede',
  preparing: 'Hazırlanıyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi'
}

const statusIcons = {
  pending: Clock,
  preparing: ChefHat,
  completed: CheckCircle,
  cancelled: XCircle
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadOrders()
    }
  }, [statusFilter, mounted])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const url = `/api/orders?status=${statusFilter}&limit=100`
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data)
      } else {
        toast.error('Siparişler yüklenemedi')
      }
    } catch (error) {
      console.error('Orders load error:', error)
      toast.error('Siparişler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const refreshOrders = async () => {
    setRefreshing(true)
    await loadOrders()
    setRefreshing(false)
    toast.success('Siparişler güncellendi')
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Sipariş durumu güncellendi')
        await loadOrders()
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus as any })
        }
        
        // Eğer hazırlanıyor durumuna geçtiyse, 5 dakika sonra otomatik tamamla
        if (newStatus === 'preparing') {
          setTimeout(async () => {
            await updateOrderStatus(orderId, 'completed')
            toast.info('Sipariş otomatik olarak tamamlandı')
          }, 5 * 60 * 1000) // 5 dakika
        }
      } else {
        toast.error('Durum güncellenemedi')
      }
    } catch (error) {
      console.error('Status update error:', error)
      toast.error('Durum güncellenirken hata oluştu')
    }
  }

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.table_number && order.table_number.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  const getElapsedTime = (dateString: string) => {
    const created = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} dakika önce`
    } else {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} saat önce`
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sipariş Yönetimi</h1>
          <p className="text-muted-foreground">
            Müşteri siparişlerini görüntüleyin ve yönetin. Onaylanan siparişler 5 dakika sonra otomatik tamamlanır.
          </p>
        </div>
        <Button 
          onClick={refreshOrders} 
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Tümü ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Beklemede ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="preparing">
            Hazırlanıyor ({statusCounts.preparing})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Tamamlandı ({statusCounts.completed})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            İptal ({statusCounts.cancelled})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sipariş numarası, müşteri adı veya masa ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Siparişler</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sipariş No</TableHead>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Masa</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Süre</TableHead>
                  <TableHead>Toplam</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  // Bilinmeyen status için fallback
                  const validStatus = ['pending', 'preparing', 'completed', 'cancelled'].includes(order.status) 
                    ? order.status 
                    : 'pending'
                  const StatusIcon = statusIcons[validStatus as keyof typeof statusIcons]
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          {order.customer_phone && (
                            <div className="text-sm text-muted-foreground">
                              {order.customer_phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.table_number || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[validStatus as keyof typeof statusColors]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusLabels[validStatus as keyof typeof statusLabels]}
                          </Badge>
                          {order.status === 'preparing' && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              <span>5 dk sonra tamamlanacak</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{mounted ? getElapsedTime(order.created_at) : '...'}</div>
                          <div className="text-xs text-muted-foreground">
                            {mounted ? formatDate(order.created_at) : '...'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatPrice(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowOrderDetail(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Detaylar
                            </DropdownMenuItem>
                            {order.status === 'pending' && (
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                              >
                                <ChefHat className="mr-2 h-4 w-4" />
                                Hazırlamaya Başla
                              </DropdownMenuItem>
                            )}
                            {order.status === 'preparing' && (
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Tamamla
                              </DropdownMenuItem>
                            )}
                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                İptal Et
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Sipariş bulunamadı
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sipariş Detayları</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">Sipariş No:</span>
                  </div>
                  <p className="text-sm">{selectedOrder.order_number}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Tarih:</span>
                  </div>
                  <p className="text-sm">{formatDate(selectedOrder.created_at)}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Müşteri:</span>
                  </div>
                  <p className="text-sm">{selectedOrder.customer_name}</p>
                </div>

                {selectedOrder.table_number && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      <span className="font-medium">Masa:</span>
                    </div>
                    <p className="text-sm">{selectedOrder.table_number}</p>
                  </div>
                )}

                {selectedOrder.customer_phone && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">Telefon:</span>
                    </div>
                    <p className="text-sm">{selectedOrder.customer_phone}</p>
                  </div>
                )}

                {selectedOrder.customer_email && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">E-posta:</span>
                    </div>
                    <p className="text-sm">{selectedOrder.customer_email}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-semibold">Sipariş Öğeleri</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.product_name}</div>
                        {item.variant && (
                          <div className="text-sm text-muted-foreground">{item.variant}</div>
                        )}
                        {item.notes && (
                          <div className="text-sm text-muted-foreground italic">Not: {item.notes}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {item.quantity} x {formatPrice(item.unit_price)}
                        </div>
                        <div className="text-sm font-bold">
                          {formatPrice(item.total_price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Toplam Tutar:</span>
                <span>{formatPrice(selectedOrder.total_amount)}</span>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Notlar</h3>
                    <p className="text-sm bg-muted p-3 rounded-lg">{selectedOrder.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Status Update */}
              <div className="space-y-3">
                <h3 className="font-semibold">Durum Güncelle</h3>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Beklemede</SelectItem>
                    <SelectItem value="preparing">Hazırlanıyor</SelectItem>
                    <SelectItem value="completed">Tamamlandı</SelectItem>
                    <SelectItem value="cancelled">İptal Edildi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}