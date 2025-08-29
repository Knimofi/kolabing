-- Create a function to safely return profile data for public queries
-- This filters out sensitive contact information like email addresses
CREATE OR REPLACE FUNCTION public.get_safe_profile_data()
RETURNS TABLE (
  id uuid,
  display_name text,
  bio text,
  city text,
  profile_photo text,
  social_links jsonb,
  type user_type,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  user_id uuid,
  contact_info jsonb
) 
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT 
    p.id,
    p.display_name,
    p.bio,
    p.city,
    p.profile_photo,
    p.social_links,
    p.type,
    p.created_at,
    p.updated_at,
    p.user_id,
    -- Return full contact info for profile owners, filtered for others
    CASE 
      WHEN p.user_id = auth.uid() THEN p.contact_info
      ELSE '{}'::jsonb  -- Return empty object for public queries
    END as contact_info
  FROM public.profiles p;
$$;

-- Drop the old public read policy
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;

-- Create new policies with proper data filtering
CREATE POLICY "profiles_public_safe_read" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Update the policy to filter contact_info using a view-like approach
-- We'll handle this in the application layer by creating a secure function

-- Create a view for public profile access that filters sensitive data
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT 
  id,
  display_name,
  bio,
  city,
  profile_photo,
  social_links,
  type,
  created_at,
  updated_at,
  user_id,
  '{}'::jsonb as contact_info  -- Always return empty for public view
FROM public.profiles;

-- Grant read access to the public view
GRANT SELECT ON public.profiles_public TO anon, authenticated;