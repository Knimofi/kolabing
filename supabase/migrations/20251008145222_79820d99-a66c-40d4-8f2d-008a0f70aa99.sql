-- Fix surveys table schema: make submitted_at nullable and remove default timestamp
ALTER TABLE public.surveys 
  ALTER COLUMN submitted_at DROP NOT NULL,
  ALTER COLUMN submitted_at DROP DEFAULT;

-- Clean up existing empty surveys: set submitted_at to NULL where no real feedback exists
UPDATE public.surveys 
SET submitted_at = NULL 
WHERE 
  (answers IS NULL OR answers = '{}'::jsonb OR (jsonb_typeof(answers) = 'object' AND answers = '{}')) 
  AND (score IS NULL OR score = 0)
  AND submitted_at IS NOT NULL;