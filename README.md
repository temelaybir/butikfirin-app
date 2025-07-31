# 🍰 Butik Fırın E-Ticaret Sitesi

**Ev yapımı lezzetler, taze pastalar ve özel günler için muhteşem tatlılar**

Bu proje Next.js 15 ve TypeScript kullanılarak geliştirilmiş bir pastane/fırın e-ticaret sitesidir.

## 🎯 Proje Özellikleri

### 📦 Ürün Kategorileri
- 🧁 **Kekler & Muffinler** - Ev yapımı kekler, cupcakeler ve nefis muffinler
- 🍪 **Kurabiyeler** - Çıtır çıtır kurabiyeler ve bisküviler  
- 🎂 **Pastalar** - Özel günler için muhteşem pastalar
- 🍮 **Tatlılar** - Geleneksel ve modern tatlılar
- 🥖 **Ekmekler** - Taze günlük ekmekler ve poğaçalar
- ☕ **İçecekler** - Taze sıkılmış meyve suları ve kahveler
- 🥟 **Börekler & Tuzlular** - El açması börekler ve tuzlu atıştırmalıklar
- 🎁 **Özel Siparişler** - Doğum günü ve özel etkinlik siparişleri

### 🛠️ Teknik Özellikler
- ⚡ **Next.js 15** (Turbopack ile hızlandırılmış)
- 🔷 **TypeScript** - Tip güvenli geliştirme
- 🎨 **Tailwind CSS** - Modern ve responsive tasarım
- 💾 **SQLite** - Local development database
- 🔐 **NextAuth.js** - Kimlik doğrulama
- 📱 **Responsive Design** - Mobil ve desktop uyumlu
- 🌙 **Dark Mode** - Karanlık tema desteği

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm 8+

### Adımlar

1. **Bağımlılıkları yükleyin:**
\`\`\`bash
npm install
\`\`\`

2. **Environment dosyasını oluşturun:**
\`\`\`bash
# .env.local dosyası oluşturun ve aşağıdaki değerleri ekleyin:

# Database (Local Development)
DATABASE_URL=file:./dev.db
DATABASE_TYPE=sqlite

# Site Configuration  
SITE_NAME="Butik Fırın"
SITE_DESCRIPTION="Ev yapımı lezzetler, taze pastalar ve özel günler için muhteşem tatlılar"
SITE_URL=http://localhost:3001

# NextJS
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here

# Admin
ADMIN_EMAIL=admin@butikfirin.local
ADMIN_PASSWORD=your-admin-password

# Development
NODE_ENV=development
DEBUG=true
\`\`\`

3. **Veritabanını başlatın:**
\`\`\`bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
\`\`\`

4. **Development server'ı başlatın:**
\`\`\`bash
npm run dev
\`\`\`

Site http://localhost:3001 adresinde çalışacak.

## 🗂️ Proje Yapısı

\`\`\`
butik-firin-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (customer)/     # Müşteri sayfaları
│   │   ├── (admin)/        # Admin paneli
│   │   └── api/            # API rotaları
│   ├── components/         # Yeniden kullanılabilir componentler
│   ├── context/           # React Context'leri
│   ├── lib/               # Yardımcı kütüphaneler
│   └── types/             # TypeScript tip tanımları
├── public/                # Statik dosyalar
│   └── uploads/          # Yüklenen dosyalar
├── prisma/               # Database şeması ve migration'lar
└── project.config.json   # Proje konfigürasyonu
\`\`\`

## 🎨 Tema ve Tasarım

Bu proje pastane/fırın temasına özel olarak tasarlanmıştır:

- **Ana Renkler:** Sıcak tonlar (altın, kahverengi, krem)
- **Font:** Modern ve okunabilir fontlar
- **Görsel Dil:** Ev yapımı, sıcak, samimi
- **İkonlar:** Pastane ve fırın temalı

## 📊 Veritabanı

Local SQLite veritabanı kullanılır:
- **Dosya:** \`./dev.db\`
- **Yönetim:** Prisma ORM
- **Backup:** \`./backups/\` klasörü

## 🔧 MCP Server Konfigürasyonu

Bu proje Ardahan Ticaret'ten ayrı, kendi MCP server'larını kullanır:

- ✅ **Desktop Commander MCP** - Dosya yönetimi
- ✅ **Local SQLite MCP** - Veritabanı işlemleri  
- ❌ **Supabase MCP** - Kullanılmaz (Ardahan Ticaret'e özgü)

## 👨‍💻 Geliştirme

### Kullanılan Komutlar
\`\`\`bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint kontrolü
npm run type-check   # TypeScript kontrolü
\`\`\`

### Veritabanı Komutları
\`\`\`bash
npx prisma studio    # Database GUI
npx prisma generate  # Client oluştur
npx prisma migrate   # Migration çalıştır
npx prisma db seed   # Demo veri ekle
\`\`\`

## 🎯 Özellik Roadmap

- [ ] Prisma + SQLite kurulumu
- [ ] Pastane kategorileri ve ürünleri
- [ ] Tema özelleştirmesi (pastane renkleri)
- [ ] Sipariş yönetimi
- [ ] Özel sipariş formu
- [ ] WhatsApp entegrasyonu
- [ ] Mobil uygulama
- [ ] SEO optimizasyonu

---

**Not:** Bu proje bağımsız bir Butik Fırın projesidir ve başka projelerle (Ardahan Ticaret gibi) database paylaşımı yapmaz.