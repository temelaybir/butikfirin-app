-- Add theme columns to site_settings table if they don't exist
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS theme_color_scheme VARCHAR(50) DEFAULT 'light',
ADD COLUMN IF NOT EXISTS theme_design_style VARCHAR(50) DEFAULT 'default',
ADD COLUMN IF NOT EXISTS theme_font_style VARCHAR(50) DEFAULT 'modern-sans',
ADD COLUMN IF NOT EXISTS theme_product_card_style VARCHAR(50) DEFAULT 'default';

-- Update existing records to have default values
UPDATE site_settings 
SET 
  theme_color_scheme = COALESCE(theme_color_scheme, 'light'),
  theme_design_style = COALESCE(theme_design_style, 'default'),
  theme_font_style = COALESCE(theme_font_style, 'modern-sans'),
  theme_product_card_style = COALESCE(theme_product_card_style, 'default')
WHERE is_active = true;