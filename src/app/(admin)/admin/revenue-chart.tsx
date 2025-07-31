'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { createClient } from '@/lib/supabase/client'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { tr } from 'date-fns/locale'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type Period = '7d' | '30d' | '90d'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    tension: number
  }[]
}

export function RevenueChart() {
  const [period, setPeriod] = useState<Period>('7d')
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadChartData()
  }, [period])

  const loadChartData = async () => {
    setLoading(true)
    try {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      const endDate = new Date()
      const startDate = subDays(endDate, days - 1)

      // Belirtilen dönemdeki tüm siparişleri al
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount, created_at, status')
        .gte('created_at', startOfDay(startDate).toISOString())
        .lte('created_at', endOfDay(endDate).toISOString())
        .in('status', ['completed', 'paid']) // Sadece tamamlanmış siparişler

      if (error) throw error

      // Günlük gelir verilerini hesapla
      const dailyRevenue: { [key: string]: number } = {}
      const dailyOrders: { [key: string]: number } = {}

      // Tüm günleri 0 ile başlat
      for (let i = 0; i < days; i++) {
        const date = format(subDays(endDate, days - 1 - i), 'yyyy-MM-dd')
        dailyRevenue[date] = 0
        dailyOrders[date] = 0
      }

      // Siparişleri günlere göre grupla
      orders?.forEach(order => {
        const date = format(new Date(order.created_at), 'yyyy-MM-dd')
        if (dailyRevenue[date] !== undefined) {
          dailyRevenue[date] += order.total_amount || 0
          dailyOrders[date] += 1
        }
      })

      // Chart.js için veri hazırla
      const labels = Object.keys(dailyRevenue).map(date => 
        format(new Date(date), 'dd MMM', { locale: tr })
      )
      
      const revenueData = Object.values(dailyRevenue)
      const ordersData = Object.values(dailyOrders)

      setChartData({
        labels,
        datasets: [
          {
            label: 'Gelir (₺)',
            data: revenueData,
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            tension: 0.3
          },
          {
            label: 'Sipariş Sayısı',
            data: ordersData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3
          }
        ]
      })
    } catch (error) {
      console.error('Chart data loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            if (label.includes('Gelir')) {
              return `${label}: ${new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY'
              }).format(value)}`
            }
            return `${label}: ${value}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gelir ve Sipariş Trendi</CardTitle>
            <CardDescription>Günlük gelir ve sipariş sayısı değişimi</CardDescription>
          </div>
          <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Son 7 gün</SelectItem>
              <SelectItem value="30d">Son 30 gün</SelectItem>
              <SelectItem value="90d">Son 90 gün</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse">Grafik yükleniyor...</div>
            </div>
          ) : (
            <Line data={chartData} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}