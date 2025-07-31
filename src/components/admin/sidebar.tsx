'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ChefHat, 
  Users, 
  ShoppingCart, 
  Settings,
  Palette,
  BarChart,
  FileText,
  Bell,
  Shield,
  Clock,
  UtensilsCrossed,
  Coffee,
  Calendar,
  Truck,
  CreditCard,
  Monitor,
  Gift,
  Download,
  ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Siparişler',
    href: '/admin/siparisler',
    icon: ShoppingCart,
    badge: 'new'
  },
  {
    title: 'Menü Yönetimi',
    href: '/admin/urunler',
    icon: ChefHat
  },
  {
    title: 'Kategoriler',
    href: '/admin/kategoriler',
    icon: UtensilsCrossed
  },
  {
    title: 'Müşteriler',
    href: '/admin/musteriler',
    icon: Users
  },
  {
    title: 'Sadakat Programı',
    href: '/admin/sadakat-programi',
    icon: Gift
  },
  {
    title: 'Dışa Aktarma',
    href: '/admin/disa-aktarma',
    icon: Download
  },
  {
    title: 'Masa/Teslimat',
    href: '/admin/masa-teslimat',
    icon: Truck
  },
  {
    title: 'Çalışma Saatleri',
    href: '/admin/calisma-saatleri',
    icon: Clock
  },
  {
    title: 'İçecek Menüsü',
    href: '/admin/icecekler',
    icon: Coffee
  },
  {
    title: 'Günlük Menü',
    href: '/admin/gunluk-menu',
    icon: Calendar
  },
  {
    title: 'Satış Raporları',
    href: '/admin/raporlar',
    icon: BarChart
  },
  {
    title: 'Ödeme Ayarları',
    href: '/admin/odeme-ayarlari',
    icon: CreditCard
  },
  {
    title: 'Banner Yönetimi',
    href: '/admin/hero-slider',
    icon: Monitor
  },
  {
    title: 'Logo Ayarları',
    href: '/admin/logo-ayarlari',
    icon: ImageIcon
  },
  {
    title: 'Site İçeriği',
    href: '/admin/icerik',
    icon: FileText
  },
  {
    title: 'Tema Ayarları',
    href: '/admin/tema',
    icon: Palette
  },
  {
    title: 'Butik Fırın Ayarları',
    href: '/admin/site-ayarlari',
    icon: Settings
  },
  {
    title: 'Bildirimler',
    href: '/admin/bildirimler',
    icon: Bell
  },
  {
    title: 'Güvenlik',
    href: '/admin/guvenlik',
    icon: Shield
  }
]

export function AdminSidebar() {
  const pathname = usePathname()
  
  return (
    <div className="w-64 bg-card border-r flex flex-col h-screen">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b flex-shrink-0">
        <Link 
          href="/admin" 
          className="flex items-center gap-2 touch-manipulation"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <ChefHat className="text-white w-4 h-4" />
          </div>
          <span className="font-semibold text-lg text-orange-600">Butik Fırın</span>
        </Link>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors touch-manipulation',
                        isActive
                          ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-600'
                          : 'text-muted-foreground hover:bg-orange-50 hover:text-orange-600'
                      )}
                      style={{ 
                        WebkitTapHighlightColor: 'transparent',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {item.title}
                      </div>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          new
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </ScrollArea>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t bg-card">
        <div className="text-center mb-2">
          <div className="text-xs text-muted-foreground">
            © 2024 Butik Fırın
          </div>
          <div className="text-xs text-muted-foreground">
            Restaurant Management
          </div>
        </div>
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-orange-600 transition-colors touch-manipulation bg-orange-50 py-2 rounded-lg"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          <span>← Menüyü Görüntüle</span>
        </Link>
      </div>
    </div>
  )
} 