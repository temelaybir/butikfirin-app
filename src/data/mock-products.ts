export interface Product {
  id: number
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  discounted_price?: number
  category_id: number
  category_name: string
  image_url: string
  images: string[]
  is_active: boolean
  is_featured: boolean
  availability: boolean
  stock_quantity?: number
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
  daily_stock?: number
  tags: string[]
  ingredients?: string
  allergens?: string
  preparation_time?: string
  calories?: number
  weight?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image_url: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

// Butik Fırın Kategorileri
export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Pasta",
    slug: "pasta",
    description: "El yapımı özel pastalarımız",
    image_url: "/images/categories/pasta.jpg",
    is_active: true,
    display_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Ekmek Çeşitleri",
    slug: "ekmek-cesitleri",
    description: "Günlük taze ekmeklerimiz",
    image_url: "/images/categories/ekmek.jpg",
    is_active: true,
    display_order: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Börekler",
    slug: "borekler",
    description: "Geleneksel böreklerimiz",
    image_url: "/images/categories/borekler.jpg",
    is_active: true,
    display_order: 3,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Zeytinyağlılar",
    slug: "zeytinyaglilar",
    description: "Hafif ve sağlıklı zeytinyağlılar",
    image_url: "/images/categories/zeytinyagli.jpg",
    is_active: true,
    display_order: 4,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Şerbetli Tatlılar",
    slug: "serbetli-tatlilar",
    description: "Geleneksel şerbetli tatlılarımız",
    image_url: "/images/categories/serbetli.jpg",
    is_active: true,
    display_order: 5,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    name: "Poğaça",
    slug: "pogaca",
    description: "Taze günlük poğaçalarımız",
    image_url: "/images/categories/pogaca.jpg",
    is_active: true,
    display_order: 6,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 7,
    name: "Adet Ürünler",
    slug: "adet-urunler",
    description: "Porsiyonluk ürünlerimiz",
    image_url: "/images/categories/adet.jpg",
    is_active: true,
    display_order: 7,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 8,
    name: "Sıcak İçecekler",
    slug: "sicak-icecekler",
    description: "Çay ve kahve çeşitlerimiz",
    image_url: "/images/categories/hot-drinks.jpg",
    is_active: true,
    display_order: 8,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 9,
    name: "Soğuk İçecekler",
    slug: "soguk-icecekler",
    description: "Serinletici içeceklerimiz",
    image_url: "/images/categories/cold-drinks.jpg",
    is_active: true,
    display_order: 9,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

// Butik Fırın Ürünleri
export const mockProducts: Product[] = [
  // TUZLU BÖREKLER
  {
    id: 1,
    name: "Ispanak Böreği",
    slug: "ispanak-boregi",
    description: "Taze ıspanak, soğan ve özel baharatlarımızla hazırlanan geleneksel böreğimiz. El açması yufkaları ile katman katman hazırlanır.",
    short_description: "Taze ıspanak ve el açması yufka ile",
    price: 45.00,
    category_id: 1,
    category_name: "Börekler",
    image_url: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=400&fit=crop",
    images: ["/images/products/ispanak-boregi-1.jpg", "/images/products/ispanak-boregi-2.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    stock_quantity: 12,
    stock_status: 'in_stock' as const,
    daily_stock: 25,
    tags: ["vejetaryen", "geleneksel", "ev yapımı"],
    ingredients: "Yufka, ıspanak, soğan, yumurta, beyaz peynir, zeytinyağı, baharat",
    allergens: "Gluten, yumurta, süt",
    preparation_time: "15 dakika",
    calories: 320,
    weight: "1 porsiyon (200g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Peynirli Börek",
    slug: "peynirli-borek",
    description: "Beyaz peynir, taze dereotu ve maydanozla hazırlanan klasik böreğimiz. Her lokmada peynirin kremalı tadı.",
    short_description: "Beyaz peynir ve yeşillikler ile",
    price: 40.00,
    category_id: 1,
    category_name: "Börekler", 
    image_url: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=400&fit=crop",
    images: ["/images/products/peynirli-borek-1.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    stock_quantity: 8,
    stock_status: 'in_stock' as const,
    daily_stock: 20,
    tags: ["vejetaryen", "klasik", "peynirli"],
    ingredients: "Yufka, beyaz peynir, dereotu, maydanoz, yumurta, süt",
    allergens: "Gluten, yumurta, süt",
    preparation_time: "12 dakika", 
    calories: 290,
    weight: "1 porsiyon (180g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Kıymalı Börek",
    slug: "kiymali-borek",
    description: "Özenle hazırlanmış dana kıyması, soğan ve özel baharatlarla tatlandırılmış böreğimiz. Et severlerin favorisi.",
    short_description: "Dana kıyması ve özel baharatlar ile",
    price: 50.00,
    category_id: 1,
    category_name: "Börekler",
    image_url: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=400&fit=crop", 
    images: ["/images/products/kiymali-borek-1.jpg", "/images/products/kiymali-borek-2.jpg"],
    is_active: true,
    is_featured: false,
    availability: true,
    stock_quantity: 5,
    stock_status: 'low_stock' as const,
    daily_stock: 15,
    tags: ["etli", "geleneksel", "lezzetli"],
    ingredients: "Yufka, dana kıyması, soğan, domates, biber, baharat",
    allergens: "Gluten",
    preparation_time: "18 dakika",
    calories: 380,
    weight: "1 porsiyon (220g)",
    created_at: "2024-01-01T00:00:00Z", 
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Patatesli Börek",
    slug: "patatesli-borek",
    description: "Haşlanmış patates, soğan ve baharatlarla hazırlanan doyurucu böreğimiz. Vegan dostlarımız için ideal.",
    short_description: "Haşlanmış patates ve soğan ile",
    price: 35.00,
    category_id: 1,
    category_name: "Börekler",
    image_url: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=400&fit=crop",
    images: ["/images/products/patatesli-borek-1.jpg"],
    is_active: true,
    is_featured: false,
    availability: true,
    stock_quantity: 15,
    stock_status: 'in_stock' as const,
    daily_stock: 30,
    tags: ["vegan", "doyurucu", "ekonomik"],
    ingredients: "Yufka, patates, soğan, zeytinyağı, baharat",
    allergens: "Gluten",
    preparation_time: "15 dakika",
    calories: 280,
    weight: "1 porsiyon (200g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },

  // TATLI BÖREKLER
  {
    id: 5,
    name: "Elmalı Börek",
    slug: "elmali-borek",
    description: "Taze elmalar, tarçın ve cevizle hazırlanan nefis tatlı böreğimiz. Sıcak servisi ile daha da lezzetli.",
    short_description: "Taze elma, tarçın ve ceviz ile",
    price: 35.00,
    category_id: 2,
    category_name: "Börekler",
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    images: ["/images/products/elmali-borek-1.jpg", "/images/products/elmali-borek-2.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    stock_quantity: 10,
    stock_status: 'in_stock' as const,
    daily_stock: 18,
    tags: ["tatlı", "meyveli", "tarçınlı"],
    ingredients: "Yufka, elma, şeker, tarçın, ceviz, tereyağı",
    allergens: "Gluten, ceviz, süt",
    preparation_time: "20 dakika",
    calories: 310,
    weight: "1 porsiyon (180g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    name: "Vişneli Börek", 
    slug: "visneli-borek",
    description: "Ekşi vişneler ve hafif şekerle hazırlanan mevsimlik özel böreğimiz. Asit-tatlı dengesi mükemmel.",
    short_description: "Ekşi vişne ve hafif şeker ile",
    price: 38.00,
    category_id: 2,
    category_name: "Börekler",
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    images: ["/images/products/visneli-borek-1.jpg"],
    is_active: true,
    is_featured: false,
    availability: false, // Sezonluk
    tags: ["tatlı", "mevsimlik", "asit-tatlı"],
    ingredients: "Yufka, vişne, şeker, nişasta, tereyağı",
    allergens: "Gluten, süt",
    preparation_time: "18 dakika",
    calories: 295,
    weight: "1 porsiyon (170g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },

  // POĞAÇA & AÇMA
  {
    id: 7,
    name: "Peynirli Poğaça",
    slug: "peynirli-pogaca",
    description: "Yumuşacık hamuru ve bol peyniri ile kahvaltının vazgeçilmez lezzeti. Günlük taze olarak hazırlanır.",
    short_description: "Yumuşak hamur ve bol peynir ile",
    price: 18.00,
    category_id: 3,
    category_name: "Poğaça",
    image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop",
    images: ["/images/products/peynirli-pogaca-1.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    tags: ["kahvaltı", "peynirli", "günlük taze"],
    ingredients: "Un, beyaz peynir, yumurta, süt, maya, tereyağı",
    allergens: "Gluten, yumurta, süt",
    preparation_time: "5 dakika",
    calories: 220,
    weight: "1 adet (80g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 8,
    name: "Zeytinli Poğaça",
    slug: "zeytinli-pogaca", 
    description: "Siyah zeytin parçaları ve kekik ile zenginleştirilen Akdeniz esintili poğaçamız.",
    short_description: "Siyah zeytin ve kekik ile",
    price: 16.00,
    category_id: 3,
    category_name: "Poğaça",
    image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop",
    images: ["/images/products/zeytinli-pogaca-1.jpg"],
    is_active: true,
    is_featured: false,
    availability: true,
    tags: ["akdeniz", "zeytinli", "baharatlı"],
    ingredients: "Un, siyah zeytin, kekik, zeytinyağı, maya, tuz",
    allergens: "Gluten",
    preparation_time: "5 dakika",
    calories: 195,
    weight: "1 adet (75g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 9,
    name: "Açma",
    slug: "acma",
    description: "Geleneksel İstanbul açması. Tereyağlı hamuru ve üzerindeki susam ile kahvaltının klasiği.",
    short_description: "Geleneksel tereyağlı açma",
    price: 12.00,
    category_id: 3,
    category_name: "Poğaça", 
    image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop",
    images: ["/images/products/acma-1.jpg", "/images/products/acma-2.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    tags: ["geleneksel", "klasik", "tereyağlı"],
    ingredients: "Un, tereyağı, süt, maya, şeker, susam",
    allergens: "Gluten, süt, susam",
    preparation_time: "3 dakika",
    calories: 180,
    weight: "1 adet (60g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },

  // SICAK İÇECEKLER
  {
    id: 10,
    name: "Türk Çayı",
    slug: "turk-cayi",
    description: "Rize'nin en kaliteli çaylarından demlenmiş geleneksel Türk çayı. İnce belli bardakta servis edilir.",
    short_description: "Geleneksel Rize çayı",
    price: 8.00,
    category_id: 4,
    category_name: "Sıcak İçecekler",
    image_url: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop",
    images: ["/images/products/turk-cayi-1.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    tags: ["geleneksel", "rize çayı", "sıcak"],
    ingredients: "Rize çayı",
    allergens: "-",
    preparation_time: "3 dakika",
    calories: 5,
    weight: "1 bardak (200ml)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 11,
    name: "Türk Kahvesi",
    slug: "turk-kahvesi",
    description: "Özenle kavrulmuş çekirdeklerden hazırlanan UNESCO mirası Türk kahvesi. Lokum ve su ile servis edilir.",
    short_description: "UNESCO mirası geleneksel kahve",
    price: 25.00,
    category_id: 4,
    category_name: "Sıcak İçecekler",
    image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop",
    images: ["/images/products/turk-kahvesi-1.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    tags: ["geleneksel", "unesco", "özel"],
    ingredients: "Türk kahvesi, şeker (isteğe bağlı)",
    allergens: "-",
    preparation_time: "8 dakika",
    calories: 35,
    weight: "1 fincan (75ml)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 12,
    name: "Cappuccino",
    slug: "cappuccino",
    description: "Premium espresso ve buharda köpürtülmüş süt ile hazırlanan İtalyan klasiği. Üzerinde kakao tozu.",
    short_description: "Premium espresso ve köpüklü süt",
    price: 22.00,
    category_id: 4,
    category_name: "Sıcak İçecekler",
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    images: ["/images/products/cappuccino-1.jpg"],
    is_active: true,
    is_featured: false,
    availability: true,
    tags: ["espresso", "modern", "süütlü"],
    ingredients: "Espresso, süt, kakao tozu",
    allergens: "Süt",
    preparation_time: "5 dakika",
    calories: 120,
    weight: "1 bardak (180ml)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },

  // SOĞUK İÇECEKLER
  {
    id: 13,
    name: "Ayran",
    slug: "ayran",
    description: "Ev yapımı yoğurttan hazırlanan geleneksel ayran. Börek ve poğaçalarımızın mükemmel tamamlayıcısı.",
    short_description: "Ev yapımı geleneksel ayran",
    price: 10.00,
    category_id: 5,
    category_name: "Soğuk İçecekler",
    image_url: "https://images.unsplash.com/photo-1608086413927-5e5d5a5f1360?w=400&h=400&fit=crop",
    images: ["/images/products/ayran-1.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    tags: ["geleneksel", "ev yapımı", "ferahlatıcı"],
    ingredients: "Yoğurt, su, tuz",
    allergens: "Süt",
    preparation_time: "2 dakika",
    calories: 60,
    weight: "1 bardak (200ml)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 14,
    name: "Taze Sıkılmış Portakal Suyu",
    slug: "taze-portakal-suyu",
    description: "Günlük taze sıkılan Antalya portakallarından vitamin dolu doğal meyve suyu.",
    short_description: "Günlük taze sıkma portakal",
    price: 18.00,
    category_id: 5,
    category_name: "Soğuk İçecekler",
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    images: ["/images/products/portakal-suyu-1.jpg"],
    is_active: true,
    is_featured: false,
    availability: true,
    tags: ["taze", "doğal", "vitaminli"],
    ingredients: "%100 taze portakal",
    allergens: "-",
    preparation_time: "3 dakika", 
    calories: 110,
    weight: "1 bardak (250ml)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 15,
    name: "Limonata",
    slug: "limonata",
    description: "Taze sıkılmış limon, nane yaprakları ve sekerle hazırlanan serinletici içecek.",
    short_description: "Taze limon ve nane ile",
    price: 15.00,
    category_id: 5,
    category_name: "Soğuk İçecekler",
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    images: ["/images/products/limonata-1.jpg"],
    is_active: true,
    is_featured: false,
    availability: true,
    tags: ["serinletici", "naneli", "doğal"],
    ingredients: "Limon, nane, şeker, su, buz",
    allergens: "-",
    preparation_time: "4 dakika",
    calories: 95,
    weight: "1 bardak (300ml)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },

  // TATLILAR
  {
    id: 16,
    name: "Baklava (1 Dilim)",
    slug: "baklava",
    description: "40 kat yufka arasına serpiştirilmiş ceviz ve fıstık ile şerbetli geleneksel baklava. Günlük taze.",
    short_description: "40 kat yufka, ceviz ve fıstık",
    price: 30.00,
    discounted_price: 25.00,
    category_id: 6,
    category_name: "Şerbetli Tatlılar",
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    images: ["/images/products/baklava-1.jpg", "/images/products/baklava-2.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    tags: ["geleneksel", "şerbetli", "özel"],
    ingredients: "Yufka, ceviz, fıstık, şeker, su, limon",
    allergens: "Gluten, ceviz, fıstık",
    preparation_time: "5 dakika",
    calories: 420,
    weight: "1 dilim (80g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 17,
    name: "Künefe",
    slug: "kunefe",
    description: "İnce kadayıf arasında özel peyniri ve üzerinde şerbet ile sıcak servis edilen Hatay'ın meşhur tatlısı.",
    short_description: "Kadayıf, özel peynir ve şerbet",
    price: 45.00,
    category_id: 6, 
    category_name: "Şerbetli Tatlılar",
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    images: ["/images/products/kunefe-1.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    tags: ["sıcak", "peynirli", "hatay"],
    ingredients: "Kadayıf, özel künefe peyniri, şeker, su",
    allergens: "Gluten, süt",
    preparation_time: "12 dakika",
    calories: 380,
    weight: "1 porsiyon (150g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 18,
    name: "Sütlaç",
    slug: "sutlac",
    description: "Pirinç unundan hazırlanan geleneksel sütlaç. Üzeri fırında karamelize edilmiş, soğuk servis.",
    short_description: "Geleneksel fırın sütlacı",
    price: 20.00,
    category_id: 6,
    category_name: "Şerbetli Tatlılar",
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    images: ["/images/products/sutlac-1.jpg"],
    is_active: true,
    is_featured: false,
    availability: true,
    tags: ["sütlü", "soğuk", "geleneksel"],
    ingredients: "Süt, pirinç unu, şeker, vanilya",
    allergens: "Süt",
    preparation_time: "3 dakika",
    calories: 180,
    weight: "1 kase (120g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },

  // PASTA
  {
    id: 19,
    name: "Çikolatalı Pasta",
    slug: "cikolatali-pasta",
    description: "Belçika çikolatası ile hazırlanan özel pastamız. Katmanları arasında çikolatalı krema bulunur.",
    short_description: "Belçika çikolatalı özel pasta",
    price: 280.00,
    category_id: 7,
    category_name: "Pasta",
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    images: ["/images/products/cikolatali-pasta-1.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    stock_quantity: 3,
    stock_status: 'low_stock' as const,
    daily_stock: 5,
    tags: ["pasta", "çikolata", "özel gün"],
    ingredients: "Un, yumurta, şeker, Belçika çikolatası, krema, süt",
    allergens: "Gluten, yumurta, süt",
    preparation_time: "Sipariş üzerine",
    calories: 450,
    weight: "1 dilim (150g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 20,
    name: "Meyveli Pasta",
    slug: "meyveli-pasta",
    description: "Taze mevsim meyveleri ile süslenen hafif kremalı pastamız.",
    short_description: "Taze meyveler ve hafif krema",
    price: 250.00,
    category_id: 7,
    category_name: "Pasta",
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    images: ["/images/products/meyveli-pasta-1.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    stock_quantity: 2,
    stock_status: 'low_stock' as const,
    daily_stock: 4,
    tags: ["pasta", "meyveli", "hafif"],
    ingredients: "Pandispanya, krema, çilek, muz, kivi, portakal",
    allergens: "Gluten, yumurta, süt",
    preparation_time: "Sipariş üzerine",
    calories: 320,
    weight: "1 dilim (140g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },

  // EKMEK ÇEŞİTLERİ
  {
    id: 21,
    name: "Tam Buğday Ekmek",
    slug: "tam-bugday-ekmek",
    description: "Sağlıklı tam buğday unu ile hazırlanan günlük taze ekmeğimiz.",
    short_description: "Tam buğday unu ile günlük taze",
    price: 15.00,
    category_id: 8,
    category_name: "Ekmek Çeşitleri",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    images: ["/images/products/tam-bugday-ekmek-1.jpg"],
    is_active: true,
    is_featured: true,
    availability: true,
    stock_quantity: 20,
    stock_status: 'in_stock' as const,
    daily_stock: 50,
    tags: ["ekmek", "tam buğday", "sağlıklı"],
    ingredients: "Tam buğday unu, su, tuz, maya",
    allergens: "Gluten",
    preparation_time: "Hazır",
    calories: 240,
    weight: "1 somun (350g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 22,
    name: "Beyaz Ekmek",
    slug: "beyaz-ekmek",
    description: "Geleneksel taş fırında pişirilen günlük beyaz ekmeğimiz.",
    short_description: "Taş fırında günlük taze",
    price: 12.00,
    category_id: 8,
    category_name: "Ekmek Çeşitleri",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    images: ["/images/products/beyaz-ekmek-1.jpg"],
    is_active: true,
    is_featured: false,
    availability: true,
    stock_quantity: 30,
    stock_status: 'in_stock' as const,
    daily_stock: 100,
    tags: ["ekmek", "beyaz", "günlük"],
    ingredients: "Un, su, tuz, maya",
    allergens: "Gluten",
    preparation_time: "Hazır",
    calories: 260,
    weight: "1 somun (350g)",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

// Helper fonksiyonlar
export const getProductById = (id: number): Product | undefined => {
  return mockProducts.find(product => product.id === id)
}

export const getProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find(product => product.slug === slug)
}

export const getProductsByCategory = (categoryId: number): Product[] => {
  return mockProducts.filter(product => product.category_id === categoryId && product.is_active)
}

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.is_featured && product.is_active)
}

export const getAvailableProducts = (): Product[] => {
  return mockProducts.filter(product => product.availability && product.is_active)
}

export const getCategoryById = (id: number): Category | undefined => {
  return mockCategories.find(category => category.id === id)
}

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return mockCategories.find(category => category.slug === slug)
}

export const getActiveCategories = (): Category[] => {
  return mockCategories.filter(category => category.is_active).sort((a, b) => a.display_order - b.display_order)
}