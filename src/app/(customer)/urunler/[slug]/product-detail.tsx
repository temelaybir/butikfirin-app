'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SafeImage } from '@/components/ui/safe-image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  ShieldCheck, 
  RefreshCcw,
  Star,
  Plus,
  Minus,
  ChevronRight,
  Check
} from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import { useCurrency } from '@/context/currency-context'
import { toast } from 'sonner'
import { getProductById } from '@/data/mock-products'
import sanitizeHtmlLib from 'sanitize-html'

interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_price: number | null
  stock_quantity: number
  sku: string | null
  barcode: string | null
  images: string[]
  tags: string[]
  is_active: boolean
  is_featured: boolean
  category: {
    id: number
    name: string
    slug: string
  } | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
}

interface ProductDetailProps {
  product: Product
}

// HTML içeriğini güvenli hale getiren fonksiyon
function sanitizeHtml(html: string): string {
  if (!html) return ''
  
  // Zararlı script taglarını kaldır
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Zararlı event handlerları kaldır
  cleaned = cleaned.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
  
  // iframe, object, embed taglarını kaldır
  cleaned = cleaned.replace(/<(iframe|object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
  
  // Sadece güvenli HTML taglarına izin ver
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'a', 'img']
  
  // Link taglarını güvenli hale getir
  cleaned = cleaned.replace(/<a\b[^>]*>/gi, (match) => {
    // Sadece href attribute'unu bırak, target="_blank" ve rel="noopener noreferrer" ekle
    const hrefMatch = match.match(/href\s*=\s*["']([^"']*)["']/i)
    if (hrefMatch) {
      const href = hrefMatch[1]
      // Sadece güvenli URL'lere izin ver
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/') || href.startsWith('#')) {
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">`
      }
    }
    return '<a>'
  })
  
  // Img taglarını güvenli hale getir
  cleaned = cleaned.replace(/<img\b[^>]*>/gi, (match) => {
    const srcMatch = match.match(/src\s*=\s*["']([^"']*)["']/i)
    const altMatch = match.match(/alt\s*=\s*["']([^"']*)["']/i)
    if (srcMatch) {
      const src = srcMatch[1]
      const alt = altMatch ? altMatch[1] : ''
      return `<img src="${src}" alt="${alt}" class="max-w-full h-auto rounded-md" loading="lazy" />`
    }
    return ''
  })
  
  return cleaned
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { formatPrice } = useCurrency()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const discountPercentage = product.compare_price 
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : 0

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&q=80']

  // HTML açıklamalarını sanitize et
  const sanitizedDescription = sanitizeHtmlLib(product.description || '')
  const sanitizedShortDescription = sanitizeHtmlLib(product.short_description || '')

  const handleAddToCart = () => {
    // Get the full product from mock data
    const fullProduct = getProductById(product.id);
    
    if (!fullProduct) {
      toast.error('Ürün bulunamadı');
      return;
    }
    
    addToCart(fullProduct, quantity);
    setIsAddedToCart(true);
    // Toast message is handled by cart context
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase' && quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleWishlist = () => {
    // Get the full product from mock data
    const fullProduct = getProductById(product.id);
    
    if (!fullProduct) {
      toast.error('Ürün bulunamadı');
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      // Wishlist context zaten toast mesajı gönderiyor
    } else {
      addToWishlist(fullProduct);
      // Wishlist context zaten toast mesajı gönderiyor
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-sm:py-4 max-sm:px-3">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 max-sm:text-xs max-sm:mb-3 max-sm:overflow-x-auto max-sm:scrollbar-none max-sm:pb-1">
        <div className="flex items-center gap-2 max-sm:whitespace-nowrap max-sm:min-w-max">
          <Link 
            href="/" 
            className="hover:text-primary max-sm:text-xs whitespace-nowrap touch-manipulation"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4 max-sm:h-3 max-sm:w-3 flex-shrink-0" />
          <Link 
            href="/urunler" 
            className="hover:text-primary max-sm:text-xs whitespace-nowrap touch-manipulation"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            Ürünler
          </Link>
          <ChevronRight className="h-4 w-4 max-sm:h-3 max-sm:w-3 flex-shrink-0" />
          {product.category && (
            <>
              <Link 
                href={`/kategoriler/${product.category.slug}`} 
                className="hover:text-primary max-sm:text-xs whitespace-nowrap max-sm:hidden touch-manipulation"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                {product.category.name}
              </Link>
              <ChevronRight className="h-4 w-4 max-sm:h-3 max-sm:w-3 flex-shrink-0 max-sm:hidden" />
            </>
          )}
          <span className="text-foreground max-sm:text-xs whitespace-nowrap max-sm:max-w-[120px] max-sm:truncate" title={product.name}>
            {product.name}
          </span>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-sm:gap-3 max-sm:grid-cols-1">
        {/* Sol Taraf - Resim Galerisi */}
        <div className="space-y-4 max-sm:space-y-2">
          {/* Ana Resim */}
          <div className="relative">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden max-sm:aspect-[4/3] max-sm:h-[200px] max-sm:w-full">
              <SafeImage
                src={images[selectedImage] || images[0]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            {product.is_featured && (
              <Badge className="absolute top-4 left-4 max-sm:top-2 max-sm:left-2 max-sm:text-[10px] max-sm:px-1 max-sm:py-0" variant="secondary">
                Öne Çıkan
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 right-4 max-sm:top-2 max-sm:right-2 max-sm:text-[10px] max-sm:px-1 max-sm:py-0" variant="destructive">
                %{discountPercentage} İndirim
              </Badge>
            )}
          </div>

          {/* Küçük Resimler - Mobilde gizle */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 max-sm:hidden">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-muted rounded-md overflow-hidden transition-all ${
                    selectedImage === index 
                      ? 'ring-2 ring-primary' 
                      : 'hover:ring-2 hover:ring-primary/50'
                  }`}
                >
                  <SafeImage
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Taraf - Ürün Bilgileri */}
        <div className="space-y-6 max-sm:space-y-3">
          {/* Başlık */}
          <div>
            <h1 className="text-3xl font-bold max-sm:text-lg max-sm:leading-tight max-sm:font-semibold">{product.name}</h1>
            {product.sku && (
              <p className="text-sm text-muted-foreground mt-1 max-sm:text-xs max-sm:mt-0">SKU: {product.sku}</p>
            )}
          </div>

          {/* Fiyat */}
          <div className="space-y-1 max-sm:space-y-0">
            <div className="flex items-baseline gap-3 max-sm:gap-2">
              <span className="text-3xl font-bold max-sm:text-xl">{formatPrice(product.price)}</span>
              {product.compare_price && product.compare_price > product.price ? (
                <span className="text-xl text-muted-foreground line-through max-sm:text-sm">
                  {formatPrice(product.compare_price)}
                </span>
              ) : null}
            </div>
            <p className="text-sm text-green-600 max-sm:text-xs">KDV Dahil</p>
          </div>

          {/* Kısa açıklama - sadece mobilde göster */}
          {(sanitizedShortDescription || sanitizedDescription) && (
            <div className="hidden max-sm:block max-sm:bg-gray-50 max-sm:p-3 max-sm:rounded-lg max-sm:border">
              <h3 className="font-medium mb-2 text-sm">Ürün Açıklaması</h3>
              <div 
                className="text-muted-foreground text-sm line-clamp-3 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: sanitizedShortDescription || sanitizedDescription 
                }}
              />
            </div>
          )}

          <Separator className="max-sm:hidden" />

          {/* Açıklama - Sadece desktop */}
          {(sanitizedDescription || sanitizedShortDescription) && (
            <div className="max-sm:hidden">
              <h3 className="font-semibold mb-2">Ürün Açıklaması</h3>
              <div 
                className="text-muted-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: sanitizedShortDescription || sanitizedDescription 
                }}
              />
            </div>
          )}

          {/* Etiketler - Sadece desktop */}
          {product.tags && product.tags.length > 0 && (
            <div className="max-sm:hidden">
              <h3 className="font-semibold mb-2">Etiketler</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Miktar ve Sepete Ekle */}
          <div className="space-y-4 max-sm:space-y-3 max-sm:bg-white max-sm:p-3 max-sm:rounded-lg max-sm:border max-sm:mt-2">
            <div className="flex items-center gap-4 max-sm:gap-2 max-sm:justify-between">
              <span className="text-sm font-medium max-sm:text-xs">Miktar:</span>
              <div className="flex items-center border rounded-md max-sm:border max-sm:rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="max-sm:h-7 max-sm:w-7"
                >
                  <Minus className="h-4 w-4 max-sm:h-3 max-sm:w-3" />
                </Button>
                <span className="w-12 text-center max-sm:w-8 max-sm:text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= product.stock_quantity}
                  className="max-sm:h-7 max-sm:w-7"
                >
                  <Plus className="h-4 w-4 max-sm:h-3 max-sm:w-3" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground max-sm:text-xs">
                Stok: {product.stock_quantity}
              </span>
            </div>

            <div className="flex gap-3 max-sm:flex-col max-sm:gap-2">
              <Button 
                size="lg" 
                className="flex-1 max-sm:w-full max-sm:h-12 max-sm:py-3 max-sm:text-base max-sm:font-semibold max-sm:rounded-xl max-sm:shadow-md max-sm:bg-orange-500 max-sm:hover:bg-orange-600 max-sm:transition-all max-sm:duration-200"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                {isAddedToCart ? (
                  <>
                    <Check className="mr-2 h-5 w-5 max-sm:h-4 max-sm:w-4" />
                    Sepete Eklendi
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5 max-sm:h-4 max-sm:w-4" />
                    Sepete Ekle
                  </>
                )}
              </Button>
              <div className="flex gap-2 max-sm:grid max-sm:grid-cols-2 max-sm:gap-2">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWishlist}
                  className="max-sm:flex-1 max-sm:h-10 max-sm:text-sm max-sm:rounded-lg"
                >
                  <Heart className={`h-5 w-5 max-sm:h-4 max-sm:w-4 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
                  <span className="hidden max-sm:inline max-sm:ml-1">Favorile</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: product.short_description || product.description || '',
                        url: window.location.href
                      })
                    }
                  }}
                  className="max-sm:flex-1 max-sm:h-10 max-sm:text-sm max-sm:rounded-lg"
                >
                  <Share2 className="h-5 w-5 max-sm:h-4 max-sm:w-4" />
                  <span className="hidden max-sm:inline max-sm:ml-1">Paylaş</span>
                </Button>
              </div>
            </div>

            {product.stock_quantity === 0 && (
              <p className="text-destructive font-medium max-sm:text-sm max-sm:text-center">Bu ürün şu anda stokta bulunmamaktadır.</p>
            )}
          </div>
        </div>
      </div>

      {/* Kargo Bilgileri - Mobilde küçült */}
      <div className="grid grid-cols-3 gap-4 mt-8 p-4 bg-muted/30 rounded-lg max-sm:mt-4 max-sm:p-2 max-sm:gap-2">
        <div className="flex flex-col items-center text-center gap-2 max-sm:gap-1">
          <Truck className="h-6 w-6 text-primary max-sm:h-4 max-sm:w-4" />
          <div>
            <p className="text-xs font-medium max-sm:text-[9px]">Ücretsiz Kargo</p>
            <p className="text-xs text-muted-foreground max-sm:text-[8px]">2-3 gün</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-2 max-sm:gap-1">
          <ShieldCheck className="h-6 w-6 text-primary max-sm:h-4 max-sm:w-4" />
          <div>
            <p className="text-xs font-medium max-sm:text-[9px]">Güvenli Ödeme</p>
            <p className="text-xs text-muted-foreground max-sm:text-[8px]">256 Bit SSL</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-2 max-sm:gap-1">
          <RefreshCcw className="h-6 w-6 text-primary max-sm:h-4 max-sm:w-4" />
          <div>
            <p className="text-xs font-medium max-sm:text-[9px]">Kolay İade</p>
            <p className="text-xs text-muted-foreground max-sm:text-[8px]">14 Gün</p>
          </div>
        </div>
      </div>

      {/* Detaylı açıklama - sadece desktop'ta göster */}
      {(sanitizedDescription || sanitizedShortDescription) && (
        <div className="mt-8 max-sm:hidden">
          <h3 className="font-semibold mb-4 text-xl">Ürün Açıklaması</h3>
          <div className="prose prose-sm max-w-none">
            <div 
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: sanitizedShortDescription || sanitizedDescription 
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
} 