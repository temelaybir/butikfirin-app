-- Hero banner tablosuna yeni kolonlar ekle
ALTER TABLE hero_banners 
ADD COLUMN IF NOT EXISTS is_raw_image BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_on_mobile BOOLEAN DEFAULT true;

-- Mevcut banner'ları güncelle
UPDATE hero_banners 
SET is_raw_image = false, show_on_mobile = true 
WHERE is_raw_image IS NULL OR show_on_mobile IS NULL;