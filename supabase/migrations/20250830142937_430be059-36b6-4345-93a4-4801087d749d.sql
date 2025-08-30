-- Drop existing RLS policies
DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.profiles;
DROP POLICY IF EXISTS "profile_owner_insert" ON public.profiles;
DROP POLICY IF EXISTS "profile_owner_select" ON public.profiles;
DROP POLICY IF EXISTS "profile_owner_update" ON public.profiles;

DROP POLICY IF EXISTS "business_owner_insert" ON public.business_profiles;
DROP POLICY IF EXISTS "business_owner_select" ON public.business_profiles;
DROP POLICY IF EXISTS "business_owner_update" ON public.business_profiles;

DROP POLICY IF EXISTS "community_owner_select" ON public.community_profiles;
DROP POLICY IF EXISTS "community_profiles_owner_insert" ON public.community_profiles;
DROP POLICY IF EXISTS "community_profiles_owner_write" ON public.community_profiles;

-- Drop existing tables (this will cascade to related tables)
DROP TABLE IF EXISTS public.business_profiles CASCADE;
DROP TABLE IF EXISTS public.community_profiles CASCADE; 
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table (core + private)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create business_profiles table (public + business-only private)
CREATE TABLE public.business_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_type TEXT,
    name TEXT,
    city TEXT,
    instagram TEXT,
    website TEXT,
    profile_photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_subscriptions table (private)
CREATE TABLE public.business_subscriptions (
    id UUID PRIMARY KEY REFERENCES public.business_profiles(id) ON DELETE CASCADE,
    billing_info JSONB DEFAULT '{}',
    subscription_status subscription_status DEFAULT 'inactive'
);

-- Create community_profiles table (public only)
CREATE TABLE public.community_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    community_type TEXT,
    name TEXT,
    city TEXT,
    instagram TEXT,
    website TEXT,
    tiktok TEXT,
    profile_photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_profiles ENABLE ROW LEVEL SECURITY;

-- Create updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_business_profiles_updated_at
    BEFORE UPDATE ON public.business_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_community_profiles_updated_at
    BEFORE UPDATE ON public.community_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Create helper function for profile ownership
CREATE OR REPLACE FUNCTION public.is_profile_owner_by_user_id(profile_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT profile_user_id = auth.uid();
$$;

-- RLS Policies for profiles table
-- Visible to all users, editable only by owner
CREATE POLICY "profiles_select_all" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- RLS Policies for business_profiles table
-- Visible to all, editable/insertable only by profile owner
CREATE POLICY "business_profiles_select_all" ON public.business_profiles
    FOR SELECT USING (true);

CREATE POLICY "business_profiles_insert_own" ON public.business_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = business_profiles.id 
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "business_profiles_update_own" ON public.business_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = business_profiles.id 
            AND profiles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = business_profiles.id 
            AND profiles.user_id = auth.uid()
        )
    );

-- RLS Policies for community_profiles table
-- Visible to all, editable/insertable only by profile owner
CREATE POLICY "community_profiles_select_all" ON public.community_profiles
    FOR SELECT USING (true);

CREATE POLICY "community_profiles_insert_own" ON public.community_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = community_profiles.id 
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "community_profiles_update_own" ON public.community_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = community_profiles.id 
            AND profiles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = community_profiles.id 
            AND profiles.user_id = auth.uid()
        )
    );

-- RLS Policies for business_subscriptions table
-- Only visible/editable to linked business profile owner
CREATE POLICY "business_subscriptions_owner_only" ON public.business_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = business_subscriptions.id 
            AND profiles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = business_subscriptions.id 
            AND profiles.user_id = auth.uid()
        )
    );