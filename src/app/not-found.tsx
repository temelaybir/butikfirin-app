import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ChefHat, UtensilsCrossed, Coffee } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center shadow-lg border-orange-200">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-orange-600 mb-2">
              404
            </CardTitle>
            <CardDescription className="text-lg">
              Bu Lezzet Bulunamadı
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
              <Coffee className="w-5 h-5" />
              <span className="text-sm font-medium">Mutfakta Hazırlanıyor</span>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              Aradığınız sayfa şu anda mutfağımızda hazırlanıyor. Lütfen biraz sonra tekrar deneyiniz.
            </p>
            
            <p className="text-xs text-gray-500">
              Bu tarif henüz menümüze eklenmemiş olabilir.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Ana Sayfaya Dön
              </Link>
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild className="border-orange-200 text-orange-600 hover:bg-orange-50">
                <Link href="/urunler">Menümüz</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="border-orange-200 text-orange-600 hover:bg-orange-50">
                <Link href="/kategoriler">Kategoriler</Link>
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-orange-200">
            <p className="text-xs text-gray-500">
              Yardıma mı ihtiyacınız var?{' '}
              <Link href="/iletisim" className="text-orange-600 hover:underline">
                Bize yazın
              </Link>
              {' '}veya{' '}
              <Link href="tel:02125550123" className="text-orange-600 hover:underline">
                (0212) 555 0123
              </Link>
              {' '}numarasından arayın.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = {
  title: '404 - Sayfa Bulunamadı | Butik Fırın',
  description: 'Aradığınız sayfa bulunamadı. Ana sayfamıza dönün veya lezzetli menümüzü keşfedin.',
} 