-- Add RLS policy to allow community users to delete their own applications
CREATE POLICY "applications_community_delete"
ON public.applications
FOR DELETE
USING (is_community_of_application(id));