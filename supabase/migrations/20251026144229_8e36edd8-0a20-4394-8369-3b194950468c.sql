-- Create cities table
CREATE TABLE IF NOT EXISTS public.cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on cities table
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read cities
CREATE POLICY "cities_public_read" ON public.cities
  FOR SELECT USING (true);

-- Insert Turkish cities
INSERT INTO public.cities (name) VALUES
  ('Istanbul'),
  ('Ankara'),
  ('Izmir'),
  ('Bursa'),
  ('Antalya'),
  ('Adana'),
  ('Konya'),
  ('Gaziantep'),
  ('Mersin'),
  ('Diyarbakir'),
  ('Kayseri'),
  ('Eskisehir'),
  ('Sanliurfa'),
  ('Malatya'),
  ('Erzurum'),
  ('Denizli'),
  ('Samsun'),
  ('Kahramanmaras'),
  ('Van'),
  ('Batman'),
  ('Elazig'),
  ('Trabzon'),
  ('Manisa'),
  ('Sakarya'),
  ('Balikesir'),
  ('Aydin'),
  ('Tekirdag'),
  ('Hatay'),
  ('Kocaeli'),
  ('Mugla')
ON CONFLICT (name) DO NOTHING;

-- Add city_id column to business_profiles
ALTER TABLE public.business_profiles 
  ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES public.cities(id);

-- Migrate existing city data (match text to cities table)
UPDATE public.business_profiles bp
SET city_id = c.id
FROM public.cities c
WHERE bp.city IS NOT NULL 
  AND bp.city_id IS NULL
  AND LOWER(bp.city) = LOWER(c.name);

-- Add city_id to community_profiles as well for consistency
ALTER TABLE public.community_profiles 
  ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES public.cities(id);

-- Migrate existing city data for community profiles
UPDATE public.community_profiles cp
SET city_id = c.id
FROM public.cities c
WHERE cp.city IS NOT NULL 
  AND cp.city_id IS NULL
  AND LOWER(cp.city) = LOWER(c.name);