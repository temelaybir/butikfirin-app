'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  todayOrders: number
  todayRevenue: number
  todayCustomers: number
  pendingOrders: number
  orderChange: number
  revenueChange: number
  customerChange: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    todayOrders: 0,
    todayRevenue: 0,
    todayCustomers: 0,
    pendingOrders: 0,
    orderChange: 0,
    revenueChange: 0,
    customerChange: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadStats()
    
    // Real-time güncellemeler için subscription
    const subscription = supabase
      .channel('orders-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        loadStats
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadStats = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      // Bugünkü siparişler
      const { data: todayOrdersData, error: todayOrdersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', today.toISOString())
        .lt('created_at', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())

      if (todayOrdersError) throw todayOrdersError

      // Dünkü siparişler (karşılaştırma için)
      const { data: yesterdayOrdersData } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString())

      // Bekleyen siparişler
      const { data: pendingOrdersData } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['pending', 'confirmed', 'preparing'])

      // İstatistikleri hesapla
      const todayOrders = todayOrdersData?.length || 0
      const todayRevenue = todayOrdersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const todayCustomers = new Set(todayOrdersData?.map(order => order.customer_email || order.customer_phone)).size

      const yesterdayOrders = yesterdayOrdersData?.length || 0
      const yesterdayRevenue = yesterdayOrdersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const yesterdayCustomers = new Set(yesterdayOrdersData?.map(order => order.customer_email || order.customer_phone)).size

      // Değişim yüzdelerini hesapla
      const orderChange = yesterdayOrders > 0 ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 : 0
      const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0
      const customerChange = yesterdayCustomers > 0 ? ((todayCustomers - yesterdayCustomers) / yesterdayCustomers) * 100 : 0

      setStats({
        todayOrders,
        todayRevenue,
        todayCustomers,
        pendingOrders: pendingOrdersData?.length || 0,
        orderChange,
        revenueChange,
        customerChange
      })
    } catch (error) {
      console.error('Stats loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatChange = (change: number) => {
    const isPositive = change >= 0
    return (
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        {Math.abs(change).toFixed(1)}%
      </div>
    )
  }

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardHeader className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </CardHeader>
        </Card>
      ))}
    </div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bugünkü Siparişler</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayOrders}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">Düne göre</p>
            {formatChange(stats.orderChange)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bugünkü Gelir</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.todayRevenue)}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">Düne göre</p>
            {formatChange(stats.revenueChange)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bugünkü Müşteriler</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayCustomers}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">Düne göre</p>
            {formatChange(stats.customerChange)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bekleyen Siparişler</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Hazırlanmayı bekliyor
          </p>
        </CardContent>
      </Card>
    </div>
  )
}