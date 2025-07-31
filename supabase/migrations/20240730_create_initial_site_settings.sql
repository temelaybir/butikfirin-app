-- Create site_settings table if not exists
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name VARCHAR(255) DEFAULT 'Butik Fırın',
  site_description TEXT,
  site_keywords TEXT,
  site_logo VARCHAR(500),
  favicon VARCHAR(500),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_address TEXT,
  social_facebook VARCHAR(500),
  social_instagram VARCHAR(500),
  social_twitter VARCHAR(500),
  social_youtube VARCHAR(500),
  social_linkedin VARCHAR(500),
  theme_color_scheme VARCHAR(50) DEFAULT 'light',
  theme_design_style VARCHAR(50) DEFAULT 'default',
  theme_font_style VARCHAR(50) DEFAULT 'modern-sans',
  theme_product_card_style VARCHAR(50) DEFAULT 'default',
  currency_code VARCHAR(10) DEFAULT 'TRY',
  currency_symbol VARCHAR(10) DEFAULT '₺',
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_message TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_site_settings_is_active ON site_settings(is_active);

-- Insert default settings if no active settings exist
INSERT INTO site_settings (
  site_name,
  site_description,
  site_keywords,
  contact_email,
  contact_phone,
  contact_address,
  social_facebook,
  social_instagram,
  theme_color_scheme,
  theme_design_style,
  theme_font_style,
  theme_product_card_style,
  currency_code,
  currency_symbol,
  is_active
)
SELECT 
  'Butik Fırın',
  'Ev yapımı taze pastalar, kekler ve tatlılar',
  'butik fırın, pasta, kek, tatlı, ev yapımı',
  'info@butikfirin.com',
  '+90 555 123 4567',
  'İstanbul, Türkiye',
  'https://facebook.com/butikfirin',
  'https://instagram.com/butikfirin',
  'light',
  'default',
  'modern-sans',
  'default',
  'TRY',
  '₺',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM site_settings WHERE is_active = true
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public users can view active site settings" ON site_settings
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Service role can manage all site settings" ON site_settings
  FOR ALL
  TO service_role
  USING (true);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON site_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();