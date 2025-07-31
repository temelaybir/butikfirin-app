'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { ArrowRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  order_number: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
  payment_status: string
  delivery_type: string
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadRecentOrders()

    // Real-time güncellemeler
    const subscription = supabase
      .channel('recent-orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        loadRecentOrders
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadRecentOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Recent orders loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Bekliyor', variant: 'default' as const, icon: Clock },
      confirmed: { label: 'Onaylandı', variant: 'secondary' as const, icon: AlertCircle },
      preparing: { label: 'Hazırlanıyor', variant: 'secondary' as const, icon: AlertCircle },
      ready: { label: 'Hazır', variant: 'default' as const, icon: CheckCircle },
      completed: { label: 'Tamamlandı', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'İptal', variant: 'destructive' as const, icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentBadge = (status: string) => {
    const config = status === 'paid' 
      ? { label: 'Ödendi', variant: 'default' as const }
      : { label: 'Bekliyor', variant: 'outline' as const }

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getDeliveryType = (type: string) => {
    const types = {
      pickup: 'Gel Al',
      delivery: 'Teslimat',
      dine_in: 'Masada'
    }
    return types[type as keyof typeof types] || type
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Son Siparişler</CardTitle>
            <CardDescription>En son gelen 10 sipariş</CardDescription>
          </div>
          <Link href="/admin/siparisler">
            <Button variant="outline" size="sm">
              Tümünü Gör
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Henüz sipariş bulunmuyor
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sipariş No</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Teslimat</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Ödeme</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">#{order.order_number}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                  <TableCell>{getDeliveryType(order.delivery_type)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.payment_status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(order.created_at), 'HH:mm', { locale: tr })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}