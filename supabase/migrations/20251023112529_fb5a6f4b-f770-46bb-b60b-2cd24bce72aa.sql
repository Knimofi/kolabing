-- Fix collab_opportunities RLS policies to work properly for both business and community creators

-- Drop the existing overly broad policy
DROP POLICY IF EXISTS "collab_opportunities_creator_write" ON public.collab_opportunities;

-- Create explicit INSERT policy: users can create opportunities for themselves
CREATE POLICY "collab_opportunities_creator_insert" 
ON public.collab_opportunities 
FOR INSERT 
WITH CHECK (creator_profile_id = public.get_current_profile_id());

-- Create explicit UPDATE policy: users can update their own opportunities
CREATE POLICY "collab_opportunities_creator_update" 
ON public.collab_opportunities 
FOR UPDATE 
USING (public.is_creator_of_opportunity(id))
WITH CHECK (creator_profile_id = public.get_current_profile_id());

-- Create explicit DELETE policy: users can delete their own opportunities
CREATE POLICY "collab_opportunities_creator_delete" 
ON public.collab_opportunities 
FOR DELETE 
USING (public.is_creator_of_opportunity(id));