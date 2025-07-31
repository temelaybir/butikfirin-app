# 🍰 Butik Fırın MCP Server

**Butik Fırın E-Ticaret projesine özel Model Context Protocol (MCP) server implementasyonu**

## 🎯 Özellikler

Bu MCP server, pastane/fırın e-ticaret sitesi için özel olarak tasarlanmış business logic ve database işlemleri sunar:

### 📊 Database İşlemleri
- ✅ SQLite veritabanı yönetimi
- ✅ Kategori ve ürün CRUD işlemleri
- ✅ Sipariş takibi
- ✅ Site ayarları yönetimi

### 🧠 Business Logic
- ✅ Pastane kategorileri (8 adet)
- ✅ Akıllı fiyatlandırma önerileri
- ✅ Ürün açıklaması oluşturma
- ✅ Kar marjı hesaplamaları

### 🔧 Yardımcı Araçlar
- ✅ Database backup
- ✅ Görsel optimizasyonu
- ✅ Inventory takibi
- ✅ Analytics ve raporlama

## 🚀 Kurulum

### Gereksinimler
- Python 3.8+
- SQLite3

### Adımlar

1. **MCP server klasörüne gidin:**
```bash
cd mcp-server
```

2. **Python dependencies yükleyin:**
```bash
pip install sqlite3 pathlib
```

3. **MCP server'ı test edin:**
```bash
python butik_firin_mcp.py categories
```

## 📚 Kullanım

### Komut Satırı Kullanımı

```bash
# Kategorileri listele
python butik_firin_mcp.py categories

# Tüm ürünleri listele
python butik_firin_mcp.py products

# Belirli kategorideki ürünleri listele
python butik_firin_mcp.py products kekler-muffinler

# Fiyat önerisi al
python butik_firin_mcp.py suggest_price kekler-muffinler 15.50

# Database backup al
python butik_firin_mcp.py backup
```

### Python API Kullanımı

```python
from butik_firin_mcp import ButikFirinMCP

# MCP server instance
mcp = ButikFirinMCP()

# Kategorileri getir
categories = mcp.bakery_get_categories()
print(categories)

# Fiyat önerisi
pricing = mcp.bakery_suggest_pricing("pastalar", 45.0)
print(f"Önerilen fiyat: {pricing['data']['suggested_price']} TL")

# Ürün açıklaması oluştur
description = mcp.bakery_generate_product_description(
    "Çikolatalı Brownie", 
    "kekler-muffinler",
    ["çikolata", "tereyağı", "un", "yumurta"]
)
print(description['data']['description'])
```

## 🗄️ Database Şeması

### Categories
```sql
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_range_min REAL,
    price_range_max REAL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Products
```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    price REAL NOT NULL,
    category_id TEXT,
    stock_quantity INTEGER DEFAULT 0,
    ingredients TEXT,      -- Pastane için özel
    allergens TEXT,        -- Alerjenik maddeler
    shelf_life_days INTEGER, -- Raf ömrü
    -- ... diğer alanlar
)
```

### Orders
```sql
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    items TEXT NOT NULL,     -- JSON array
    total_amount REAL NOT NULL,
    delivery_date DATE,
    special_instructions TEXT,
    -- ... diğer alanlar
)
```

## 📋 MCP Tools

### Database Tools
- `bakery_get_categories()` - Kategorileri listele
- `bakery_get_products(category_id?, limit?)` - Ürünleri getir
- `bakery_add_product(product_data)` - Yeni ürün ekle
- `bakery_update_product(id, updates)` - Ürün güncelle
- `bakery_delete_product(id)` - Ürün sil

### Business Logic Tools
- `bakery_suggest_pricing(category_id, base_cost)` - Fiyat önerisi
- `bakery_generate_product_description(name, category, ingredients)` - Açıklama oluştur
- `bakery_validate_product_data(product)` - Ürün verisi doğrula

### Utility Tools
- `bakery_backup_database()` - Database yedekle
- `bakery_upload_product_image(image, category)` - Görsel yükle
- `bakery_get_sales_report(date_range)` - Satış raporu

## 🏗️ Kategori Yapısı

```javascript
{
  "kekler-muffinler": {
    "name": "Kekler & Muffinler",
    "price_range": [15, 50],
    "typical_products": ["brownie", "cupcake", "muffin"]
  },
  "kurabiyeler": {
    "name": "Kurabiyeler",
    "price_range": [20, 40], 
    "typical_products": ["tereyağlı kurabiye", "cookie"]
  },
  "pastalar": {
    "name": "Pastalar",
    "price_range": [100, 500],
    "typical_products": ["doğum günü pastası", "tiramisu"]
  },
  // ... 5 kategori daha
}
```

## 💰 Fiyatlandırma Kuralları

- **Markup Percentage:** %40 (standart kar marjı)
- **Minimum Profit Margin:** %25 (en düşük kar)
- **Bulk Discount Threshold:** 10 adet (toplu indirim eşiği)
- **Special Order Markup:** %25 (özel sipariş ek ücreti)

### Fiyatlandırma Örneği

```python
# Maliyet: 20 TL olan bir kek için
base_cost = 20.0
result = mcp.bakery_suggest_pricing("kekler-muffinler", base_cost)

# Çıktı:
{
  "suggested_price": 28.0,  # 20 * 1.40 = 28 TL
  "min_price": 25.0,        # 20 * 1.25 = 25 TL 
  "markup_percentage": 40,
  "profit_margin": 28.6     # %28.6 kar marjı
}
```

## 📁 Dosya Yapısı

```
mcp-server/
├── butik-firin-mcp.json       # MCP konfigürasyonu
├── butik_firin_mcp.py         # Python implementasyonu
├── README.md                  # Bu dosya
└── tests/
    ├── test_categories.py     # Kategori testleri
    ├── test_products.py       # Ürün testleri
    └── test_pricing.py        # Fiyatlandırma testleri
```

## 🔐 Güvenlik

- **Admin-only operations:** Ürün silme, backup alma
- **Rate limiting:** Dakikada 60 istek
- **Input validation:** Tüm girişler doğrulanır
- **SQL injection protection:** Parametreli sorgular

## 🧪 Testing

```bash
# Tüm testleri çalıştır
python -m pytest tests/

# Belirli testi çalıştır
python -m pytest tests/test_categories.py -v

# Coverage raporu
python -m pytest --cov=butik_firin_mcp tests/
```

## 📈 Monitoring

MCP server aktivitesini izlemek için:

```python
# Log seviyesi ayarla
import logging
logging.basicConfig(level=logging.DEBUG)

# MCP instance oluştur
mcp = ButikFirinMCP()

# Her işlem loglanır
mcp.bakery_get_categories()  # INFO: Fetching categories...
```

## 🔗 Entegrasyonlar

### Future Integrations
- **WhatsApp API:** Sipariş bildirimleri
- **Email Service:** Sipariş onayları
- **SMS Gateway:** Teslimat bildirimleri
- **Payment Gateway:** Ödeme işlemleri

## 🆘 Troubleshooting

### Yaygın Sorunlar

**Database lock hatası:**
```bash
# Solution: Database connection'ları kontrol et
lsof E:\\butikfirin-app\\dev.db
```

**Permission hatası:**
```bash
# Solution: Klasör izinlerini kontrol et
chmod 755 E:\\butikfirin-app\\
```

**Python import hatası:**
```bash
# Solution: PYTHONPATH ayarla
export PYTHONPATH="${PYTHONPATH}:E:\\butikfirin-app\\mcp-server"
```

## 📄 License

Bu MCP server Butik Fırın projesine özeldir ve private license altındadır.

## 👥 Katkıda Bulunma

1. Feature branch oluştur: `git checkout -b feature/yeni-ozellik`
2. Testler ekle: `tests/test_yeni_ozellik.py`
3. Commit: `git commit -m 'Yeni özellik eklendi'`
4. Push: `git push origin feature/yeni-ozellik`
5. Pull Request oluştur

---

**Butik Fırın MCP Server** - Pastane e-ticareti için özel MCP çözümü 🍰 