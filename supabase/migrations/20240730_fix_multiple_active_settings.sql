-- Fix multiple active site_settings issue
-- First, set all records to inactive
UPDATE site_settings SET is_active = false WHERE is_active = true;

-- Then, activate only the most recent one
UPDATE site_settings 
SET is_active = true 
WHERE id = (
    SELECT id 
    FROM site_settings 
    ORDER BY created_at DESC 
    LIMIT 1
);

-- Add a unique constraint to prevent multiple active records
-- First drop if exists
ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS unique_active_setting;

-- Then add the constraint
CREATE UNIQUE INDEX unique_active_setting ON site_settings (is_active) WHERE is_active = true;