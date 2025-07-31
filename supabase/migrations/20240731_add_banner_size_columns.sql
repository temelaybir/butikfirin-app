-- Hero banner tablosuna boyut kolonları ekle
DO $$ 
BEGIN
    -- Add custom_width column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'custom_width') THEN
        ALTER TABLE hero_banners ADD COLUMN custom_width INTEGER DEFAULT NULL;
    END IF;
    
    -- Add custom_height column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'custom_height') THEN
        ALTER TABLE hero_banners ADD COLUMN custom_height INTEGER DEFAULT NULL;
    END IF;
    
    -- Add size_unit column if it doesn't exist (px, %, vh, etc.)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'size_unit') THEN
        ALTER TABLE hero_banners ADD COLUMN size_unit VARCHAR(10) DEFAULT 'px';
    END IF;
END $$;

-- Set default values for existing records
UPDATE hero_banners 
SET custom_width = NULL, 
    custom_height = NULL, 
    size_unit = 'px'
WHERE custom_width IS NULL AND custom_height IS NULL AND size_unit IS NULL;