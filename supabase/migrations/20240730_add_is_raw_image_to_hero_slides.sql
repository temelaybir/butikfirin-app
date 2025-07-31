-- Add is_raw_image column to hero_slides table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'hero_slides' 
        AND column_name = 'is_raw_image'
    ) THEN
        ALTER TABLE hero_slides 
        ADD COLUMN is_raw_image BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Update existing rows to have is_raw_image as false
UPDATE hero_slides 
SET is_raw_image = false 
WHERE is_raw_image IS NULL;