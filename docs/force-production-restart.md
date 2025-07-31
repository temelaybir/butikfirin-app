# 🔄 Production Cache & Build Force Restart

## ADIM 1: Environment Variables Check

**Vercel Dashboard'da kontrol edin:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

## ADIM 2: Force Re-deploy

### Seçenek A: Vercel Dashboard
1. Vercel Dashboard → Deployments
2. Son deployment'ın sağında **"..."** → **"Redeploy"**
3. **"Use existing build cache"** - ❌ KAPALI
4. **"Redeploy"** tıklayın

### Seçenek B: Git Commit (Recommended)
```bash
# Boş commit ile force deploy
git commit --allow-empty -m "force: production image fix deployment"
git push origin main
```

### Seçenek C: Package.json Touch
```bash
# package.json'a boş satır ekle
echo "" >> package.json
git add package.json
git commit -m "force: rebuild production cache"
git push origin main
```

## ADIM 3: Cache Clear Commands

**Vercel CLI varsa:**
```bash
npx vercel env ls
npx vercel --prod
```

**Browser Cache Clear:**
```bash
# Production sitesinde F12 → Network
# Right click → "Clear browser cache"
# Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
```

## ADIM 4: Next.js Cache Invalidation

**next.config.ts'ye geçici ekle:**
```typescript
// Geçici cache buster
export default {
  // ... existing config
  
  // 🚨 PRODUCTION BUILD FİX - DEPLOY SONRASI SİL
  generateBuildId: async () => {
    return 'production-image-fix-' + Date.now()
  },
  
  // Image cache bypass
  images: {
    unoptimized: true,
    loader: 'custom', 
    loaderFile: './src/lib/image-loader.ts',
    minimumCacheTTL: 0, // 🚨 Cache bypass
  }
}
```

## ADIM 5: Test Sequence

1. **SQL Çalıştır:** `production-image-fix.sql`
2. **Deploy Trigger:** Force redeploy (cache clear)
3. **5 dakika bekle** (deployment time)
4. **Browser Test:** Hard refresh production site
5. **Console Test:** `debug-production-images.js` çalıştır

## ADIM 6: Immediate Hot Fix

**Bu değişikliği yapın ve hemen push edin:**

**src/lib/image-loader.ts:**
```typescript
export default function imageLoader({ src, width, quality }) {
  // 🚨 PRODUCTION HOT FIX
  console.log('🖼️ Image Loader Called:', { src, width, quality })
  
  if (!src || typeof src !== 'string') {
    console.log('❌ Invalid src, using placeholder')
    return '/placeholder-product.svg'
  }
  
  // Force bypass cache
  const cacheBuster = Date.now()
  const cleanSrc = src.includes('?') 
    ? `${src}&t=${cacheBuster}`
    : `${src}?t=${cacheBuster}`
  
  console.log('✅ Final image URL:', cleanSrc)
  return cleanSrc
}
```

## SONUÇ KONTROLÜ

**5 dakika sonra production'da:**
1. ✅ Unsplash görselleri görünüyor → URL sorunu çözüldü
2. ❌ Hala placeholder → Build/deployment sorunu
3. 🔍 Console'da log'lar görünüyor → Image loader çalışıyor

**Hangi durum gerçekleşirse hemen bildirin! 🚨** 