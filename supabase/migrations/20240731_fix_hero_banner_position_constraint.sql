-- Hero banner position constraint düzeltmeleri

-- Önce mevcut duplicate position'ları temizle
DELETE FROM hero_banners h1 
WHERE EXISTS (
  SELECT 1 FROM hero_banners h2 
  WHERE h2.position = h1.position 
  AND h2.id > h1.id
);

-- Position için unique constraint ekle
DO $$ 
BEGIN
    -- Drop existing constraint if exists
    BEGIN
        ALTER TABLE hero_banners DROP CONSTRAINT IF EXISTS hero_banners_position_unique;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
    
    -- Add unique constraint on position
    ALTER TABLE hero_banners ADD CONSTRAINT hero_banners_position_unique UNIQUE (position);
EXCEPTION
    WHEN duplicate_key THEN 
        -- If constraint already exists, ignore
        NULL;
END $$;

-- Update RLS policies to be more permissive for admin operations
DROP POLICY IF EXISTS "Admin can manage hero banners" ON hero_banners;

-- Create more permissive policy for admin operations
CREATE POLICY "Admin can manage hero banners" ON hero_banners
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Ensure storage policies are also permissive
DROP POLICY IF EXISTS "Admin can upload hero banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update hero banner images" ON storage.objects;  
DROP POLICY IF EXISTS "Admin can delete hero banner images" ON storage.objects;

CREATE POLICY "Admin can upload hero banner images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'hero-banners');

CREATE POLICY "Admin can update hero banner images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'hero-banners');

CREATE POLICY "Admin can delete hero banner images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'hero-banners');