# Modal Titreme Sorunu Analizi

## Sorun Tanımı
Ürün detay modal'ı açılıp kapatılırken sayfa titriyor ve milisaniyede sayfa yenileniyor gibi bir etki oluşuyor. Bu sorun özellikle mobil Safari'de (iPhone 16 Plus) görülüyor.

## Sorunlu Kod Parçası

### 1. Modal Body Scroll Lock - Problemli Yaklaşım
```javascript
// Modal body scroll lock - iOS Safari optimized
useEffect(() => {
  if (selectedProduct) {
    // Store current scroll position
    const scrollY = window.scrollY
    
    // Apply styles to prevent scroll
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    
    // Store scroll position for restoration
    document.body.setAttribute('data-scroll-y', scrollY.toString())
  } else {
    // Restore scroll position
    const scrollY = document.body.getAttribute('data-scroll-y')
    
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY))
      document.body.removeAttribute('data-scroll-y')
    }
  }
}, [selectedProduct])
```

### 2. Framer Motion Animasyon - Aşırı Optimizasyon
```javascript
<motion.div
  initial={{ scale: 0.96, opacity: 0, y: 20 }}
  animate={{ scale: 1, opacity: 1, y: 0 }}
  exit={{ scale: 0.96, opacity: 0, y: 20 }}
  transition={{ duration: 0.2, ease: "easeInOut" }}
  style={{ 
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform3d: 'translateZ(0)'
  }}
>
```

## Sorunun Kökleri

### 1. iOS Safari Viewport Davranışı
- **Safari'nin dinamik viewport'u**: iOS Safari'de adres çubuğu gizlenip gösterildiğinde viewport boyutu değişir
- **Layout thrashing**: `position: fixed` ile scroll pozisyonu manipülasyonu layout hesaplamalarını tetikler
- **Repaint/reflow**: Body stillerini sürekli değiştirmek browser'ın render döngüsünü bozar

### 2. DOM Manipülasyon Timing'i
```javascript
// Bu sıralama sorun yaratır:
1. Modal açılır → Body fixed position'a geçer
2. Scroll position kaydedilir
3. Modal kapanır → Body normal position'a döner  
4. Scroll position restore edilir ← BU AŞAMADA TİTREME
5. DOM re-render olur
```

### 3. Framer Motion ile CSS Çakışması
- **Hardware acceleration çakışması**: `willChange`, `backfaceVisibility` ve `transform3d` aynı anda kullanılması
- **Composite layer sorunları**: Browser'ın composite layer'ı yanlış yönetmesi
- **Animation timing**: CSS transition'lar ile Framer Motion timing'inin uyumsuzluğu

### 4. Event Loop ve RAF (RequestAnimationFrame) Sorunları
```javascript
// Sorunlu sıralama:
setSelectedProduct(null) → useEffect tetiklenir → DOM style değişir → 
Framer Motion exit animasyonu başlar → Browser repaint → TİTREME
```

## Çözüm Stratejileri

### 1. Minimal Yaklaşım (Mevcut)
```javascript
useEffect(() => {
  if (selectedProduct) {
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'relative'
  } else {
    document.body.style.overflow = ''
    document.body.style.position = ''
  }
}, [selectedProduct])
```

### 2. Alternativ Çözüm - No Body Lock
```javascript
// Body'yi hiç değiştirmeden modal scroll'unu engellemek
<motion.div 
  className="fixed inset-0"
  style={{ touchAction: 'none', overscrollBehavior: 'none' }}
>
```

### 3. CSS-Only Çözüm
```css
.modal-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
}
```

## Teknik Detaylar

### iOS Safari Özellikleri
- **Dynamic viewport**: Adres çubuğu gizlenince viewport değişir
- **Bounce scroll**: Elastic scrolling davranışı
- **Touch handling**: `touchstart`, `touchmove` olaylarının farklı işlenmesi
- **Memory management**: Aggressive composite layer cleanup

### Layout Thrashing Sebepleri
1. **Style recalculation**: Body style değişiklikleri tüm DOM'u etkiler
2. **Layout shift**: Fixed position geçişi layout'u yeniden hesaplar
3. **Paint invalidation**: Transform değişiklikleri repaint tetikler
4. **Composite layer creation**: Hardware acceleration layer'ları değişir

## Sonuç
Modal titreme sorunu, iOS Safari'nin viewport davranışı, DOM manipülasyon timing'i ve CSS animation çakışmalarının bir kombinasyonudur. En stabil çözüm minimal DOM manipülasyonu ve basit animasyonlardır.