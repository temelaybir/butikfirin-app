# Plesk Proxy Setup - Trendyol Test Ortamı

Bu rehber, Plesk sunucunuzda Trendyol test API'si için statik IP proxy kurulumunu açıklar.

## 🎯 Amaç
- Vercel'in dinamik IP sorununu çözme
- Trendyol test ortamı için statik IP sağlama
- Güvenli proxy bağlantısı kurma

## 📋 Gereksinimler
- Plesk sunucusu (statik IP ile)
- Domain/subdomain (örn: trendyol-proxy.yourdomain.com)
- SSL sertifikası (Let's Encrypt)

## 🔧 Kurulum Adımları

### 1. Subdomain Oluşturma
```bash
# Plesk Panel'de:
1. Websites & Domains
2. Add Subdomain
3. Subdomain name: trendyol-proxy
4. Document root: /httpdocs/proxy
```

### 2. SSL Sertifikası
```bash
# Plesk Panel'de:
1. SSL/TLS Certificates
2. Let's Encrypt
3. Secure the subdomain
```

### 3. Nginx Konfigürasyonu
Plesk > Apache & Nginx Settings > Additional nginx directives:

```nginx
# Trendyol API Proxy Configuration
location /suppliers/ {
    # Proxy headers
    proxy_set_header Host stageapigw.trendyol.com;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS headers
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 200;
    }
    
    # Proxy to Trendyol test API
    proxy_pass https://stageapigw.trendyol.com/suppliers/;
    proxy_ssl_verify off;
    proxy_ssl_server_name on;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # Buffering
    proxy_buffering off;
    proxy_request_buffering off;
}

# Health check endpoint
location /health {
    access_log off;
    return 200 "OK\n";
    add_header Content-Type text/plain;
}

# Block other requests
location / {
    return 404;
}
```

### 4. IP Yetkilendirmesi
```bash
# Plesk sunucunuzun statik IP'sini Trendyol'a bildirin:
1. Trendyol'u arayın: 0850 258 58 00
2. "Test ortamı IP yetkilendirmesi" isteyin
3. Plesk sunucunuzun IP adresini verin
4. Yetkilendirme onayını bekleyin
```

### 5. Test
```bash
# Proxy çalışıyor mu test edin:
curl -H "Authorization: Basic YOUR_BASE64_CREDENTIALS" \
     https://trendyol-proxy.yourdomain.com/suppliers/YOUR_SUPPLIER_ID/v2/products

# Response: Trendyol API'den veri dönmeli
```

## 🌍 Environment Variables

### .env.local (Next.js)
```bash
# Plesk Proxy URL
TRENDYOL_PROXY_URL=https://trendyol-proxy.yourdomain.com

# Test mode zorla (development)
TRENDYOL_TEST_MODE=true
```

### Vercel Environment Variables
```bash
# Vercel Dashboard > Settings > Environment Variables
TRENDYOL_PROXY_URL=https://trendyol-proxy.yourdomain.com
```

## 🔄 Çalışma Mantığı

```bash
Request Flow:
Vercel App → Plesk Proxy (Static IP) → Trendyol Test API

1. Next.js uygulaması TRENDYOL_PROXY_URL kullanır
2. Plesk proxy isteği Trendyol test API'sine yönlendirir
3. Trendyol, Plesk sunucusunun statik IP'sini görür
4. IP yetkilendirmesi geçer, response döner
```

## 🛡️ Güvenlik

### Rate Limiting (Opsiyonel)
```nginx
# Rate limiting ekleyin
limit_req_zone $binary_remote_addr zone=trendyol:10m rate=10r/m;

location /suppliers/ {
    limit_req zone=trendyol burst=5 nodelay;
    # ... diğer konfigürasyon
}
```

### IP Whitelist (Opsiyonel)
```nginx
# Sadece Vercel IP'lerinden erişim
location /suppliers/ {
    # Vercel IP ranges (güncellenmeli)
    allow 76.76.19.0/24;
    allow 76.76.21.0/24;
    deny all;
    
    # ... diğer konfigürasyon
}
```

## 📊 Monitoring

### Log Dosyaları
```bash
# Nginx access logs
/var/www/vhosts/yourdomain.com/logs/access_log

# Nginx error logs  
/var/www/vhosts/yourdomain.com/logs/error_log
```

### Health Check
```bash
# Proxy sağlığını kontrol edin
curl https://trendyol-proxy.yourdomain.com/health

# Response: OK
```

## 🚨 Troubleshooting

### Sık Karşılaşılan Sorunlar

#### 1. 502 Bad Gateway
```bash
Neden: Trendyol API'sine ulaşamıyor
Çözüm: 
- Nginx konfigürasyonunu kontrol edin
- DNS ayarlarını kontrol edin
- Firewall kurallarını kontrol edin
```

#### 2. SSL Handshake Failed
```bash
Neden: SSL sertifika sorunu
Çözüm:
- Let's Encrypt sertifikasını yenileyin
- proxy_ssl_verify off; ayarını kontrol edin
```

#### 3. CORS Errors
```bash
Neden: CORS headers eksik
Çözüm:
- Access-Control headers'ı kontrol edin
- OPTIONS method handling'i kontrol edin
```

## ✅ Test Checklist

- [ ] Subdomain oluşturuldu
- [ ] SSL sertifikası aktif
- [ ] Nginx konfigürasyonu uygulandı
- [ ] Plesk IP'si Trendyol'a bildirildi
- [ ] Environment variables set edildi
- [ ] Health check çalışıyor
- [ ] API test başarılı
- [ ] Vercel deployment güncelleştirildi

## 🎯 Sonuç

Bu kurulumdan sonra:
- ✅ Vercel uygulamanız statik IP üzerinden Trendyol test API'sine erişebilir
- ✅ IP yetkilendirmesi sorunu çözülür
- ✅ Test ortamında güvenli API testleri yapabilirsiniz
- ✅ Production ortamında proxy kullanılmaz (direkt API erişimi) 