-- Hero Banner'lar için tablo oluştur
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position TEXT NOT NULL CHECK (position IN ('main', 'side1', 'side2')),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  alt_text TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS politikaları
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Herkes görebilir
CREATE POLICY "Hero banners are viewable by everyone" ON hero_banners
  FOR SELECT USING (is_active = true);

-- Sadece admin yönetebilir
CREATE POLICY "Admin can manage hero banners" ON hero_banners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND status = 'active'
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_banners_updated_at BEFORE UPDATE
  ON hero_banners FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Varsayılan banner'ları ekle
INSERT INTO hero_banners (position, image_url, title, subtitle, button_text, button_link, alt_text, is_active, display_order) VALUES
  ('main', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80', 'Taze Fırın Ürünleri', 'Her sabah taze hazırlanan lezzetler', 'Menüyü Keşfet', '#menu-section', 'Taze Fırın Ürünleri', true, 1),
  ('side1', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1965&q=80', 'Özel Tatlılar', 'Usta ellerden çıkan tatlılar', 'İncele', '/kategoriler/tatlilar', 'Tatlılar', true, 2),
  ('side2', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Taze Kahve', 'Günün her saati taze kahve', 'Keşfet', '/kategoriler/kahve', 'Kahve', true, 3);

-- Görsel yükleme için storage bucket oluştur
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-banners', 'hero-banners', true);

-- Storage politikaları
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'hero-banners');

CREATE POLICY "Admin can upload hero banner images" ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'hero-banners' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND status = 'active'
    )
  );

CREATE POLICY "Admin can update hero banner images" ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'hero-banners' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND status = 'active'
    )
  );

CREATE POLICY "Admin can delete hero banner images" ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'hero-banners' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND status = 'active'
    )
  );