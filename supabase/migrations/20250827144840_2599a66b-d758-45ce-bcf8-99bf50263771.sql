-- Kolabing Marketplace Database Schema
-- Two-sided marketplace connecting Businesses with Communities

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type AS ENUM ('business', 'community');
CREATE TYPE offer_status AS ENUM ('draft', 'published', 'closed', 'completed');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'declined', 'withdrawn');
CREATE TYPE collaboration_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'inactive', 'cancelled');
CREATE TYPE collaboration_goal AS ENUM ('brand_awareness', 'lead_generation', 'content_creation', 'event_partnership', 'product_promotion');
CREATE TYPE event_type AS ENUM ('offer_created', 'offer_published', 'application_submitted', 'application_accepted', 'application_declined', 'collaboration_completed', 'survey_submitted', 'review_submitted');

-- Main profiles table (unified for all users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type user_type NOT NULL,
    display_name TEXT NOT NULL,
    bio TEXT,
    contact_info JSONB DEFAULT '{}', -- {email, phone, etc}
    city TEXT,
    profile_photo TEXT, -- URL to photo
    social_links JSONB DEFAULT '{}', -- {instagram, linkedin, website, etc}
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Business-specific profile data
CREATE TABLE public.business_profiles (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_type TEXT,
    billing_info JSONB DEFAULT '{}', -- Masked billing reference
    subscription_status subscription_status DEFAULT 'inactive',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Community-specific profile data  
CREATE TABLE public.community_profiles (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    community_type TEXT,
    members_estimate INTEGER,
    additional_links JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscription records for billing reconciliation
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_profile_id UUID NOT NULL REFERENCES public.business_profiles(profile_id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    status subscription_status NOT NULL DEFAULT 'inactive',
    billing_period_start TIMESTAMPTZ,
    billing_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Offers created by businesses
CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_profile_id UUID NOT NULL REFERENCES public.business_profiles(profile_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    categories JSONB DEFAULT '[]', -- Array of category tags
    availability_start TIMESTAMPTZ,
    availability_end TIMESTAMPTZ,
    collaboration_goal collaboration_goal NOT NULL,
    address TEXT, -- Physical location if needed
    no_venue BOOLEAN DEFAULT false, -- True for virtual/online collaborations
    business_offer JSONB NOT NULL DEFAULT '{}', -- {perks, discounts, commission, etc}
    community_deliverables JSONB NOT NULL DEFAULT '{}', -- Expected deliverables
    status offer_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Applications from communities to offers
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
    community_profile_id UUID NOT NULL REFERENCES public.community_profiles(profile_id) ON DELETE CASCADE,
    message TEXT,
    status application_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(offer_id, community_profile_id) -- One application per community per offer
);

-- Collaborations (accepted applications)
CREATE TABLE public.collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE RESTRICT,
    application_id UUID UNIQUE NOT NULL REFERENCES public.applications(id) ON DELETE RESTRICT,
    business_profile_id UUID NOT NULL REFERENCES public.business_profiles(profile_id) ON DELETE RESTRICT,
    community_profile_id UUID NOT NULL REFERENCES public.community_profiles(profile_id) ON DELETE RESTRICT,
    status collaboration_status NOT NULL DEFAULT 'scheduled',
    scheduled_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Post-collaboration surveys
CREATE TABLE public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
    filled_by_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '{}',
    score NUMERIC CHECK (score >= 1 AND score <= 5),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(collaboration_id, filled_by_profile_id) -- One survey per participant per collaboration
);

-- Public reviews between participants
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
    reviewer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(collaboration_id, reviewer_profile_id, reviewee_profile_id)
);

-- Analytics events (immutable event stream)
CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type event_type NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_type ON public.profiles(type);
CREATE INDEX idx_offers_status ON public.offers(status);
CREATE INDEX idx_offers_business_profile ON public.offers(business_profile_id);
CREATE INDEX idx_offers_availability ON public.offers(availability_start, availability_end);
CREATE INDEX idx_offers_categories_gin ON public.offers USING GIN(categories);
CREATE INDEX idx_offers_business_offer_gin ON public.offers USING GIN(business_offer);
CREATE INDEX idx_offers_community_deliverables_gin ON public.offers USING GIN(community_deliverables);
CREATE INDEX idx_offers_title_description_fts ON public.offers USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_applications_offer_status ON public.applications(offer_id, status);
CREATE INDEX idx_applications_community ON public.applications(community_profile_id);
CREATE INDEX idx_collaborations_business ON public.collaborations(business_profile_id);
CREATE INDEX idx_collaborations_community ON public.collaborations(community_profile_id);
CREATE INDEX idx_collaborations_status ON public.collaborations(status);
CREATE INDEX idx_analytics_events_type_occurred ON public.analytics_events(event_type, occurred_at);
CREATE INDEX idx_analytics_events_actor ON public.analytics_events(actor_profile_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS policies
CREATE OR REPLACE FUNCTION public.get_current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = profile_id AND user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_business_owner_of_offer(offer_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.offers o
    JOIN public.business_profiles bp ON o.business_profile_id = bp.profile_id
    JOIN public.profiles p ON bp.profile_id = p.id
    WHERE o.id = offer_id AND p.user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_community_of_application(application_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.community_profiles cp ON a.community_profile_id = cp.profile_id
    JOIN public.profiles p ON cp.profile_id = p.id
    WHERE a.id = application_id AND p.user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_participant_of_collaboration(collaboration_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.collaborations c
    JOIN public.profiles bp ON c.business_profile_id = bp.id AND bp.user_id = auth.uid()
    UNION ALL
    SELECT 1 FROM public.collaborations c
    JOIN public.profiles cp ON c.community_profile_id = cp.id AND cp.user_id = auth.uid()
    WHERE c.id = collaboration_id
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies

-- Profiles: Public info visible to all, private info only to owner
CREATE POLICY "profiles_public_read" ON public.profiles
  FOR SELECT USING (true); -- Public fields handled in application layer

CREATE POLICY "profiles_owner_full_access" ON public.profiles
  FOR ALL USING (user_id = auth.uid());

-- Business profiles: Public business info visible, sensitive billing only to owner
CREATE POLICY "business_profiles_public_read" ON public.business_profiles
  FOR SELECT USING (true); -- Sensitive fields filtered in application layer

CREATE POLICY "business_profiles_owner_write" ON public.business_profiles
  FOR ALL USING (public.is_profile_owner(profile_id));

-- Community profiles: Similar to business profiles
CREATE POLICY "community_profiles_public_read" ON public.community_profiles
  FOR SELECT USING (true);

CREATE POLICY "community_profiles_owner_write" ON public.community_profiles
  FOR ALL USING (public.is_profile_owner(profile_id));

-- Subscriptions: Only owner and system can access
CREATE POLICY "subscriptions_owner_read" ON public.subscriptions
  FOR SELECT USING (public.is_profile_owner(business_profile_id));

CREATE POLICY "subscriptions_system_write" ON public.subscriptions
  FOR ALL USING (false); -- Only system functions can modify

-- Offers: Published offers public, drafts only to owner
CREATE POLICY "offers_published_read" ON public.offers
  FOR SELECT USING (status = 'published' OR public.is_business_owner_of_offer(id));

CREATE POLICY "offers_owner_write" ON public.offers
  FOR ALL USING (public.is_business_owner_of_offer(id) OR business_profile_id = public.get_current_profile_id());

-- Applications: Business sees theirs, community sees theirs
CREATE POLICY "applications_business_read" ON public.applications
  FOR SELECT USING (public.is_business_owner_of_offer(offer_id));

CREATE POLICY "applications_community_read" ON public.applications
  FOR SELECT USING (public.is_community_of_application(id));

CREATE POLICY "applications_community_write" ON public.applications
  FOR INSERT WITH CHECK (community_profile_id = public.get_current_profile_id());

CREATE POLICY "applications_status_update" ON public.applications
  FOR UPDATE USING (
    (public.is_business_owner_of_offer(offer_id) AND status IN ('accepted', 'declined')) OR
    (public.is_community_of_application(id) AND status = 'withdrawn')
  );

-- Collaborations: Only participants can access
CREATE POLICY "collaborations_participants_access" ON public.collaborations
  FOR ALL USING (public.is_participant_of_collaboration(id));

-- Surveys: Only collaboration participants can submit/view
CREATE POLICY "surveys_participants_access" ON public.surveys
  FOR ALL USING (public.is_participant_of_collaboration(collaboration_id));

-- Reviews: Participants can create, public can read
CREATE POLICY "reviews_public_read" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_participants_write" ON public.reviews
  FOR INSERT WITH CHECK (public.is_participant_of_collaboration(collaboration_id));

-- Analytics events: Read-only for owners, write via system
CREATE POLICY "analytics_events_owner_read" ON public.analytics_events
  FOR SELECT USING (actor_profile_id = public.get_current_profile_id());

CREATE POLICY "analytics_events_system_write" ON public.analytics_events
  FOR INSERT WITH CHECK (true); -- System can write events

-- Triggers and Functions

-- Update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER business_profiles_updated_at BEFORE UPDATE ON public.business_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER community_profiles_updated_at BEFORE UPDATE ON public.community_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER collaborations_updated_at BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Constraint enforcement: business_profiles only for business type
CREATE OR REPLACE FUNCTION public.enforce_business_profile_constraint()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = NEW.profile_id AND type = 'business'
    ) THEN
        RAISE EXCEPTION 'business_profiles can only be created for profiles with type=business';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER business_profiles_type_check 
    BEFORE INSERT ON public.business_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.enforce_business_profile_constraint();

-- Constraint enforcement: community_profiles only for community type
CREATE OR REPLACE FUNCTION public.enforce_community_profile_constraint()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = NEW.profile_id AND type = 'community'
    ) THEN
        RAISE EXCEPTION 'community_profiles can only be created for profiles with type=community';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER community_profiles_type_check 
    BEFORE INSERT ON public.community_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.enforce_community_profile_constraint();

-- Auto-create analytics events
CREATE OR REPLACE FUNCTION public.create_analytics_event(
    p_actor_profile_id UUID,
    p_event_type event_type,
    p_payload JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO public.analytics_events (actor_profile_id, event_type, payload)
    VALUES (p_actor_profile_id, p_event_type, p_payload)
    RETURNING id INTO event_id;
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Application acceptance workflow
CREATE OR REPLACE FUNCTION public.accept_application(p_application_id UUID)
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Offer publishing guard
CREATE OR REPLACE FUNCTION public.check_subscription_for_publish()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER offers_publish_guard 
    BEFORE UPDATE ON public.offers 
    FOR EACH ROW EXECUTE FUNCTION public.check_subscription_for_publish();