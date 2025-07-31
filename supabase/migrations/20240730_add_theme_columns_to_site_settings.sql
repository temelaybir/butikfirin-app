-- Add theme columns to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS theme_color_scheme VARCHAR(50) DEFAULT 'light',
ADD COLUMN IF NOT EXISTS theme_design_style VARCHAR(50) DEFAULT 'default',
ADD COLUMN IF NOT EXISTS theme_font_style VARCHAR(50) DEFAULT 'modern-sans',
ADD COLUMN IF NOT EXISTS theme_product_card_style VARCHAR(50) DEFAULT 'default';

-- Update existing records to have default values if NULL
UPDATE site_settings 
SET 
  theme_color_scheme = COALESCE(theme_color_scheme, 'light'),
  theme_design_style = COALESCE(theme_design_style, 'default'),
  theme_font_style = COALESCE(theme_font_style, 'modern-sans'),
  theme_product_card_style = COALESCE(theme_product_card_style, 'default')
WHERE is_active = true;

-- Add comments for documentation
COMMENT ON COLUMN site_settings.theme_color_scheme IS 'Color theme: light, dark, ocean, forest';
COMMENT ON COLUMN site_settings.theme_design_style IS 'Design style: default, minimal, modern, playful, brutal';
COMMENT ON COLUMN site_settings.theme_font_style IS 'Font theme: modern-sans, elegant-classic, modern-minimalist, artisan-handcrafted, luxury-sophisticated, french-bistro';
COMMENT ON COLUMN site_settings.theme_product_card_style IS 'Product card style: default, minimal, detailed, compact';