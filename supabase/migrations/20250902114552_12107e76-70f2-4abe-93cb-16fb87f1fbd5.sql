-- Remove collaboration_goal field from offers table
ALTER TABLE public.offers DROP COLUMN IF EXISTS collaboration_goal;

-- Add timeline_days field to offers table
ALTER TABLE public.offers ADD COLUMN timeline_days integer;

-- Add photo_url field to offers table for uploaded offer photos
ALTER TABLE public.offers ADD COLUMN photo_url text;