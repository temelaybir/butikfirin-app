'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import imageLoader from '@/lib/image-loader'

interface SafeImageProps {
  src: string | null | undefined
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  quality?: number
}

const DEFAULT_PLACEHOLDER = '/placeholder-product.svg'

// URL'yi temizle ve normalize et
function cleanImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }
  
  let cleanedUrl = url.trim()
  
  // Geçersiz literal değerleri kontrol et
  if (cleanedUrl === '' || cleanedUrl === '{}' || cleanedUrl === 'null' || cleanedUrl === 'undefined') {
    return null
  }
  
  // BÜYÜK/KÜÇÜK HARF NORMALİZASYONU
  // Tüm dosya uzantılarını küçük harfe çevir
  cleanedUrl = cleanedUrl.replace(/\.(JPG|JPEG|PNG|GIF|WEBP)(\?|$)/gi, (match, ext, query) => {
    return '.' + ext.toLowerCase() + (query || '')
  })
  
  // AGRESIF URL DÜZELTMELERİ
  // 550x550h -> 550x550 (h harfini kaldır)
  cleanedUrl = cleanedUrl.replace(/-550x550h\./g, '-550x550.')
  cleanedUrl = cleanedUrl.replace(/550x550h\./g, '550x550.')
  
  // Double slashes düzelt (// -> /)
  cleanedUrl = cleanedUrl.replace(/([^:]\/)\/+/g, '$1')
  
  return cleanedUrl
}

// URL validasyonu - daha sıkı kontrol
function isValidImageUrl(url: string | null | undefined): boolean {
  const cleanedUrl = cleanImageUrl(url)
  
  if (!cleanedUrl) {
    return false
  }
  
  // Temel URL format kontrolü
  try {
    // Eğer / ile başlıyorsa (local path), valid kabul et
    if (cleanedUrl.startsWith('/')) {
      // Path valid
      return true
    }
    
    // Tam URL ise URL constructor ile kontrol et
    if (cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://')) {
      new URL(cleanedUrl)
      // HTTP URL valid
      return true
    }
    
    // Base64 data URL kontrolü
    if (cleanedUrl.startsWith('data:image/')) {
      return true
    }
    
    // Diğer durumlar geçersiz
    return false
  } catch (error) {
    return false
  }
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  sizes,
  priority = false,
  placeholder,
  blurDataURL,
  quality = 85,
  ...props
}: SafeImageProps) {
  // Props validated

  // URL'yi temizle ve düzelt
  const cleanedSrc = cleanImageUrl(src)
  const isValidSrc = isValidImageUrl(src)
  
  // Kesin sonuç - temizlenmiş URL veya placeholder
  const finalSrc = isValidSrc && cleanedSrc ? cleanedSrc : DEFAULT_PLACEHOLDER

  // Image source determined

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Hata durumunda placeholder'a geç
    const target = e.currentTarget
    if (target.src !== DEFAULT_PLACEHOLDER) {
      // 404 loglarını tamamen sustur - cache problemi
      target.src = DEFAULT_PLACEHOLDER
    }
  }

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Başarılı yüklenme - log susturuldu
  }

  // Tüm loglar susturuldu - cache optimizasyonu

  // Eğer finalSrc placeholder ise, doğrudan placeholder göster (Next.js Image olmadan)
  if (finalSrc === DEFAULT_PLACEHOLDER) {
    if (fill) {
      return (
        <div className={cn('bg-gray-100 flex items-center justify-center', className)}>
          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )
    }
    return (
      <div 
        className={cn('bg-gray-100 flex items-center justify-center', className)}
        style={{ width: width || 400, height: height || 400 }}
      >
        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }

  // Fill mode - parent container'ı doldurmak için
  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        loader={imageLoader}
        className={cn('object-cover', className)}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        quality={quality}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    )
  }

  // Fixed width/height mode - container'ın kendi boyutlarını kullanacak
  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width || 400}
      height={height || 400}
      loader={imageLoader}
      className={cn('max-w-full h-auto', className)}
      sizes={sizes}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      quality={quality}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  )
} 