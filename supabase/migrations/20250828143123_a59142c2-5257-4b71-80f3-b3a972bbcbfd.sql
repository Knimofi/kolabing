-- Update RLS policies for proper profile_id access control

-- Fix profiles table policies for stricter insert control
DROP POLICY IF EXISTS "create_profile" ON public.profiles;
CREATE POLICY "profiles_owner_insert" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Fix business_profiles insert policy to use correct profile_id validation
DROP POLICY IF EXISTS "insert business profile" ON public.business_profiles;
CREATE POLICY "business_profiles_owner_insert" 
ON public.business_profiles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = profile_id 
    AND user_id = auth.uid() 
    AND type = 'business'
  )
);

-- Add community_profiles insert policy for consistency
CREATE POLICY "community_profiles_owner_insert" 
ON public.community_profiles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = profile_id 
    AND user_id = auth.uid() 
    AND type = 'community'
  )
);

-- Fix applications insert policy to prevent applications to unpublished offers
DROP POLICY IF EXISTS "applications_community_write" ON public.applications;
CREATE POLICY "applications_community_write" 
ON public.applications 
FOR INSERT 
WITH CHECK (
  community_profile_id = get_current_profile_id() 
  AND EXISTS (
    SELECT 1 FROM public.offers 
    WHERE id = offer_id 
    AND status = 'published'
  )
);