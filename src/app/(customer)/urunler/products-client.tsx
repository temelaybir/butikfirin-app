'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SafeImage } from '@/components/ui/safe-image'
import { Filter, Search, SortAsc, ChefHat, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { Product, Category } from '@/data/mock-products'
import { getProductById } from '@/data/mock-products'
import { useCart } from '@/context/cart-context'
import { toast } from 'sonner'

interface ProductsClientProps {
  initialProducts: Product[]
  categories: Category[]
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const { addToCart } = useCart()

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = initialProducts.filter(product => product.is_active)

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id.toString() === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.discounted_price || a.price) - (b.discounted_price || b.price))
        break
      case 'price-desc':
        filtered.sort((a, b) => (b.discounted_price || b.price) - (a.discounted_price || a.price))
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1
          if (!a.is_featured && b.is_featured) return 1
          return 0
        })
        break
    }

    return filtered
  }, [initialProducts, selectedCategory, sortBy, searchQuery])

  const handleAddToCart = (product: Product) => {
    // Get the full product from mock data
    const fullProduct = getProductById(product.id);
    
    if (!fullProduct) {
      toast.error('Ürün bulunamadı');
      return;
    }
    
    addToCart(fullProduct);
    toast.success(`${product.name} sepete eklendi`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  const getStockIndicator = (product: Product) => {
    if (!product.availability || product.stock_status === 'out_of_stock') {
      return {
        icon: XCircle,
        text: 'Tükendi',
        color: 'bg-red-500 text-white',
        textColor: 'text-red-600'
      }
    }
    
    if (product.stock_status === 'low_stock') {
      return {
        icon: AlertTriangle,
        text: `Son ${product.stock_quantity} adet`,
        color: 'bg-orange-500 text-white',
        textColor: 'text-orange-600'
      }
    }
    
    return {
      icon: CheckCircle,
      text: `${product.stock_quantity} adet var`,
      color: 'bg-green-500 text-white',
      textColor: 'text-green-600'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Butik Fırın Menüsü</h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Taze ve ev yapımı lezzetlerimizi keşfedin. Her gün özenle hazırlanan ürünlerimiz sizleri bekliyor.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sırala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Öne Çıkanlar</SelectItem>
                <SelectItem value="price-asc">Fiyat (Düşük-Yüksek)</SelectItem>
                <SelectItem value="price-desc">Fiyat (Yüksek-Düşük)</SelectItem>
                <SelectItem value="name">İsim (A-Z)</SelectItem>
                <SelectItem value="newest">En Yeni</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredAndSortedProducts.length} ürün bulundu
          </p>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => {
              const stockInfo = getStockIndicator(product)
              const StockIcon = stockInfo.icon
              
              return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <SafeImage
                    src={product.image_url}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Stock Status Badge */}
                  <Badge className={`absolute top-2 right-2 ${stockInfo.color} flex items-center gap-1`}>
                    <StockIcon className="w-3 h-3" />
                    {stockInfo.text}
                  </Badge>
                  
                  {product.discounted_price && (
                    <Badge className="absolute top-2 left-2 bg-orange-500">
                      İndirimde
                    </Badge>
                  )}
                  {product.is_featured && (
                    <Badge className="absolute bottom-2 left-2 bg-yellow-500">
                      <ChefHat className="w-3 h-3 mr-1" />
                      Özel
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category_name}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.short_description}
                  </p>
                  
                  {/* Product Tags */}
                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Stock Information */}
                  <div className="flex items-center gap-2 mb-3">
                    <StockIcon className={`w-4 h-4 ${stockInfo.textColor}`} />
                    <span className={`text-sm font-medium ${stockInfo.textColor}`}>
                      {stockInfo.text}
                    </span>
                    {product.daily_stock && product.stock_status === 'in_stock' && (
                      <Badge variant="outline" className="text-xs">
                        Günlük: {product.daily_stock}
                      </Badge>
                    )}
                  </div>

                  {/* Price and Actions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {product.discounted_price ? (
                        <>
                          <span className="text-xl font-bold text-orange-600">
                            {formatPrice(product.discounted_price)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-orange-600">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/urunler/${product.slug}`}>
                          Detay
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.availability || product.stock_status === 'out_of_stock'}
                      >
                        {product.availability && product.stock_status !== 'out_of_stock' ? 'Sepete Ekle' : 'Mevcut Değil'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ürün bulunamadı</h3>
            <p className="text-muted-foreground mb-6">
              Aradığınız kriterlere uygun ürün bulunmuyor. Lütfen filtreleri değiştirin.
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSortBy('featured')
            }}>
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}