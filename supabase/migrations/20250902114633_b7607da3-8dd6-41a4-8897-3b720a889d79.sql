-- Create storage bucket for offer photos
INSERT INTO storage.buckets (id, name, public) VALUES ('offer-photos', 'offer-photos', true);

-- Create policies for offer photos
CREATE POLICY "Offer photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'offer-photos');

CREATE POLICY "Users can upload offer photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'offer-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own offer photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'offer-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own offer photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'offer-photos' AND auth.uid()::text = (storage.foldername(name))[1]);