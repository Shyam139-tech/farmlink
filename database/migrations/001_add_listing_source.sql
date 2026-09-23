ALTER TABLE crop_listings
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'WEB';

ALTER TABLE crop_listings
  DROP CONSTRAINT IF EXISTS crop_listings_source_check;

ALTER TABLE crop_listings
  ADD CONSTRAINT crop_listings_source_check
  CHECK (source IN ('WEB', 'VOICE', 'USSD', 'IVR'));
