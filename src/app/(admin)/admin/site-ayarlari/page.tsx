'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Globe, Mail, Phone, Camera, Tag, Settings, Share2, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
// Removed Supabase imports - using localStorage instead

interface SiteSettings {
  id: string
  site_name: string
  site_description: string
  site_slogan: string | null
  site_logo_url: string
  site_logo_dark_url: string | null
  logo_display_mode: 'logo_only' | 'logo_with_text'
  logo_size: 'small' | 'medium' | 'large'
  favicon_url: string
  social_image_url: string
  meta_keywords: string
  meta_author: string
  meta_robots: string
  contact_email: string | null
  contact_phone: string | null
  whatsapp_number: string | null
  address: string | null
  facebook_url: string | null
  instagram_url: string | null
  whatsapp_url: string | null
  twitter_url: string | null
  youtube_url: string | null
  linkedin_url: string | null
  currency_code: string
  currency_symbol: string
  tax_rate: number
  free_shipping_threshold: number
  google_analytics_id: string | null
  google_tag_manager_id: string | null
  facebook_pixel_id: string | null
  show_social_widget: boolean
  social_widget_position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  social_widget_style: 'floating' | 'minimal' | 'compact'
  is_active: boolean
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState({
    logo: false,
    logoDark: false,
    favicon: false,
    social: false
  })

  // File input refs
  const logoInputRef = useRef<HTMLInputElement>(null)
  const logoDarkInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const socialInputRef = useRef<HTMLInputElement>(null)

  // Ayarları getir
  const fetchSettings = async () => {
    try {
      setLoading(true)
      
      // Load from localStorage
      const savedSettings = localStorage.getItem('butik-firin-site-settings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      } else {
        // Default settings
        const defaultSettings: SiteSettings = {
          id: '1',
          site_name: 'Butik Fırın',
          site_description: 'Taze, lezzetli ve doğal ürünler',
          site_slogan: 'Her gün taze, her lokma lezzet',
          site_logo_url: '/images/logo.png',
          site_logo_dark_url: null,
          logo_display_mode: 'logo_with_text',
          logo_size: 'medium',
          favicon_url: '/favicon.ico',
          social_image_url: '/social-preview.jpg',
          meta_keywords: 'pastane, fırın, taze, doğal, lezzetli',
          meta_author: 'Butik Fırın',
          meta_robots: 'index, follow',
          contact_email: 'info@butikfirin.com',
          contact_phone: '(0212) 855 44 22',
          whatsapp_number: '+905551234567',
          address: 'Adnan Kahveci Mah. Engin Sk. No:20 Beylikdüzü / İSTANBUL',
          facebook_url: 'https://facebook.com/butikfirin',
          instagram_url: 'https://instagram.com/butikfirin',
          whatsapp_url: 'https://wa.me/905551234567',
          twitter_url: null,
          youtube_url: null,
          linkedin_url: null,
          currency_code: 'TRY',
          currency_symbol: '₺',
          tax_rate: 18,
          free_shipping_threshold: 150,
          google_analytics_id: null,
          google_tag_manager_id: null,
          facebook_pixel_id: null,
          show_social_widget: true,
          social_widget_position: 'bottom-right',
          social_widget_style: 'floating',
          is_active: true
        }
        setSettings(defaultSettings)
        localStorage.setItem('butik-firin-site-settings', JSON.stringify(defaultSettings))
      }
    } catch (error) {
      console.error('FetchSettings exception:', error)
      toast.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  // Ayarları kaydet
  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem('butik-firin-site-settings', JSON.stringify(settings))
      
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new Event('siteSettingsUpdated'))
      
      toast.success('Site ayarları başarıyla kaydedildi')
    } catch (error) {
      console.error('Kaydetme işlemi hatası:', error)
      toast.error('Kaydetme sırasında hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  // Logo yükleme fonksiyonu
  const handleLogoUpload = async (file: File, logoType: 'logo' | 'logo-dark' | 'favicon' | 'social') => {
    const uploadKey = logoType === 'logo-dark' ? 'logoDark' : logoType
    
    setUploading(prev => ({ ...prev, [uploadKey]: true }))

    try {
      // Convert to base64 for localStorage
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        
        // URL'i ilgili alana kaydet
        const urlField = logoType === 'logo' ? 'site_logo_url' : 
                        logoType === 'logo-dark' ? 'site_logo_dark_url' :
                        logoType === 'favicon' ? 'favicon_url' : 'social_image_url'
        
        updateSetting(urlField as keyof SiteSettings, base64)
        
        const successMessage = logoType === 'logo' ? 'Logo' : 
                              logoType === 'logo-dark' ? 'Koyu tema logosu' : 
                              logoType === 'favicon' ? 'Favicon' : 'Sosyal medya görseli'
        
        toast.success(`${successMessage} başarıyla yüklendi`)
        setUploading(prev => ({ ...prev, [uploadKey]: false }))
        
        // If logo updated, trigger immediate update
        if (logoType === 'logo' && settings) {
          const updatedSettings = { ...settings, [urlField]: base64 }
          localStorage.setItem('butik-firin-site-settings', JSON.stringify(updatedSettings))
          window.dispatchEvent(new Event('siteSettingsUpdated'))
        }
      }
      
      reader.onerror = () => {
        toast.error('Dosya okunamadı')
        setUploading(prev => ({ ...prev, [uploadKey]: false }))
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Logo upload exception:', error)
      toast.error(`Yükleme sırasında hata oluştu`)
      setUploading(prev => ({ ...prev, [uploadKey]: false }))
    }
  }

  // Dosya seçme handler'ı
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, logoType: 'logo' | 'logo-dark' | 'favicon' | 'social') => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    // Dosya doğrulama
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      console.error('Geçersiz dosya tipi:', file.type)
      toast.error('Lütfen JPG, PNG veya SVG formatında bir görsel seçin')
      return
    }

    // Boyut kontrolleri
    const maxSize = logoType === 'favicon' ? 1024 * 1024 : 5 * 1024 * 1024 // 1MB for favicon, 5MB for others
    if (file.size > maxSize) {
      console.error('Dosya çok büyük:', { fileSize: file.size, maxSize })
      toast.error(`Dosya boyutu ${logoType === 'favicon' ? '1MB' : '5MB'}'dan büyük olamaz`)
      return
    }

    handleLogoUpload(file, logoType)
    
    // Input'u temizle
    e.target.value = ''
  }

  // Input değiştirme fonksiyonu
  const updateSetting = (field: keyof SiteSettings, value: any) => {
    if (!settings) {
      console.warn('Settings null, güncelleme atlanıyor')
      return
    }
    
    setSettings(prev => {
      if (!prev) return null
      const updated = { ...prev, [field]: value }
      return updated
    })
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Site ayarları yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Site ayarları bulunamadı</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Site Ayarları</h1>
          <p className="text-muted-foreground">Sitenizin genel ayarlarını yönetin</p>
        </div>
        
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Genel
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Marka
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            İletişim
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Sosyal Medya
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Gelişmiş
          </TabsTrigger>
        </TabsList>

        {/* Genel Ayarlar */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Genel Site Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="site_name">Site Adı *</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => updateSetting('site_name', e.target.value)}
                    placeholder="RDHN Commerce"
                  />
                </div>
                
                <div>
                  <Label htmlFor="site_slogan">Site Sloganı</Label>
                  <Input
                    id="site_slogan"
                    value={settings.site_slogan || ''}
                    onChange={(e) => updateSetting('site_slogan', e.target.value)}
                    placeholder="Kaçırılmayacak fırsatlar"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="site_description">Site Açıklaması *</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => updateSetting('site_description', e.target.value)}
                  placeholder="Sitenizin kısa açıklaması"
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="meta_keywords">SEO Anahtar Kelimeler</Label>
                <Textarea
                  id="meta_keywords"
                  value={settings.meta_keywords}
                  onChange={(e) => updateSetting('meta_keywords', e.target.value)}
                  placeholder="anahtar, kelime, virgül, ile, ayrın"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Anahtar kelimeleri virgül ile ayırın
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="meta_author">Meta Author</Label>
                  <Input
                    id="meta_author"
                    value={settings.meta_author}
                    onChange={(e) => updateSetting('meta_author', e.target.value)}
                    placeholder="RDHN Commerce"
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_robots">Meta Robots</Label>
                  <Input
                    id="meta_robots"
                    value={settings.meta_robots}
                    onChange={(e) => updateSetting('meta_robots', e.target.value)}
                    placeholder="index, follow"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marka Ayarları */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Logo ve Görsel Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Site Logosu */}
              <div className="space-y-4">
                <Label htmlFor="site_logo_url">Site Logosu *</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      id="site_logo_url"
                      value={settings.site_logo_url}
                      onChange={(e) => updateSetting('site_logo_url', e.target.value)}
                      placeholder="/logo.svg"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploading.logo}
                      className="w-full"
                    >
                      {uploading.logo ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Logo Yükle
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, SVG - Max 5MB
                    </p>
                  </div>
                  
                  {settings.site_logo_url && (
                    <div className="space-y-2">
                      <Label>Önizleme</Label>
                      <div className="relative border rounded-lg p-4 bg-white">
                        <img
                          src={settings.site_logo_url}
                          alt="Site Logosu"
                          className="object-contain max-w-full max-h-16"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo Görünüm Seçenekleri */}
              <div className="space-y-4">
                <Label>Logo Görünüm Modu</Label>
                <RadioGroup
                  value={settings.logo_display_mode}
                  onValueChange={(value: 'logo_only' | 'logo_with_text') => updateSetting('logo_display_mode', value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="logo_only" id="logo_only" />
                    <div className="flex-1">
                      <Label htmlFor="logo_only" className="font-medium cursor-pointer">
                        Sadece Logo
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Header'da sadece logo gösterilir
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="logo_with_text" id="logo_with_text" />
                    <div className="flex-1">
                      <Label htmlFor="logo_with_text" className="font-medium cursor-pointer">
                        Logo + Site Adı
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Logo'nun yanında site adı da gösterilir
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Logo Boyut Seçenekleri */}
              <div className="space-y-4">
                <Label htmlFor="logo_size">Logo Boyutu</Label>
                <Select 
                  value={settings.logo_size}
                  onValueChange={(value: 'small' | 'medium' | 'large') => updateSetting('logo_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Logo boyutunu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-xs text-white">S</div>
                        <span>Küçük (320px)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-sm text-white">M</div>
                        <span>Orta (480px)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="large">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-base text-white">L</div>
                        <span>Büyük (640px)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Header'da gösterilecek logo boyutunu seçin
                </p>
              </div>

              <Separator />

              {/* Koyu Tema Logosu */}
              <div className="space-y-4">
                <Label htmlFor="site_logo_dark_url">Koyu Tema Logosu (İsteğe Bağlı)</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      id="site_logo_dark_url"
                      value={settings.site_logo_dark_url || ''}
                      onChange={(e) => updateSetting('site_logo_dark_url', e.target.value)}
                      placeholder="/logo-dark.svg"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => logoDarkInputRef.current?.click()}
                      disabled={uploading.logoDark}
                      className="w-full"
                    >
                      {uploading.logoDark ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Koyu Logo Yükle
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Koyu tema için ayrı logo (isteğe bağlı)
                    </p>
                  </div>
                  
                  {settings.site_logo_dark_url && (
                    <div className="space-y-2">
                      <Label>Önizleme</Label>
                      <div className="relative border rounded-lg p-4 bg-gray-800">
                        <img
                          src={settings.site_logo_dark_url}
                          alt="Koyu Tema Logosu"
                          className="object-contain max-w-full max-h-16"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Diğer Görseller */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Favicon */}
                <div className="space-y-4">
                  <Label htmlFor="favicon_url">Favicon</Label>
                  <div className="space-y-2">
                    <Input
                      id="favicon_url"
                      value={settings.favicon_url}
                      onChange={(e) => updateSetting('favicon_url', e.target.value)}
                      placeholder="/favicon.ico"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => faviconInputRef.current?.click()}
                      disabled={uploading.favicon}
                      className="w-full"
                    >
                      {uploading.favicon ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Favicon Yükle
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      ICO, PNG - 32x32px önerilen, Max 1MB
                    </p>
                  </div>
                  {settings.favicon_url && (
                    <div className="border rounded-lg p-2 bg-white flex items-center gap-2">
                      <img
                        src={settings.favicon_url}
                        alt="Favicon"
                        className="w-4 h-4 object-contain"
                      />
                      <span className="text-sm text-muted-foreground">Favicon Önizleme</span>
                    </div>
                  )}
                </div>
                
                {/* Sosyal Medya Görseli */}
                <div className="space-y-4">
                  <Label htmlFor="social_image_url">Sosyal Medya Görseli</Label>
                  <div className="space-y-2">
                    <Input
                      id="social_image_url"
                      value={settings.social_image_url}
                      onChange={(e) => updateSetting('social_image_url', e.target.value)}
                      placeholder="/social-preview.jpg"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => socialInputRef.current?.click()}
                      disabled={uploading.social}
                      className="w-full"
                    >
                      {uploading.social ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Sosyal Görsel Yükle
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Facebook, Twitter paylaşımları için - 1200x630px önerilen
                    </p>
                  </div>
                  {settings.social_image_url && (
                    <div className="border rounded-lg p-2 bg-white">
                      <img
                        src={settings.social_image_url}
                        alt="Sosyal Medya Görseli"
                        className="object-cover rounded w-full max-h-16"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* İletişim Ayarları */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contact_email">E-posta Adresi</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => updateSetting('contact_email', e.target.value)}
                    placeholder="info@ardahanticaret.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_phone">Telefon Numarası</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ''}
                    onChange={(e) => updateSetting('contact_phone', e.target.value)}
                    placeholder="+90 (555) 123 45 67"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp_number">WhatsApp Numarası</Label>
                <Input
                  id="whatsapp_number"
                  value={settings.whatsapp_number || ''}
                  onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
                  placeholder="+905551234567"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ülke kodu ile birlikte, boşluk olmadan (örn: +905551234567)
                </p>
              </div>

              <div>
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  value={settings.address || ''}
                  onChange={(e) => updateSetting('address', e.target.value)}
                  placeholder="Tam adres bilgilerinizi girin"
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">E-ticaret Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currency_code">Para Birimi Kodu</Label>
                    <Input
                      id="currency_code"
                      value={settings.currency_code}
                      onChange={(e) => updateSetting('currency_code', e.target.value)}
                      placeholder="TRY"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="currency_symbol">Para Birimi Sembolü</Label>
                    <Input
                      id="currency_symbol"
                      value={settings.currency_symbol}
                      onChange={(e) => updateSetting('currency_symbol', e.target.value)}
                      placeholder="₺"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tax_rate">KDV Oranı (%)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      step="0.01"
                      value={settings.tax_rate}
                      onChange={(e) => updateSetting('tax_rate', parseFloat(e.target.value) || 0)}
                      placeholder="18.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="free_shipping_threshold">Ücretsiz Kargo Sınırı</Label>
                    <Input
                      id="free_shipping_threshold"
                      type="number"
                      step="0.01"
                      value={settings.free_shipping_threshold}
                      onChange={(e) => updateSetting('free_shipping_threshold', parseFloat(e.target.value) || 0)}
                      placeholder="150.00"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sosyal Medya */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya Hesapları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={settings.facebook_url || ''}
                    onChange={(e) => updateSetting('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/ardahanticaret"
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <Input
                    id="instagram_url"
                    value={settings.instagram_url || ''}
                    onChange={(e) => updateSetting('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/ardahanticaret"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp_url">WhatsApp URL</Label>
                  <Input
                    id="whatsapp_url"
                    value={settings.whatsapp_url || ''}
                    onChange={(e) => updateSetting('whatsapp_url', e.target.value)}
                    placeholder="https://wa.me/905551234567"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    WhatsApp Business Link veya wa.me linki
                  </p>
                </div>

                <div>
                  <Label htmlFor="twitter_url">Twitter URL</Label>
                  <Input
                    id="twitter_url"
                    value={settings.twitter_url || ''}
                    onChange={(e) => updateSetting('twitter_url', e.target.value)}
                    placeholder="https://twitter.com/ardahanticaret"
                  />
                </div>
                
                <div>
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    value={settings.youtube_url || ''}
                    onChange={(e) => updateSetting('youtube_url', e.target.value)}
                    placeholder="https://youtube.com/@ardahanticaret"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={settings.linkedin_url || ''}
                    onChange={(e) => updateSetting('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/company/ardahanticaret"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Sosyal Medya Widget Ayarları</h3>
                <div className="space-y-6">
                  {/* Widget Gösterim Durumu */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="show_social_widget" className="text-base font-medium">
                        Sosyal Medya Widget'ını Göster
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Sayfanın köşesinde sticky sosyal medya butonlarını gösterir
                      </p>
                    </div>
                    <Switch
                      id="show_social_widget"
                      checked={settings.show_social_widget || false}
                      onCheckedChange={(checked) => updateSetting('show_social_widget', checked)}
                    />
                  </div>

                  {/* Widget Pozisyonu */}
                  {settings.show_social_widget && (
                    <div className="space-y-4">
                      <Label>Widget Pozisyonu</Label>
                      <RadioGroup
                        value={settings.social_widget_position || 'bottom-right'}
                        onValueChange={(value: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => 
                          updateSetting('social_widget_position', value)
                        }
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="bottom-right" id="bottom-right" />
                          <div className="flex-1">
                            <Label htmlFor="bottom-right" className="font-medium cursor-pointer">
                              Sağ Alt
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Sayfanın sağ alt köşesi
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="bottom-left" id="bottom-left" />
                          <div className="flex-1">
                            <Label htmlFor="bottom-left" className="font-medium cursor-pointer">
                              Sol Alt
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Sayfanın sol alt köşesi
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="top-right" id="top-right" />
                          <div className="flex-1">
                            <Label htmlFor="top-right" className="font-medium cursor-pointer">
                              Sağ Üst
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Sayfanın sağ üst köşesi
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="top-left" id="top-left" />
                          <div className="flex-1">
                            <Label htmlFor="top-left" className="font-medium cursor-pointer">
                              Sol Üst
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Sayfanın sol üst köşesi
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Widget Stili */}
                  {settings.show_social_widget && (
                    <div className="space-y-4">
                      <Label>Widget Stili</Label>
                      <RadioGroup
                        value={settings.social_widget_style || 'floating'}
                        onValueChange={(value: 'floating' | 'minimal' | 'compact') => 
                          updateSetting('social_widget_style', value)
                        }
                        className="grid grid-cols-1 gap-4"
                      >
                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="floating" id="floating" />
                          <div className="flex-1">
                            <Label htmlFor="floating" className="font-medium cursor-pointer">
                              Floating (Büyük)
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Büyük butonlar, belirgin gölgeler - standart boyut
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="compact" id="compact" />
                          <div className="flex-1">
                            <Label htmlFor="compact" className="font-medium cursor-pointer">
                              Compact (Orta)
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Orta boyutlu butonlar, dengeli görünüm
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="minimal" id="minimal" />
                          <div className="flex-1">
                            <Label htmlFor="minimal" className="font-medium cursor-pointer">
                              Minimal (Küçük)
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Küçük butonlar, sade görünüm, az yer kaplar
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gelişmiş Ayarlar */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Analitik ve Takip Kodları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                <Input
                  id="google_analytics_id"
                  value={settings.google_analytics_id || ''}
                  onChange={(e) => updateSetting('google_analytics_id', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="google_tag_manager_id">Google Tag Manager ID</Label>
                <Input
                  id="google_tag_manager_id"
                  value={settings.google_tag_manager_id || ''}
                  onChange={(e) => updateSetting('google_tag_manager_id', e.target.value)}
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
                <Input
                  id="facebook_pixel_id"
                  value={settings.facebook_pixel_id || ''}
                  onChange={(e) => updateSetting('facebook_pixel_id', e.target.value)}
                  placeholder="123456789012345"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden file inputs */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'logo')}
        className="hidden"
      />
      <input
        ref={logoDarkInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'logo-dark')}
        className="hidden"
      />
      <input
        ref={faviconInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'favicon')}
        className="hidden"
      />
      <input
        ref={socialInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'social')}
        className="hidden"
      />
    </div>
  )
} 