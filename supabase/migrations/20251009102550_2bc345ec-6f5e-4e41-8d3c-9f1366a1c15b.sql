-- Phase 1: Rename offers table to collab_opportunities and add creator fields
ALTER TABLE public.offers RENAME TO collab_opportunities;

-- Add new columns for neutral creator identification
ALTER TABLE public.collab_opportunities 
ADD COLUMN creator_profile_id UUID,
ADD COLUMN creator_profile_type TEXT CHECK (creator_profile_type IN ('business', 'community'));

-- Migrate existing data: business_profile_id becomes creator_profile_id
UPDATE public.collab_opportunities 
SET 
  creator_profile_id = business_profile_id,
  creator_profile_type = 'business';

-- Make new columns NOT NULL after migration
ALTER TABLE public.collab_opportunities 
ALTER COLUMN creator_profile_id SET NOT NULL,
ALTER COLUMN creator_profile_type SET NOT NULL;

-- Add foreign key for creator_profile_id to profiles table
ALTER TABLE public.collab_opportunities
ADD CONSTRAINT collab_opportunities_creator_profile_id_fkey 
FOREIGN KEY (creator_profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Phase 2: Update applications table
ALTER TABLE public.applications 
ADD COLUMN applicant_profile_id UUID,
ADD COLUMN applicant_profile_type TEXT CHECK (applicant_profile_type IN ('business', 'community'));

-- Migrate existing data: community_profile_id becomes applicant_profile_id
UPDATE public.applications 
SET 
  applicant_profile_id = community_profile_id,
  applicant_profile_type = 'community';

-- Make new columns NOT NULL after migration
ALTER TABLE public.applications 
ALTER COLUMN applicant_profile_id SET NOT NULL,
ALTER COLUMN applicant_profile_type SET NOT NULL;

-- Rename offer_id to collab_opportunity_id
ALTER TABLE public.applications 
RENAME COLUMN offer_id TO collab_opportunity_id;

-- Update foreign key constraint
ALTER TABLE public.applications 
DROP CONSTRAINT applications_offer_id_fkey;

ALTER TABLE public.applications 
ADD CONSTRAINT applications_collab_opportunity_id_fkey 
FOREIGN KEY (collab_opportunity_id) REFERENCES public.collab_opportunities(id) ON DELETE CASCADE;

-- Add foreign key for applicant_profile_id
ALTER TABLE public.applications
ADD CONSTRAINT applications_applicant_profile_id_fkey 
FOREIGN KEY (applicant_profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Phase 3: Update collaborations table
ALTER TABLE public.collaborations 
ADD COLUMN creator_profile_id UUID,
ADD COLUMN applicant_profile_id UUID,
ADD COLUMN collab_opportunity_id UUID;

-- Migrate existing data
UPDATE public.collaborations 
SET 
  creator_profile_id = business_profile_id,
  applicant_profile_id = community_profile_id,
  collab_opportunity_id = offer_id;

-- Make new columns NOT NULL
ALTER TABLE public.collaborations 
ALTER COLUMN creator_profile_id SET NOT NULL,
ALTER COLUMN applicant_profile_id SET NOT NULL,
ALTER COLUMN collab_opportunity_id SET NOT NULL;

-- Update foreign key constraints
ALTER TABLE public.collaborations 
DROP CONSTRAINT collaborations_offer_id_fkey;

ALTER TABLE public.collaborations 
ADD CONSTRAINT collaborations_collab_opportunity_id_fkey 
FOREIGN KEY (collab_opportunity_id) REFERENCES public.collab_opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.collaborations
ADD CONSTRAINT collaborations_creator_profile_id_fkey 
FOREIGN KEY (creator_profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.collaborations
ADD CONSTRAINT collaborations_applicant_profile_id_fkey 
FOREIGN KEY (applicant_profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Phase 4: Create neutral helper functions
CREATE OR REPLACE FUNCTION public.is_creator_of_opportunity(opportunity_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.collab_opportunities co
    JOIN public.profiles p ON co.creator_profile_id = p.id
    WHERE co.id = opportunity_id AND p.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_applicant_of_application(application_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.profiles p ON a.applicant_profile_id = p.id
    WHERE a.id = application_id AND p.user_id = auth.uid()
  );
$$;

-- Update is_participant_of_collaboration to use new fields
CREATE OR REPLACE FUNCTION public.is_participant_of_collaboration(collaboration_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.collaborations c
    JOIN public.profiles p ON (c.creator_profile_id = p.id OR c.applicant_profile_id = p.id)
    WHERE c.id = collaboration_id AND p.user_id = auth.uid()
  );
$$;

-- Update accept_application function
CREATE OR REPLACE FUNCTION public.accept_application(p_application_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    v_opportunity_id UUID;
    v_creator_profile_id UUID;
    v_applicant_profile_id UUID;
    v_collaboration_id UUID;
    v_actor_profile_id UUID;
    v_creator_type TEXT;
BEGIN
    -- Get application details and lock the row
    SELECT a.collab_opportunity_id, a.applicant_profile_id, co.creator_profile_id, co.creator_profile_type
    INTO v_opportunity_id, v_applicant_profile_id, v_creator_profile_id, v_creator_type
    FROM public.applications a
    JOIN public.collab_opportunities co ON a.collab_opportunity_id = co.id
    WHERE a.id = p_application_id AND a.status = 'pending'
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found or not in pending status';
    END IF;
    
    -- Get the actor (should be opportunity creator)
    SELECT public.get_current_profile_id() INTO v_actor_profile_id;
    
    -- Check if user is authorized to accept (opportunity creator)
    IF NOT public.is_creator_of_opportunity(v_opportunity_id) THEN
        RAISE EXCEPTION 'Not authorized to accept this application';
    END IF;
    
    -- Create collaboration with both new and old fields for backwards compatibility
    INSERT INTO public.collaborations (
        collab_opportunity_id, application_id, creator_profile_id, applicant_profile_id,
        business_profile_id, community_profile_id, offer_id
    ) VALUES (
        v_opportunity_id, p_application_id, v_creator_profile_id, v_applicant_profile_id,
        CASE WHEN v_creator_type = 'business' THEN v_creator_profile_id ELSE v_applicant_profile_id END,
        CASE WHEN v_creator_type = 'community' THEN v_creator_profile_id ELSE v_applicant_profile_id END,
        v_opportunity_id
    ) RETURNING id INTO v_collaboration_id;
    
    -- Accept the application
    UPDATE public.applications 
    SET status = 'accepted', updated_at = now()
    WHERE id = p_application_id;
    
    -- Close the opportunity
    UPDATE public.collab_opportunities 
    SET status = 'closed', updated_at = now()
    WHERE id = v_opportunity_id;
    
    -- Decline all other applications for this opportunity
    UPDATE public.applications 
    SET status = 'declined', updated_at = now()
    WHERE collab_opportunity_id = v_opportunity_id AND id != p_application_id AND status = 'pending';
    
    -- Create analytics events
    PERFORM public.create_analytics_event(
        v_actor_profile_id, 
        'application_accepted',
        jsonb_build_object('application_id', p_application_id, 'collaboration_id', v_collaboration_id)
    );
    
    -- Analytics for declined applications
    INSERT INTO public.analytics_events (actor_profile_id, event_type, payload)
    SELECT v_actor_profile_id, 'application_declined', jsonb_build_object('application_id', id)
    FROM public.applications 
    WHERE collab_opportunity_id = v_opportunity_id AND id != p_application_id AND status = 'declined';
    
    RETURN v_collaboration_id;
END;
$$;

-- Phase 5: Update RLS policies for collab_opportunities
DROP POLICY IF EXISTS offers_business_owner_read ON public.collab_opportunities;
DROP POLICY IF EXISTS offers_owner_write ON public.collab_opportunities;
DROP POLICY IF EXISTS offers_owner_insert ON public.collab_opportunities;
DROP POLICY IF EXISTS offers_community_read_published ON public.collab_opportunities;
DROP POLICY IF EXISTS offers_community_read_all ON public.collab_opportunities;
DROP POLICY IF EXISTS offers_collaboration_participants_read ON public.collab_opportunities;

CREATE POLICY collab_opportunities_creator_read 
ON public.collab_opportunities FOR SELECT 
USING (is_creator_of_opportunity(id));

CREATE POLICY collab_opportunities_creator_write 
ON public.collab_opportunities FOR ALL 
USING (is_creator_of_opportunity(id) OR creator_profile_id = get_current_profile_id());

CREATE POLICY collab_opportunities_published_read 
ON public.collab_opportunities FOR SELECT 
USING (status = 'published');

CREATE POLICY collab_opportunities_participants_read 
ON public.collab_opportunities FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM collaborations c
    JOIN profiles p ON (c.creator_profile_id = p.id OR c.applicant_profile_id = p.id)
    WHERE c.collab_opportunity_id = collab_opportunities.id AND p.user_id = auth.uid()
  )
);

-- Update RLS policies for applications
DROP POLICY IF EXISTS applications_business_read ON public.applications;
DROP POLICY IF EXISTS applications_community_read ON public.applications;
DROP POLICY IF EXISTS applications_community_write ON public.applications;
DROP POLICY IF EXISTS applications_community_delete ON public.applications;
DROP POLICY IF EXISTS applications_status_update ON public.applications;

CREATE POLICY applications_creator_read 
ON public.applications FOR SELECT 
USING (is_creator_of_opportunity(collab_opportunity_id));

CREATE POLICY applications_applicant_read 
ON public.applications FOR SELECT 
USING (is_applicant_of_application(id));

CREATE POLICY applications_applicant_write 
ON public.applications FOR INSERT 
WITH CHECK (
  applicant_profile_id = get_current_profile_id() 
  AND EXISTS (
    SELECT 1 FROM collab_opportunities 
    WHERE id = applications.collab_opportunity_id 
    AND status = 'published'
    AND creator_profile_id != get_current_profile_id()
  )
);

CREATE POLICY applications_applicant_delete 
ON public.applications FOR DELETE 
USING (is_applicant_of_application(id));

CREATE POLICY applications_status_update 
ON public.applications FOR UPDATE 
USING (
  (is_creator_of_opportunity(collab_opportunity_id) 
   AND status IN ('accepted', 'declined')) 
  OR 
  (is_applicant_of_application(id) 
   AND status = 'withdrawn')
);

-- Phase 6: Update subscription check trigger
CREATE OR REPLACE FUNCTION public.check_subscription_for_publish()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $$
DECLARE
  v_creator_type TEXT;
BEGIN
    IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
        -- Only check subscription for business creators
        IF NEW.creator_profile_type = 'business' THEN
            IF NOT EXISTS (
                SELECT 1
                FROM public.business_subscriptions bs
                WHERE bs.id = NEW.creator_profile_id
                  AND bs.subscription_status = 'active'
            ) THEN
                RAISE EXCEPTION 'Cannot publish opportunity: subscription is not active';
            END IF;
        END IF;

        -- Set published_at timestamp
        NEW.published_at = now();

        -- Create analytics event
        PERFORM public.create_analytics_event(
            NEW.creator_profile_id,
            'offer_published',
            jsonb_build_object('opportunity_id', NEW.id)
        );
    END IF;

    RETURN NEW;
END;
$$;