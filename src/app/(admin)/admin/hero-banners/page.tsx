'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Upload, Edit, Trash2, Image as ImageIcon, Plus, Move } from 'lucide-react'

interface HeroBanner {
  id: string
  position: 'main' | 'side1' | 'side2'
  image_url: string
  title?: string
  subtitle?: string
  button_text?: string
  button_link?: string
  alt_text?: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export default function HeroBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      const response = await fetch('/api/admin/hero-banners')
      const data = await response.json()

      if (response.ok) {
        setBanners(data.banners || [])
      } else {
        toast.error('Banner\'lar yüklenemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File, position: 'main' | 'side1' | 'side2') => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/hero-banners/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        return data.url
      } else {
        toast.error(data.error || 'Görsel yüklenemedi')
        return null
      }
    } catch (error) {
      toast.error('Görsel yükleme hatası')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (banner: Partial<HeroBanner>) => {
    try {
      const url = banner.id 
        ? `/api/admin/hero-banners?id=${banner.id}`
        : '/api/admin/hero-banners'

      const response = await fetch(url, {
        method: banner.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      })

      if (response.ok) {
        toast.success(banner.id ? 'Banner güncellendi' : 'Banner eklendi')
        loadBanners()
        setShowDialog(false)
        setEditingBanner(null)
      } else {
        const data = await response.json()
        toast.error(data.error || 'İşlem başarısız')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu banner\'ı silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/hero-banners?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Banner silindi')
        loadBanners()
      } else {
        toast.error('Banner silinemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'main':
        return 'Ana Banner (Sol Büyük)'
      case 'side1':
        return 'Yan Banner 1 (Sağ Üst)'
      case 'side2':
        return 'Yan Banner 2 (Sağ Alt)'
      default:
        return position
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hero Banner Yönetimi</h1>
        <Button onClick={() => {
          setEditingBanner({
            id: '',
            position: 'main',
            image_url: '',
            is_active: true,
            display_order: 0,
            created_at: '',
            updated_at: ''
          })
          setShowDialog(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Banner Ekle
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : (
        <div className="grid gap-6">
          {['main', 'side1', 'side2'].map((position) => {
            const banner = banners.find(b => b.position === position)
            return (
              <Card key={position} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {getPositionLabel(position)}
                  </h3>
                  {banner && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingBanner(banner)
                          setShowDialog(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {banner ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={banner.image_url}
                        alt={banner.alt_text || 'Banner'}
                        className="w-full h-full object-cover"
                      />
                      {!banner.is_active && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">Pasif</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {banner.title && (
                        <p><strong>Başlık:</strong> {banner.title}</p>
                      )}
                      {banner.subtitle && (
                        <p><strong>Alt Başlık:</strong> {banner.subtitle}</p>
                      )}
                      {banner.button_text && (
                        <p><strong>Buton:</strong> {banner.button_text}</p>
                      )}
                      {banner.button_link && (
                        <p><strong>Link:</strong> {banner.button_link}</p>
                      )}
                      <p><strong>Durum:</strong> {banner.is_active ? 'Aktif' : 'Pasif'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Banner yok</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setEditingBanner({
                          id: '',
                          position: position as 'main' | 'side1' | 'side2',
                          image_url: '',
                          is_active: true,
                          display_order: 0,
                          created_at: '',
                          updated_at: ''
                        })
                        setShowDialog(true)
                      }}
                    >
                      Banner Ekle
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner?.id ? 'Banner Düzenle' : 'Yeni Banner Ekle'}
            </DialogTitle>
            <DialogDescription>
              {editingBanner?.id 
                ? 'Mevcut banner bilgilerini düzenleyin ve kaydedin.' 
                : 'Yeni bir hero banner oluşturun. Görsel, başlık ve buton bilgilerini ekleyebilirsiniz.'
              }
            </DialogDescription>
          </DialogHeader>

          {editingBanner && (
            <div className="space-y-4">
              <div>
                <Label>Pozisyon</Label>
                <Select
                  value={editingBanner.position}
                  onValueChange={(value) => setEditingBanner({
                    ...editingBanner,
                    position: value as 'main' | 'side1' | 'side2'
                  })}
                  disabled={!!editingBanner.id}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Ana Banner (Sol Büyük)</SelectItem>
                    <SelectItem value="side1">Yan Banner 1 (Sağ Üst)</SelectItem>
                    <SelectItem value="side2">Yan Banner 2 (Sağ Alt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Görsel</Label>
                {editingBanner.image_url && (
                  <div className="mb-2">
                    <img
                      src={editingBanner.image_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const url = await handleImageUpload(file, editingBanner.position)
                        if (url) {
                          setEditingBanner({ ...editingBanner, image_url: url })
                        }
                      }
                    }}
                    disabled={uploading}
                  />
                  {uploading && <span className="text-sm text-gray-500">Yükleniyor...</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Başlık</Label>
                  <Input
                    value={editingBanner.title || ''}
                    onChange={(e) => setEditingBanner({
                      ...editingBanner,
                      title: e.target.value
                    })}
                    placeholder="Opsiyonel"
                  />
                </div>

                <div>
                  <Label>Alt Başlık</Label>
                  <Input
                    value={editingBanner.subtitle || ''}
                    onChange={(e) => setEditingBanner({
                      ...editingBanner,
                      subtitle: e.target.value
                    })}
                    placeholder="Opsiyonel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Buton Metni</Label>
                  <Input
                    value={editingBanner.button_text || ''}
                    onChange={(e) => setEditingBanner({
                      ...editingBanner,
                      button_text: e.target.value
                    })}
                    placeholder="Opsiyonel"
                  />
                </div>

                <div>
                  <Label>Buton Linki</Label>
                  <Input
                    value={editingBanner.button_link || ''}
                    onChange={(e) => setEditingBanner({
                      ...editingBanner,
                      button_link: e.target.value
                    })}
                    placeholder="Opsiyonel"
                  />
                </div>
              </div>

              <div>
                <Label>Alt Metin (SEO)</Label>
                <Input
                  value={editingBanner.alt_text || ''}
                  onChange={(e) => setEditingBanner({
                    ...editingBanner,
                    alt_text: e.target.value
                  })}
                  placeholder="Görsel açıklaması"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingBanner.is_active}
                  onCheckedChange={(checked) => setEditingBanner({
                    ...editingBanner,
                    is_active: checked
                  })}
                />
                <Label>Aktif</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDialog(false)
              setEditingBanner(null)
            }}>
              İptal
            </Button>
            <Button
              onClick={() => editingBanner && handleSave(editingBanner)}
              disabled={!editingBanner?.image_url || uploading}
            >
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}