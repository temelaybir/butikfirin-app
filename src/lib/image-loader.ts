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
  
  // Sadece yerel dosyaları kabul et, dış URL'leri placeholder'a çevir
  return '/placeholder-product.svg'
} 