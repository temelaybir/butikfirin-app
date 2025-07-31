-- Fix hero banners table - add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add is_raw_image column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'is_raw_image') THEN
        ALTER TABLE hero_banners ADD COLUMN is_raw_image BOOLEAN DEFAULT false;
        UPDATE hero_banners SET is_raw_image = false WHERE is_raw_image IS NULL;
    END IF;
    
    -- Add show_on_mobile column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'show_on_mobile') THEN
        ALTER TABLE hero_banners ADD COLUMN show_on_mobile BOOLEAN DEFAULT true;
        UPDATE hero_banners SET show_on_mobile = true WHERE show_on_mobile IS NULL;
    END IF;
END $$;

-- Ensure all existing records have default values
UPDATE hero_banners 
SET is_raw_image = COALESCE(is_raw_image, false),
    show_on_mobile = COALESCE(show_on_mobile, true)
WHERE is_raw_image IS NULL OR show_on_mobile IS NULL;