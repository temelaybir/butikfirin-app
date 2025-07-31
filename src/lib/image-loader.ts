export default function imageLoader({ src, width, quality }: { 
  src: string; 
  width?: number; 
  quality?: number 
}) {
  // Boş veya geçersiz src kontrol
  if (!src || typeof src !== 'string') {
    return '/placeholder-product.svg'
  }
  
  // Local path - doğrudan döndür
  if (src.startsWith('/')) {
    return src
  }
  
  // Data URL - doğrudan döndür
  if (src.startsWith('data:')) {
    return src
  }
  
  // Unsplash URL'leri için özel işlem
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src)
    if (width) {
      url.searchParams.set('w', width.toString())
    }
    if (quality) {
      url.searchParams.set('q', quality.toString())
    }
    return url.toString()
  }
  
  // Diğer dış URL'ler için doğrudan döndür
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  
  // Geçersiz URL'ler için placeholder
  return '/placeholder-product.svg'
} 