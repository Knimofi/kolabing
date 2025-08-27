-- Fix function search path security issues

-- Fix get_current_profile_id function
CREATE OR REPLACE FUNCTION public.get_current_profile_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Fix is_profile_owner function
CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = profile_id AND user_id = auth.uid()
  );
$$;

-- Fix is_business_owner_of_offer function
CREATE OR REPLACE FUNCTION public.is_business_owner_of_offer(offer_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.offers o
    JOIN public.business_profiles bp ON o.business_profile_id = bp.profile_id
    JOIN public.profiles p ON bp.profile_id = p.id
    WHERE o.id = offer_id AND p.user_id = auth.uid()
  );
$$;

-- Fix is_community_of_application function
CREATE OR REPLACE FUNCTION public.is_community_of_application(application_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.community_profiles cp ON a.community_profile_id = cp.profile_id
    JOIN public.profiles p ON cp.profile_id = p.id
    WHERE a.id = application_id AND p.user_id = auth.uid()
  );
$$;

-- Fix is_participant_of_collaboration function
CREATE OR REPLACE FUNCTION public.is_participant_of_collaboration(collaboration_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.collaborations c
    JOIN public.profiles bp ON c.business_profile_id = bp.id AND bp.user_id = auth.uid()
    UNION ALL
    SELECT 1 FROM public.collaborations c
    JOIN public.profiles cp ON c.community_profile_id = cp.id AND cp.user_id = auth.uid()
    WHERE c.id = collaboration_id
  );
$$;

-- Fix update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Fix enforce_business_profile_constraint function
CREATE OR REPLACE FUNCTION public.enforce_business_profile_constraint()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = NEW.profile_id AND type = 'business'
    ) THEN
        RAISE EXCEPTION 'business_profiles can only be created for profiles with type=business';
    END IF;
    RETURN NEW;
END;
$$;

-- Fix enforce_community_profile_constraint function
CREATE OR REPLACE FUNCTION public.enforce_community_profile_constraint()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = NEW.profile_id AND type = 'community'
    ) THEN
        RAISE EXCEPTION 'community_profiles can only be created for profiles with type=community';
    END IF;
    RETURN NEW;
END;
$$;

-- Fix create_analytics_event function
CREATE OR REPLACE FUNCTION public.create_analytics_event(
    p_actor_profile_id UUID,
    p_event_type event_type,
    p_payload JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO public.analytics_events (actor_profile_id, event_type, payload)
    VALUES (p_actor_profile_id, p_event_type, p_payload)
    RETURNING id INTO event_id;
    RETURN event_id;
END;
$$;

-- Fix accept_application function
CREATE OR REPLACE FUNCTION public.accept_application(p_application_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_offer_id UUID;
    v_business_profile_id UUID;
    v_community_profile_id UUID;
    v_collaboration_id UUID;
    v_actor_profile_id UUID;
BEGIN
    -- Get application details and lock the row
    SELECT a.offer_id, a.community_profile_id, o.business_profile_id
    INTO v_offer_id, v_community_profile_id, v_business_profile_id
    FROM public.applications a
    JOIN public.offers o ON a.offer_id = o.id
    WHERE a.id = p_application_id AND a.status = 'pending'
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found or not in pending status';
    END IF;
    
    -- Get the actor (should be business owner)
    SELECT public.get_current_profile_id() INTO v_actor_profile_id;
    
    -- Check if user is authorized to accept (business owner)
    IF NOT public.is_business_owner_of_offer(v_offer_id) THEN
        RAISE EXCEPTION 'Not authorized to accept this application';
    END IF;
    
    -- Create collaboration
    INSERT INTO public.collaborations (
        offer_id, application_id, business_profile_id, community_profile_id
    ) VALUES (
        v_offer_id, p_application_id, v_business_profile_id, v_community_profile_id
    ) RETURNING id INTO v_collaboration_id;
    
    -- Accept the application
    UPDATE public.applications 
    SET status = 'accepted', updated_at = now()
    WHERE id = p_application_id;
    
    -- Decline all other applications for this offer
    UPDATE public.applications 
    SET status = 'declined', updated_at = now()
    WHERE offer_id = v_offer_id AND id != p_application_id AND status = 'pending';
    
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
    WHERE offer_id = v_offer_id AND id != p_application_id AND status = 'declined';
    
    RETURN v_collaboration_id;
END;
$$;

-- Fix check_subscription_for_publish function
CREATE OR REPLACE FUNCTION public.check_subscription_for_publish()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NEW.status = 'published' AND OLD.status != 'published' THEN
        -- Check if business has active subscription
        IF NOT EXISTS (
            SELECT 1 FROM public.business_profiles bp
            WHERE bp.profile_id = NEW.business_profile_id 
            AND bp.subscription_status = 'active'
        ) THEN
            RAISE EXCEPTION 'Cannot publish offer: subscription is not active';
        END IF;
        
        -- Set published_at timestamp
        NEW.published_at = now();
        
        -- Create analytics event
        PERFORM public.create_analytics_event(
            NEW.business_profile_id,
            'offer_published',
            jsonb_build_object('offer_id', NEW.id)
        );
    END IF;
    
    RETURN NEW;
END;
$$;