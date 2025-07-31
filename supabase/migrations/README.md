# Supabase Migrations

Bu klasör Supabase veritabanı migration dosyalarını içerir.

## Migration Dosyaları

1. **20240730_only_theme_columns.sql** ⭐ **ÖNERİLEN**
   - Sadece tema kolonlarını ekler
   - Mevcut `site_settings` tablosuna zarar vermez
   - En güvenli seçenek

2. **20240730_check_and_fix_site_settings.sql**
   - Akıllı migration - neyin eksik olduğunu kontrol eder
   - Sadece eksik kolonları ekler
   - Varsayılan değerleri ayarlar

3. **20240730_create_initial_site_settings.sql**
   - Tablo yoksa sıfırdan oluşturur
   - Tüm kolonları içerir
   - RLS politikalarını ayarlar

4. **20240730_add_theme_columns_to_site_settings.sql**
   - Basit tema kolonları ekleme
   - Manuel kullanım için

## Migration Nasıl Çalıştırılır?

### Yöntem 1: Supabase Dashboard SQL Editor

1. [Supabase Dashboard](https://app.supabase.com) açın
2. Projenizi seçin
3. Sol menüden "SQL Editor" seçin
4. Migration dosyasının içeriğini kopyalayın
5. SQL Editor'a yapıştırın
6. "Run" butonuna tıklayın

### Yöntem 2: Supabase CLI

```bash
# Supabase CLI kurulu değilse
npm install -g supabase

# Projeye bağlanın
supabase link --project-ref [project-ref]

# Migration'ları çalıştırın
supabase db push
```

### Yöntem 3: Doğrudan PostgreSQL

```bash
# PostgreSQL bağlantı string'i ile
psql [connection-string] -f supabase/migrations/20240730_create_initial_site_settings.sql
```

## Önemli Notlar

- Migration'ları sırayla çalıştırın
- Önce `create_initial_site_settings.sql` çalıştırın
- Eğer tablo zaten varsa sadece `add_theme_columns_to_site_settings.sql` çalıştırın
- Migration'lar idempotent'tir (birden fazla kez çalıştırılabilir)