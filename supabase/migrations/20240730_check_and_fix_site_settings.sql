-- First, let's check what columns exist in site_settings
-- This migration handles both scenarios: empty table or existing table with different structure

-- Add missing columns to site_settings table if they don't exist
DO $$ 
BEGIN
    -- Add theme columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'theme_color_scheme') THEN
        ALTER TABLE site_settings ADD COLUMN theme_color_scheme VARCHAR(50) DEFAULT 'light';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'theme_design_style') THEN
        ALTER TABLE site_settings ADD COLUMN theme_design_style VARCHAR(50) DEFAULT 'default';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'theme_font_style') THEN
        ALTER TABLE site_settings ADD COLUMN theme_font_style VARCHAR(50) DEFAULT 'modern-sans';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'theme_product_card_style') THEN
        ALTER TABLE site_settings ADD COLUMN theme_product_card_style VARCHAR(50) DEFAULT 'default';
    END IF;

    -- Add other essential columns if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'site_name') THEN
        ALTER TABLE site_settings ADD COLUMN site_name VARCHAR(255) DEFAULT 'Butik Fırın';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'site_description') THEN
        ALTER TABLE site_settings ADD COLUMN site_description TEXT DEFAULT 'Ev yapımı taze pastalar, kekler ve tatlılar';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'currency_symbol') THEN
        ALTER TABLE site_settings ADD COLUMN currency_symbol VARCHAR(10) DEFAULT '₺';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'currency_code') THEN
        ALTER TABLE site_settings ADD COLUMN currency_code VARCHAR(10) DEFAULT 'TRY';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'is_active') THEN
        ALTER TABLE site_settings ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Check if there's an active record, if not insert default values
INSERT INTO site_settings (
    theme_color_scheme,
    theme_design_style,
    theme_font_style,
    theme_product_card_style,
    is_active
)
SELECT 
    'light',
    'default',
    'modern-sans',
    'default',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM site_settings WHERE is_active = true
);

-- Update any NULL theme values to defaults
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