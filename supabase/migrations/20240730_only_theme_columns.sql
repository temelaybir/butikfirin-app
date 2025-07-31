-- Simple migration to just add theme columns to existing site_settings table
-- Use this if site_settings table already exists

-- Add theme columns one by one
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS theme_color_scheme VARCHAR(50) DEFAULT 'light';

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS theme_design_style VARCHAR(50) DEFAULT 'default';

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS theme_font_style VARCHAR(50) DEFAULT 'modern-sans';

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS theme_product_card_style VARCHAR(50) DEFAULT 'default';

-- Ensure there's at least one active record
INSERT INTO site_settings (is_active, theme_color_scheme, theme_design_style, theme_font_style, theme_product_card_style)
SELECT true, 'light', 'default', 'modern-sans', 'default'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE is_active = true);

-- Update NULL values to defaults
UPDATE site_settings 
SET 
    theme_color_scheme = COALESCE(theme_color_scheme, 'light'),
    theme_design_style = COALESCE(theme_design_style, 'default'),
    theme_font_style = COALESCE(theme_font_style, 'modern-sans'),
    theme_product_card_style = COALESCE(theme_product_card_style, 'default')
WHERE is_active = true;