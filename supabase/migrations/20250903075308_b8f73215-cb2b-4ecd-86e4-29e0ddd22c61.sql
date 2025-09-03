-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES 
  ('offer-photos', 'offer-photos', true, ARRAY['image/jpeg', 'image/png', 'image/webp'], 5242880),
  ('profile-photos', 'profile-photos', true, ARRAY['image/jpeg', 'image/png', 'image/webp'], 5242880)
ON CONFLICT (id) DO UPDATE SET
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  file_size_limit = EXCLUDED.file_size_limit;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "offers_published_read" ON public.offers;

-- Create new offers policies
CREATE POLICY "offers_community_read_published" 
ON public.offers 
FOR SELECT 
USING (
  status = 'published'::offer_status AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'community'
  )
);

CREATE POLICY "offers_business_owner_read" 
ON public.offers 
FOR SELECT 
USING (
  is_business_owner_of_offer(id)
);

-- Storage policies for offer-photos
CREATE POLICY "Offer photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'offer-photos');

CREATE POLICY "Users can upload their own offer photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'offer-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own offer photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'offer-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own offer photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'offer-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for profile-photos
CREATE POLICY "Profile photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own profile photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);