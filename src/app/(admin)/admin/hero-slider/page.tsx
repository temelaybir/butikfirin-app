'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SafeImage } from '@/components/ui/safe-image'
import { ImageUpload } from '@/components/admin/image-upload'
import { toast } from 'sonner'

interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  mobile_image_url: string | null
  link_url: string | null
  button_text: string
  badge_text: string | null
  order_position: number
  is_active: boolean
  is_raw_image: boolean
  show_on_mobile: boolean
  created_at: string
  updated_at: string
}

export default function HeroSliderAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    mobile_image_url: '',
    link_url: '',
    button_text: 'Alışverişe Başla',
    badge_text: '',
    order_position: 0,
    is_active: true,
    is_raw_image: false,
    show_on_mobile: true
  })

  // Slide'ları getir
  const fetchSlides = async () => {
    try {
      // Load slides from localStorage
      const savedSlides = localStorage.getItem('butik-firin-hero-slides')
      if (savedSlides) {
        setSlides(JSON.parse(savedSlides))
      } else {
        // Default slides with Unsplash images
        const defaultSlides = [
          {
            id: '1',
            title: 'Taze & Lezzetli',
            subtitle: 'Her gün taze üretim, geleneksel tarifler',
            image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&h=600&fit=crop&q=80',
            mobile_image_url: null,
            link_url: '#menu',
            button_text: 'Menüyü Keşfet',
            badge_text: null,
            order_position: 1,
            is_active: true,
            is_raw_image: false,
            show_on_mobile: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: '%20 İndirim',
            subtitle: 'Tüm pastalarda geçerli',
            image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&q=80',
            mobile_image_url: null,
            link_url: '#pastalar',
            button_text: 'Hemen Alışveriş',
            badge_text: null,
            order_position: 2,
            is_active: true,
            is_raw_image: false,
            show_on_mobile: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Günün Menüsü',
            subtitle: 'Özel fiyatlarla',
            image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&q=80',
            mobile_image_url: null,
            link_url: '#menu',
            button_text: 'Menüyü Gör',
            badge_text: null,
            order_position: 3,
            is_active: true,
            is_raw_image: false,
            show_on_mobile: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
        setSlides(defaultSlides)
        localStorage.setItem('butik-firin-hero-slides', JSON.stringify(defaultSlides))
      }
    } catch (error) {
      console.error('Fetch slides işlemi hatası:', error)
      toast.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  // Form temizle
  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      mobile_image_url: '',
      link_url: '',
      button_text: 'Alışverişe Başla',
      badge_text: '',
      order_position: slides.length,
      is_active: true,
      is_raw_image: false,
      show_on_mobile: true
    })
    setEditingSlide(null)
  }

  // Dialog aç
  const openDialog = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide)
      setFormData({
        title: slide.title,
        subtitle: slide.subtitle || '',
        image_url: slide.image_url,
        mobile_image_url: slide.mobile_image_url || '',
        link_url: slide.link_url || '',
        button_text: slide.button_text,
        badge_text: slide.badge_text || '',
        order_position: slide.order_position,
        is_active: slide.is_active,
        is_raw_image: slide.is_raw_image,
        show_on_mobile: slide.show_on_mobile ?? true
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  // Kaydet
  const handleSave = async () => {
    try {
      if (!formData.title.trim() || !formData.image_url.trim()) {
        toast.error('Başlık ve görsel zorunludur')
        return
      }

      const now = new Date().toISOString()
      let updatedSlides = [...slides]
      
      if (editingSlide) {
        // Güncelle
        updatedSlides = slides.map(slide => 
          slide.id === editingSlide.id
            ? {
                ...slide,
                title: formData.title.trim(),
                subtitle: formData.subtitle.trim() || null,
                image_url: formData.image_url.trim(),
                mobile_image_url: formData.mobile_image_url.trim() || null,
                link_url: formData.link_url.trim() || null,
                button_text: formData.button_text.trim(),
                badge_text: formData.badge_text.trim() || null,
                order_position: formData.order_position,
                is_active: formData.is_active,
                is_raw_image: formData.is_raw_image || false,
                show_on_mobile: formData.show_on_mobile ?? true,
                updated_at: now
              }
            : slide
        )
        toast.success('Hero slide güncellendi')
      } else {
        // Yeni ekle
        const newSlide: HeroSlide = {
          id: Date.now().toString(),
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim() || null,
          image_url: formData.image_url.trim(),
          mobile_image_url: formData.mobile_image_url.trim() || null,
          link_url: formData.link_url.trim() || null,
          button_text: formData.button_text.trim(),
          badge_text: formData.badge_text.trim() || null,
          order_position: formData.order_position,
          is_active: formData.is_active,
          is_raw_image: formData.is_raw_image || false,
          show_on_mobile: formData.show_on_mobile ?? true,
          created_at: now,
          updated_at: now
        }
        updatedSlides.push(newSlide)
        toast.success('Hero slide eklendi')
      }

      // Sort by order position
      updatedSlides.sort((a, b) => a.order_position - b.order_position)
      
      // Save to localStorage
      localStorage.setItem('butik-firin-hero-slides', JSON.stringify(updatedSlides))
      setSlides(updatedSlides)
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Kaydetme işlemi hatası:', error)
      toast.error('Kaydetme sırasında hata oluştu')
    }
  }

  // Sil
  const handleDelete = async (slide: HeroSlide) => {
    if (!confirm(`"${slide.title}" adlı slide'ı silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const updatedSlides = slides.filter(s => s.id !== slide.id)
      localStorage.setItem('butik-firin-hero-slides', JSON.stringify(updatedSlides))
      setSlides(updatedSlides)
      toast.success('Hero slide silindi')
    } catch (error) {
      console.error('Silme işlemi hatası:', error)
      toast.error('Silme sırasında hata oluştu')
    }
  }

  // Aktif/pasif durumu değiştir
  const toggleActive = async (slide: HeroSlide) => {
    try {
      const updatedSlides = slides.map(s => 
        s.id === slide.id 
          ? { ...s, is_active: !s.is_active, updated_at: new Date().toISOString() }
          : s
      )
      localStorage.setItem('butik-firin-hero-slides', JSON.stringify(updatedSlides))
      setSlides(updatedSlides)
      toast.success(`Slide ${!slide.is_active ? 'aktif' : 'pasif'} edildi`)
    } catch (error) {
      console.error('Toggle işlemi hatası:', error)
      toast.error('Durum değiştirme sırasında hata oluştu')
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Hero slides yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hero Slider Yönetimi</h1>
          <p className="text-muted-foreground">Ana sayfa hero carousel slide'larını yönetin</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Slide Ekle
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSlide ? 'Hero Slide Düzenle' : 'Yeni Hero Slide'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Slide başlığı"
                />
              </div>
              
              <div>
                <Label htmlFor="subtitle">Alt Başlık</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Slide alt başlığı"
                  rows={2}
                />
              </div>
              
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                title="Ana Görsel *"
                description="Hero banner için ana görsel"
                requirements={{
                  width: 1200,
                  height: 600,
                  maxSize: 2,
                  formats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                  aspectRatio: '2:1'
                }}
                placeholder="/images/hero/hero-1.jpg"
              />
              
              <ImageUpload
                value={formData.mobile_image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, mobile_image_url: url }))}
                title="Mobil Görsel (Opsiyonel)"
                description="Mobil cihazlar için özel görsel"
                requirements={{
                  width: 600,
                  height: 800,
                  maxSize: 1,
                  formats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                  aspectRatio: '3:4'
                }}
                placeholder="/images/hero/hero-1-mobile.jpg"
              />
              
              <div>
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="örn: /menu veya boş bırakın"
                />
              </div>
              
              <div>
                <Label htmlFor="button_text">Buton Metni</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                  placeholder="Alışverişe Başla"
                />
              </div>
              
              <div>
                <Label htmlFor="badge_text">Badge Metni</Label>
                <Input
                  id="badge_text"
                  value={formData.badge_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge_text: e.target.value }))}
                  placeholder="örn: Yeni veya boş bırakın"
                />
              </div>
              
              <div>
                <Label htmlFor="order_position">Sıra</Label>
                <Input
                  id="order_position"
                  type="number"
                  value={formData.order_position}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_position: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  1-4: Üst hero alanı | 5-8: Menü altı alanı
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_raw_image"
                  checked={formData.is_raw_image || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_raw_image: checked }))}
                />
                <Label htmlFor="is_raw_image">Ham Görsel</Label>
                <span className="text-xs text-muted-foreground ml-2">
                  (Açıksa sadece görsel gösterilir, başlık/buton olmaz)
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="show_on_mobile"
                  checked={formData.show_on_mobile ?? true}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_on_mobile: checked }))}
                />
                <Label htmlFor="show_on_mobile">Mobilde Göster</Label>
                <span className="text-xs text-muted-foreground ml-2">
                  (Kapalıysa bu banner mobilde görünmez)
                </span>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingSlide ? 'Güncelle' : 'Kaydet'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  İptal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {slides.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz slide eklenmedi</h3>
            <p className="text-muted-foreground text-center mb-4">
              Ana sayfa hero slider'ı için ilk slide'ınızı ekleyin
            </p>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              İlk Slide'ı Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {slides.map((slide) => (
            <Card key={slide.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <SafeImage
                      src={slide.image_url}
                      alt={slide.title}
                      width={200}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{slide.title}</h3>
                        {slide.subtitle && (
                          <p className="text-muted-foreground text-sm mt-1">
                            {slide.subtitle}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={slide.is_active ? 'default' : 'secondary'}>
                            {slide.is_active ? 'Aktif' : 'Pasif'}
                          </Badge>
                          <Badge variant="outline" className="rounded">
                            Sıra: {slide.order_position}
                            {slide.order_position >= 1 && slide.order_position <= 4 ? ' (Üst)' : ''}
                            {slide.order_position >= 5 && slide.order_position <= 8 ? ' (Alt)' : ''}
                          </Badge>
                          {slide.show_on_mobile === false && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              Mobilde Gizli
                            </Badge>
                          )}
                          {slide.is_raw_image && (
                            <Badge variant="destructive">Ham Görsel</Badge>
                          )}
                          {slide.badge_text && (
                            <Badge variant="secondary">{slide.badge_text}</Badge>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          Buton: {slide.button_text} | Link: {slide.link_url || 'Yok'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={slide.is_active}
                          onCheckedChange={() => toggleActive(slide)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(slide)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(slide)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 