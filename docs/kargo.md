# Kargo Entegrasyonu

## Genel Bakış

Bu projede kargo takibi sistemi Aras Kargo API'si ile entegre edilmek üzere hazırlanmıştır. Sistem hem mock hem de gerçek API'yi destekleyecek şekilde yapılandırılmıştır.

## Yapı

### 1. Type Tanımlamaları (`/src/types/cargo.ts`)

- **CargoCompany**: Desteklenen kargo firmaları (Aras, Yurtiçi, MNG, UPS, PTT)
- **CargoStatus**: Kargo durumları
  - `CREATED`: Kargo oluşturuldu
  - `PICKED_UP`: Kargoya verildi
  - `IN_TRANSIT`: Transfer halinde
  - `IN_DISTRIBUTION`: Dağıtımda
  - `DELIVERED`: Teslim edildi
  - `NOT_DELIVERED`: Teslim edilemedi
  - `RETURNED`: İade edildi
- **CargoMovement**: Kargo hareketi bilgileri
- **CargoInfo**: Ana kargo bilgi objesi
- **ArasCargoTrackingResponse**: Aras Kargo API response tipi
- **CreateShipmentData**: Kargo oluşturma için gerekli veriler

### 2. Service Katmanı

#### Mock Service (`/src/services/cargo/mock-cargo-service.ts`)
- Development ve test ortamları için kullanılır
- Gerçek API davranışını simüle eder
- Demo verilerle çalışır

#### Aras Kargo Service (`/src/services/cargo/aras-cargo-service.ts`)
- Gerçek Aras Kargo API entegrasyonu
- API çağrıları ve response dönüşümleri
- Error handling

#### Factory Function
```typescript
createCargoService(): CargoTrackingService
```
Environment variable'a göre mock veya gerçek service döndürür.

### 3. Environment Variables

```env
# Kargo API Ayarları
NEXT_PUBLIC_USE_REAL_CARGO_API=false # true olarak ayarlayınca gerçek API kullanılır

# Aras Kargo API Credentials
ARAS_CARGO_API_URL=https://api.araskargo.com.tr/v2
ARAS_CARGO_USERNAME=your_username
ARAS_CARGO_PASSWORD=your_password
ARAS_CARGO_CUSTOMER_CODE=your_customer_code
```

## Kullanım

### 1. Kargo Takibi Sorgulama

```typescript
const cargoService = createCargoService()
const cargoInfo = await cargoService.getTrackingInfo('ARAS123456789')
```

### 2. Kargo Oluşturma

```typescript
const cargoService = createCargoService()
const trackingNumber = await cargoService.createShipment({
  orderNumber: 'SIP-2024-10001',
  recipientName: 'Ahmet Yılmaz',
  recipientPhone: '0555 123 45 67',
  recipientAddress: 'Atatürk Mah. Cumhuriyet Cad. No: 123',
  recipientCity: 'İstanbul',
  recipientDistrict: 'Kadıköy',
  recipientPostalCode: '34000',
  senderName: 'RDHN Commerce',
  senderPhone: '0212 123 45 67',
  senderAddress: 'Merkez Mah. Ticaret Cad. No: 1',
  weight: 1.5,
  desi: 3,
  paymentType: 'sender',
  productPrice: 45000,
  description: 'Elektronik ürün'
})
```

### 3. Kargo İptali

```typescript
const cargoService = createCargoService()
const success = await cargoService.cancelShipment('ARAS123456789')
```

## Entegrasyon Noktaları

### 1. Sipariş Takibi Sayfası (`/app/siparis-takibi/[orderNumber]/page.tsx`)
- Order'dan tracking number alınır
- Kargo service'inden güncel durum çekilir
- 30 saniyede bir otomatik güncelleme
- Kargo hareketleri timeline'ı gösterilir

### 2. Sipariş Oluşturma
- Sipariş onaylandıktan sonra `createShipment` çağrılacak
- Dönen tracking number order'a kaydedilecek

### 3. User Context
- Order type'ına `trackingNumber` field'ı eklendi
- Mock order'lara örnek tracking number'lar eklendi

## Yapılacaklar

### Kısa Vadeli
- [ ] Sipariş onay akışına kargo oluşturma entegrasyonu
- [ ] Admin panelinde kargo yönetimi
- [ ] Kargo durumu webhook entegrasyonu
- [ ] SMS/Email bildirimleri

### Orta Vadeli  
- [ ] Diğer kargo firmalarının entegrasyonu
- [ ] Çoklu kargo desteği (tek siparişte birden fazla kargo)
- [ ] Kargo etiket yazdırma
- [ ] İade kargo süreçleri

### Uzun Vadeli
- [ ] Kargo maliyet hesaplama
- [ ] Otomatik kargo firması seçimi
- [ ] Kargo performans raporları
- [ ] Müşteri kargo tercihleri

## Notlar

1. **Güvenlik**: API credentials'ları kesinlikle client-side'da expose edilmemeli. Server-side API route'ları kullanılmalı.

2. **Rate Limiting**: Aras Kargo API'sinin rate limit'lerine dikkat edilmeli. Gerekirse caching uygulanmalı.

3. **Error Handling**: API çağrıları fail olabilir. Kullanıcıya anlamlı hata mesajları gösterilmeli.

4. **Test**: Hem unit test hem de integration test yazılmalı. Mock service test için kullanışlı.

5. **Monitoring**: Production'da API çağrıları ve hatalar loglanmalı. 