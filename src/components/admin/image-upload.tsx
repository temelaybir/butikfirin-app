'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SafeImage } from '@/components/ui/safe-image'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  title: string
  description?: string
  requirements: {
    width: number
    height: number
    maxSize: number // MB
    formats: string[]
    aspectRatio?: string
  }
  placeholder?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  title,
  description,
  requirements,
  placeholder = "Görsel seçin veya URL girin",
  className = ""
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    setError(null)
    
    // Format kontrolü
    if (!requirements.formats.includes(file.type)) {
      setError(`Desteklenen formatlar: ${requirements.formats.join(', ')}`)
      return
    }

    // Boyut kontrolü
    if (file.size > requirements.maxSize * 1024 * 1024) {
      setError(`Maksimum dosya boyutu: ${requirements.maxSize}MB`)
      return
    }

    // Önizleme için önce dosyayı oku
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      
      // Görsel boyut kontrolü için yeni bir Image oluştur
      const img = new Image()
      img.onload = () => {
        // Boyut kontrolünü opsiyonel yap - sadece uyarı ver
        if (img.width !== requirements.width || img.height !== requirements.height) {
          console.warn(`Önerilen görsel boyutu ${requirements.width}x${requirements.height}px. Yüklenen: ${img.width}x${img.height}px`)
          // Hata verme, sadece devam et
        }
        
        // Başarılı - önizleme URL'i ve onChange callback'i güncelle
        setPreviewUrl(url)
        onChange(url)
      }
      
      img.onerror = () => {
        setError('Geçersiz görsel dosyası')
      }
      
      // Base64 URL'i Image src'ye ata
      img.src = url
    }
    
    reader.onerror = () => {
      setError('Dosya okuma hatası')
    }
    
    // Dosyayı DataURL olarak oku
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUrlChange = (url: string) => {
    setError(null)
    if (url.trim()) {
      // URL'i hem preview hem de parent'a gönder
      setPreviewUrl(url)
    } else {
      // URL boşsa preview'ı temizle
      setPreviewUrl(null)
    }
    onChange(url)
  }

  const clearImage = () => {
    setPreviewUrl(null)
    setError(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <h3 className="font-medium text-sm mb-1">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
        )}
        
        {/* Gereksinimler */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {requirements.width}x{requirements.height}px
          </Badge>
          <Badge variant="outline" className="text-xs">
            Max {requirements.maxSize}MB
          </Badge>
          <Badge variant="outline" className="text-xs">
            {requirements.formats.join(', ')}
          </Badge>
          {requirements.aspectRatio && (
            <Badge variant="outline" className="text-xs">
              Oran: {requirements.aspectRatio}
            </Badge>
          )}
        </div>
      </div>

      {/* Upload Alanı */}
      <Card className={`border-2 border-dashed transition-colors ${
        isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
      }`}>
        <CardContent className="p-4">
          <div
            className="flex flex-col items-center justify-center py-6 space-y-3"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {previewUrl ? (
              <div className="relative w-full max-w-xs">
                <SafeImage
                  src={previewUrl}
                  alt="Önizleme"
                  width={requirements.width}
                  height={requirements.height}
                  className="w-full h-auto rounded-md object-cover"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={clearImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">Görsel yükleyin</p>
                  <p className="text-xs text-muted-foreground">
                    Sürükleyip bırakın veya tıklayın
                  </p>
                </div>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={requirements.formats.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Dosya Seç
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URL Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium">Veya URL girin:</label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Hata Mesajı */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

    </div>
  )
} 