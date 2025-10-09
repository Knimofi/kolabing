-- Function to auto-create survey entries when collaboration is completed
CREATE OR REPLACE FUNCTION public.create_collaboration_surveys()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create surveys when status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Create survey entry for business participant
    INSERT INTO public.surveys (
      collaboration_id,
      filled_by_profile_id,
      answers,
      score
    ) VALUES (
      NEW.id,
      NEW.business_profile_id,
      '{}'::jsonb,
      NULL
    )
    ON CONFLICT DO NOTHING;

    -- Create survey entry for community participant
    INSERT INTO public.surveys (
      collaboration_id,
      filled_by_profile_id,
      answers,
      score
    ) VALUES (
      NEW.id,
      NEW.community_profile_id,
      '{}'::jsonb,
      NULL
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create surveys on collaboration completion
DROP TRIGGER IF EXISTS trigger_create_collaboration_surveys ON public.collaborations;
CREATE TRIGGER trigger_create_collaboration_surveys
  AFTER INSERT OR UPDATE ON public.collaborations
  FOR EACH ROW
  EXECUTE FUNCTION public.create_collaboration_surveys();