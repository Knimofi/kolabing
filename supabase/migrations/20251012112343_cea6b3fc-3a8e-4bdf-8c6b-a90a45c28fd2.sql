-- Add new columns for enhanced availability and location features
ALTER TABLE collab_opportunities
ADD COLUMN IF NOT EXISTS availability_mode TEXT DEFAULT 'date_range',
ADD COLUMN IF NOT EXISTS recurring_pattern TEXT,
ADD COLUMN IF NOT EXISTS recurring_day TEXT,
ADD COLUMN IF NOT EXISTS recurring_time TEXT,
ADD COLUMN IF NOT EXISTS venue_mode TEXT DEFAULT 'no_venue',
ADD COLUMN IF NOT EXISTS preferred_city TEXT,
ADD COLUMN IF NOT EXISTS preferred_area TEXT,
ADD COLUMN IF NOT EXISTS use_profile_photo BOOLEAN DEFAULT false;

-- Make timeline_days nullable since it's being removed for communities
ALTER TABLE collab_opportunities
ALTER COLUMN timeline_days DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN collab_opportunities.availability_mode IS 'Either date_range or recurring';
COMMENT ON COLUMN collab_opportunities.venue_mode IS 'One of: no_venue, i_have_venue, partner_provides';