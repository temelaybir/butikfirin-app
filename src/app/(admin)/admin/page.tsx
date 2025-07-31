'use client'

import { DashboardStats } from './dashboard-stats'
import { RecentOrders } from './recent-orders'
import { RevenueChart } from './revenue-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ChefHat, 
  ShoppingCart, 
  Package, 
  Users, 
  Clock, 
  Award, 
  Download,
  Coffee,
  Plus,
  Settings
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [isSeedingCategories, setIsSeedingCategories] = useState(false)
  const [isSeedingSettings, setIsSeedingSettings] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)

  const seedCategories = async () => {
    setIsSeedingCategories(true)
    try {
      const response = await fetch('/api/admin/seed-categories', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Kategoriler başarıyla eklendi!')
      } else {
        toast.error(data.error || 'Kategoriler eklenemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setIsSeedingCategories(false)
    }
  }

  const seedSettings = async () => {
    setIsSeedingSettings(true)
    try {
      const response = await fetch('/api/admin/seed-site-settings', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Site ayarları başarıyla eklendi!')
      } else {
        toast.error(data.error || 'Site ayarları eklenemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setIsSeedingSettings(false)
    }
  }

  const migrateThemeColumns = async () => {
    setIsMigrating(true)
    try {
      const response = await fetch('/api/admin/migrate-theme-columns', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Tema kolonları başarıyla eklendi!')
        if (data.data?.sql) {
          console.log('SQL to run if needed:', data.data.sql)
        }
      } else {
        toast.error(data.error || 'Tema kolonları eklenemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ChefHat className="text-orange-600" />
            Butik Fırın Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Bugün: {new Date().toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={seedCategories} 
            disabled={isSeedingCategories}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {isSeedingCategories ? 'Ekleniyor...' : 'Başlangıç Kategorileri'}
          </Button>
          <Button 
            variant="outline"
            onClick={seedSettings} 
            disabled={isSeedingSettings}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            {isSeedingSettings ? 'Ekleniyor...' : 'Site Ayarları'}
          </Button>
          <Button 
            variant="outline"
            onClick={migrateThemeColumns} 
            disabled={isMigrating}
            className="gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-300"
          >
            <Settings className="h-4 w-4" />
            {isMigrating ? 'Güncelleniyor...' : 'Tema Kolonları'}
          </Button>
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            08:00 - 22:00
          </Badge>
          <Badge className="bg-green-100 text-green-800 gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Açık
          </Badge>
        </div>
      </div>

      {/* Real-time Stats */}
      <DashboardStats />

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-1">
        <RevenueChart />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription>
            Sık kullanılan işlemlere hızlı erişim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
            <Link href="/admin/siparisler">
              <Button className="w-full h-20 flex flex-col gap-2">
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs">Siparişler</span>
              </Button>
            </Link>
            <Link href="/admin/urunler">
              <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                <Package className="h-6 w-6" />
                <span className="text-xs">Ürün Ekle</span>
              </Button>
            </Link>
            <Link href="/admin/musteriler">
              <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                <Users className="h-6 w-6" />
                <span className="text-xs">Müşteriler</span>
              </Button>
            </Link>
            <Link href="/admin/sadakat-programi">
              <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                <Award className="h-6 w-6" />
                <span className="text-xs">Sadakat</span>
              </Button>
            </Link>
            <Link href="/admin/disa-aktarma">
              <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                <Download className="h-6 w-6" />
                <span className="text-xs">Dışa Aktar</span>
              </Button>
            </Link>
            <Link href="/admin/bildirimler">
              <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                <Clock className="h-6 w-6" />
                <span className="text-xs">Bildirimler</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <RecentOrders />

      {/* Restaurant Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-orange-600" />
              Mutfak Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Bekleyen Siparişler</span>
              <Badge className="bg-yellow-100 text-yellow-800">12</Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Hazırlanan Siparişler</span>
              <Badge className="bg-blue-100 text-blue-800">5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ortalama Hazırlanma</span>
              <span className="text-sm font-medium">12 dk</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Masa Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Dolu Masalar</span>
              <Badge className="bg-red-100 text-red-800">8/12</Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Boş Masalar</span>
              <Badge className="bg-green-100 text-green-800">4</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Rezervasyonlar</span>
              <span className="text-sm font-medium">3</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Çalışma Saatleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Hafta İçi</span>
                <span className="font-medium">08:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Hafta Sonu</span>
                <span className="font-medium">08:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span>Bugün Kalan</span>
                <Badge variant="outline">5 saat 30 dk</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}