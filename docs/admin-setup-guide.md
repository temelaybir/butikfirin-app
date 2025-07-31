# 🛡️ RDHN Commerce Admin Authentication Sistemi

Admin paneli artık güvenli authentication sistemi ile korunuyor! 

## 📋 Yapılan Değişiklikler

### 1. ✅ Database Schema (Migration)
- **admin_users** tablosu: Admin kullanıcı bilgileri
- **admin_sessions** tablosu: Session yönetimi
- **admin_activity_logs** tablosu: Tüm admin aktivitelerinin loglanması
- **admin_permissions** ve **admin_role_permissions**: Role-based access control

### 2. ✅ Authentication Service
- `src/services/admin/admin-auth-service.ts`
- Güvenli password hashing (bcrypt)
- Session management 
- Brute force protection (5 failed attempts = 30 min lock)
- Permission checking

### 3. ✅ Login Sayfası  
- `src/app/(admin)/admin/login/page.tsx`
- Modern, güvenli login formu
- Form validation
- Error handling

### 4. ✅ API Endpoints
- `POST /api/admin/auth/login`: Giriş yapma
- `POST /api/admin/auth/logout`: Çıkış yapma

### 5. ✅ Middleware Protection
- `src/middleware.ts`: Tüm admin rotalarını korur
- Session validation
- Auto redirect to login
- Force password change detection

### 6. ✅ Header Component Update
- User bilgileri gösterme
- Role badges
- Güvenli logout

## 🚀 Kurulum Adımları

### 1. Dependencies Install
```bash
cd commerce
npm install
```

### 2. Database Migration Çalıştır
```bash
# Supabase CLI ile
supabase db push

# Veya manual olarak migration dosyasını çalıştır:
# commerce/supabase/migrations/20250120_create_admin_authentication.sql
```

### 3. Environment Variables (production.env.example'da mevcut)
```env
# Admin JWT Secret (güçlü bir key oluşturun)
ADMIN_JWT_SECRET=your-super-secret-admin-jwt-key-change-this-in-production

# Supabase ayarları zaten mevcut
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🔐 Varsayılan Admin Kullanıcısı

Migration sonrası otomatik oluşturulan admin kullanıcısı:

```
Kullanıcı Adı: admin
E-posta: admin@rdhncommerce.com  
Şifre: Admin123!
Role: super_admin
```

## 🛠️ İlk Giriş

1. **Migration'ı çalıştır**: Database'e admin tabloları eklenir
2. **Uygulamayı başlat**: `npm run build && npm run server`
3. **Admin paneline git**: `https://yourdomain.com/admin`
4. **Otomatik redirect**: Login sayfasına yönlendirilirsin
5. **Giriş yap**: admin / Admin123!
6. **ÖNEMLİ**: İlk giriş sonrası şifre değiştir!

## 🔒 Güvenlik Özellikleri

### ✅ Implemented (Aktif)
- ✅ Bcrypt password hashing (salt rounds: 12)
- ✅ Session-based authentication
- ✅ HTTP-only cookies
- ✅ Brute force protection (5 attempts = 30 min lock)
- ✅ Session timeout (8 saat)
- ✅ Activity logging
- ✅ Role-based access
- ✅ Middleware protection
- ✅ Input validation

### 🔄 TODO (Gelecek)
- 🔄 Two-Factor Authentication (2FA)
- 🔄 IP whitelist
- 🔄 Password complexity validation
- 🔄 Session management dashboard
- 🔄 Failed login notifications

## 👥 Kullanıcı Rolleri

| Role | Açıklama | Yetkiler |
|------|----------|----------|
| **super_admin** | Süper Admin | Tüm yetkiler (admin user management dahil) |
| **admin** | Admin | Çoğu yetki (user management hariç) |
| **editor** | İçerik Editörü | Ürün/kategori yönetimi, siparişleri görme |
| **viewer** | Görüntüleyici | Sadece okuma yetkisi |

## 📊 Activity Logging

Tüm admin aktiviteleri `admin_activity_logs` tablosunda loglanır:
- Login/Logout
- Ürün ekleme/düzenleme/silme
- Kategori işlemleri
- Ayar değişiklikleri
- IP adresi ve user agent

## 🛡️ Session Management

- **Duration**: 8 saat (remember me: 30 gün)
- **Storage**: HTTP-only cookies + Database
- **Security**: Secure, SameSite=Strict
- **Auto-cleanup**: Eski session'lar otomatik silinir

## 🔧 Troubleshooting

### Problem: "bcryptjs module not found"
```bash
cd commerce
rm -rf node_modules package-lock.json
npm install
```

### Problem: Migration hatası
```bash
# Supabase connection kontrol et
supabase status

# Migration'ı manuel çalıştır
supabase db reset
```

### Problem: Login çalışmıyor
1. Console'da error loglarını kontrol et
2. Database connection'ı kontrol et
3. Environment variables'ı kontrol et

### Problem: Password hash
Eğer password hash problemi varsa:
```bash
# Yeni hash oluştur
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YeniSifre123!', 12))"

# Database'de güncelle
UPDATE admin_users SET password_hash = 'new_hash' WHERE username = 'admin';
```

## 📱 Usage

### Normal Admin Flow
1. Admin giriş: `/admin/login`
2. Authentication middleware kontrolü
3. Başarılı giriş → `/admin` dashboard
4. Session süresince erişim
5. Logout → session cleanup

### Password Change Flow
1. İlk giriş → force password change
2. `/admin/change-password` sayfası
3. Yeni şifre → `force_password_change = false`
4. Normal admin paneli erişimi

## 🚀 Production Deployment

### 1. Environment Variables
```env
NODE_ENV=production
ADMIN_JWT_SECRET=super-strong-secret-key-for-production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

### 2. Security Checklist
- [ ] ADMIN_JWT_SECRET değiştir
- [ ] Default admin şifresini değiştir
- [ ] HTTPS enable et
- [ ] Rate limiting setup
- [ ] Firewall admin port'ları
- [ ] Backup admin database

### 3. Monitoring
- Admin activity logs
- Failed login attempts
- Session statistics
- Performance metrics

---

## ✨ Sonuç

Artık admin paneliniz tamamen güvenli! 🛡️

- **Login gerekli**: Herhangi bir admin sayfasına erişim için authentication
- **Session management**: Güvenli oturum yönetimi
- **Activity tracking**: Tüm işlemler loglanıyor
- **Role-based access**: Farklı yetki seviyeleri

### Next Steps:
1. Migration'ı çalıştır
2. İlk giriş yap
3. Şifre değiştir
4. Team üyelerine farklı roller ver
5. Security monitoring setup yap

🎉 **Admin sisteminiz production'a hazır!** 