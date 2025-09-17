-- Add RLS policy to allow community users to read offers they're collaborating on
CREATE POLICY "offers_collaboration_participants_read" 
ON public.offers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.collaborations c
    JOIN public.profiles p ON c.community_profile_id = p.id
    WHERE c.offer_id = offers.id AND p.user_id = auth.uid()
  )
);