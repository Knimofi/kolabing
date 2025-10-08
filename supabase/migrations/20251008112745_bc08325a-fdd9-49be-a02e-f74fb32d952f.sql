-- Add contact_methods field to collaborations table
ALTER TABLE public.collaborations 
ADD COLUMN IF NOT EXISTS contact_methods jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.collaborations.contact_methods IS 'Contact methods selected by business: {whatsapp: "+34123456789", instagram: "@username", email: "email@example.com"}';

-- Update the scheduled_date column to make it more flexible
COMMENT ON COLUMN public.collaborations.scheduled_date IS 'Scheduled date and time for the collaboration';