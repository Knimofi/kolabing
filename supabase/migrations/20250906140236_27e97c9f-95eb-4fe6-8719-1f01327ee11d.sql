-- Update the accept_application function to also set offer status to 'closed'
CREATE OR REPLACE FUNCTION public.accept_application(p_application_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
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
    
    -- Close the offer (new logic)
    UPDATE public.offers 
    SET status = 'closed', updated_at = now()
    WHERE id = v_offer_id;
    
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
$function$;