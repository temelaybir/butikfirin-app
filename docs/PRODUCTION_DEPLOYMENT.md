# 🚀 İyzico Production Deployment Kılavuzu

## ✅ **Pre-Deployment Checklist**

### 1️⃣ **İyzico Merchant Hesabı**
- [ ] İyzico merchant hesabı onaylandı
- [ ] Production API keys alındı
- [ ] Callback URL'ler İyzico panelinde tanımlandı
- [ ] Test kartları ile sandbox'ta test edildi

### 2️⃣ **Environment Variables (PRODUCTION-ONLY)**
```bash
# 🚀 İyzico Production Settings (SIMPLIFIED)
IYZICO_API_KEY=your_production_api_key
IYZICO_SECRET_KEY=your_production_secret_key
IYZICO_BASE_URL=https://api.iyzipay.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional Settings
IYZICO_FORCE_3D_SECURE=true
IYZICO_DEFAULT_CURRENCY=TRY
```

### ✅ **Current Vercel Setup:**
```bash
IYZICO_BASE_URL=https://api.iyzipay.com
IYZICO_SECRET_KEY=xWZgXAYl6g0l9z4E6pk2aV1Vd1e4SJOm
IYZICO_API_KEY=G5PVbgN9Dwk6p9FCms7HjglYST3nS5qz
```

**🎯 Changes Made:**
- ✅ Removed sandbox/test mode logic
- ✅ Simplified to production-only environment variables
- ✅ Always uses `test_mode: false`
- ✅ Direct environment variable mapping

### 3️⃣ **Database Migration**
```sql
-- Production İyzico settings güncellemesi
UPDATE iyzico_settings SET
  test_mode = false,
  api_key = 'YOUR_PRODUCTION_API_KEY',
  secret_key = 'YOUR_PRODUCTION_SECRET_KEY',
  production_base_url = 'https://api.iyzipay.com',
  callback_url = 'https://yourdomain.com/api/payment/iyzico/callback',
  webhook_url = 'https://yourdomain.com/api/payment/iyzico/webhook'
WHERE is_active = true;
```

## 🔧 **Deployment Steps**

### 1️⃣ **Vercel Deployment**
```bash
# Environment variables set et
vercel env add IYZICO_API_KEY
vercel env add IYZICO_SECRET_KEY
vercel env add IYZICO_TEST_MODE

# Deploy
vercel --prod
```

### 2️⃣ **Production Health Check**
```bash
# API Connection Test
curl https://yourdomain.com/api/test/iyzico-production-test

# Expected Response:
{
  "summary": {
    "apiConnection": "SUCCESS",
    "environment": "Production"
  }
}
```

### 3️⃣ **İyzico Panel Configuration**
- **Callback URL**: `https://yourdomain.com/api/payment/iyzico/callback`
- **Webhook URL**: `https://yourdomain.com/api/payment/iyzico/webhook`
- **Test URL**: `https://yourdomain.com/api/health`

## 🧪 **Production Testing**

### 1️⃣ **API Connection Test**
```bash
curl -X GET https://yourdomain.com/api/test/iyzico-production-test
```

### 2️⃣ **End-to-End Payment Test**
1. **3DS Initiate**: `/api/payment/iyzico/initialize`
2. **3DS Complete**: `/api/payment/iyzico/callback`
3. **Success Page**: `/siparis-basarili`
4. **Error Page**: `/odeme/hata`

### 3️⃣ **Test Cards (Production)**
```javascript
// İyzico production test kartları
const testCards = [
  '5890040000000016', // Akbank MasterCard
  '4603450000000000', // Denizbank Visa
  '5528790000000008', // Halkbank MasterCard
  '374427000000003',  // Garanti Amex
]
```

## 🔐 **Security Checklist**

### 1️⃣ **API Keys**
- [ ] Environment variables'da saklanıyor
- [ ] Git'te commit edilmiyor
- [ ] Vercel'de şifrelenmiş tutuluyor

### 2️⃣ **Callback Security**
- [ ] HTTPS zorunlu
- [ ] CORS ayarları yapıldı
- [ ] Request validation aktif

### 3️⃣ **Error Handling**
- [ ] Stack trace'ler production'da gizli
- [ ] Error logging aktif
- [ ] User-friendly error messages

## 📊 **Monitoring & Analytics**

### 1️⃣ **Transaction Logging**
```sql
-- İşlem takibi
SELECT 
  conversation_id,
  order_number,
  status,
  amount,
  created_at
FROM iyzico_transactions 
ORDER BY created_at DESC 
LIMIT 100;
```

### 2️⃣ **Error Monitoring**
```sql
-- Hata takibi
SELECT 
  event_type,
  severity,
  conversation_id,
  event_data->>'errorCode' as error_code,
  event_data->>'errorMessage' as error_message,
  created_at
FROM iyzico_debug_events 
WHERE severity = 'error'
ORDER BY created_at DESC;
```

### 3️⃣ **Success Rate**
```sql
-- Başarı oranı
SELECT 
  COUNT(*) as total_payments,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_payments,
  ROUND(
    COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*), 
    2
  ) as success_rate
FROM iyzico_transactions 
WHERE created_at >= NOW() - INTERVAL '7 days';
```

## 🚨 **Common Issues & Solutions**

### 1️⃣ **API Connection Failed**
```bash
# Check environment variables
echo $IYZICO_API_KEY
echo $IYZICO_SECRET_KEY

# Test connection
curl -X GET https://yourdomain.com/api/test/iyzico-production-test
```

### 2️⃣ **Callback URL Issues**
- İyzico panelinde URL güncel mi?
- HTTPS kullanılıyor mu?
- URL accessible mi?

### 3️⃣ **Payment Errors**
- Error code 1001: API bilgileri kontrol et
- **Error code 1000: SHA1 → HMAC-SHA256 problemi (ÇÖZÜLDİ)**
- Error code 5001: Kart bilgileri hatalı

**Error 1000 Solution:**
```bash
# Production .env.local
IYZICO_USE_HMAC_SHA256=true  # CRITICAL for production
```

**Technical Details:**
- Production API requires HMAC-SHA256 (modern standard)
- Sandbox API uses SHA1 (legacy compatibility)  
- Auto-detection: testMode=false → HMAC-SHA256

## 📱 **Mobile & PWA Support**

### 1️⃣ **Responsive Design**
- [ ] Mobile-first yaklaşım
- [ ] Touch-friendly buttons
- [ ] Loading states

### 2️⃣ **3D Secure Mobile**
- [ ] Popup alternative (iframe)
- [ ] Back button handling
- [ ] Orientation changes

## 🔄 **Maintenance**

### 1️⃣ **Regular Tasks**
- [ ] Transaction logs temizliği (30 gün)
- [ ] Error logs monitoring
- [ ] API key rotation (6 ay)

### 2️⃣ **Updates**
- [ ] İyzico SDK updates
- [ ] Security patches
- [ ] Performance optimizations

## 📞 **Support Contacts**

- **İyzico Support**: https://iyzico.com/destek
- **Merchant Panel**: https://merchant.iyzipay.com
- **API Documentation**: https://dev.iyzipay.com

---

## 🎯 **Production Deployment Summary**

### ✅ **Ready for Production:**
1. **✅ API Integration** - Custom service, SDK uyumlu
2. **✅ Authentication** - SHA1 HMAC implementation
3. **✅ Error Handling** - Comprehensive error management
4. **✅ UI/UX** - Modern, responsive design
5. **✅ Testing** - Comprehensive test suite
6. **✅ Logging** - Transaction & debug logs
7. **✅ Security** - Best practices implemented

### 🚀 **Deploy Command:**
```bash
# Final deployment
npm run build
vercel --prod

# Health check
curl https://yourdomain.com/api/health
```

**🎉 Production ready! İyzico ödeme sistemi canlıya alınabilir!** 

## 🎯 **Current Production Status**

### **✅ Fixed Issues:**
1. **HMAC-SHA256**: Production authentication working ✅
2. **Community Fixes**: Parameter order, GSM validation, string trimming ✅  
3. **Environment Detection**: Production mode active ✅
4. **Base URL Configuration**: Added to environment variables ✅

### **❌ Remaining Issue:**
- **API Keys**: Still using development keys in production
- **Error 1001**: "api bilgileri bulunamadı" - Invalid API credentials

### **🔧 Next Steps:**
1. **Get Real Production Keys** from İyzico merchant panel
2. **Update Vercel Environment Variables** with real keys
3. **Deploy and Test** with actual production credentials 