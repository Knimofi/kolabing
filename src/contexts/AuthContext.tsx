-- 1. First, handle the foreign key dependencies
-- Drop the dependent constraint temporarily
ALTER TABLE business_subscriptions DROP CONSTRAINT IF EXISTS business_subscriptions_id_fkey;

-- Now we can safely modify the business_profiles table
ALTER TABLE business_profiles DROP CONSTRAINT IF EXISTS business_profiles_pkey;
ALTER TABLE community_profiles DROP CONSTRAINT IF EXISTS community_profiles_pkey;

-- Rename id to profile_id to match your trigger functions
ALTER TABLE business_profiles RENAME COLUMN id TO profile_id;
ALTER TABLE community_profiles RENAME COLUMN id TO profile_id;

-- Add proper foreign key constraints
ALTER TABLE business_profiles 
ADD CONSTRAINT business_profiles_pkey PRIMARY KEY (profile_id),
ADD CONSTRAINT business_profiles_profile_id_fkey 
FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE community_profiles 
ADD CONSTRAINT community_profiles_pkey PRIMARY KEY (profile_id),
ADD CONSTRAINT community_profiles_profile_id_fkey 
FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Recreate the business_subscriptions foreign key with the new column name
ALTER TABLE business_subscriptions 
ADD CONSTRAINT business_subscriptions_profile_id_fkey 
FOREIGN KEY (id) REFERENCES business_profiles(profile_id) ON DELETE CASCADE;

-- 2. Update the handle_new_user function to process signup metadata properly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_type_value text;
    display_name_value text;
    profile_id uuid;
BEGIN
    -- Extract user_type and display_name from raw_user_meta_data
    user_type_value := COALESCE(NEW.raw_user_meta_data->>'type', 'business');
    display_name_value := COALESCE(NEW.raw_user_meta_data->>'display_name', '');

    -- Insert into profiles with user_type
    INSERT INTO public.profiles (id, user_id, email, user_type, created_at, updated_at)
    VALUES (gen_random_uuid(), NEW.id, NEW.email, user_type_value, now(), now())
    RETURNING id INTO profile_id;
    
    -- The handle_new_profile_extensions trigger will handle creating the extension tables
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update the profile extension trigger to work with the correct column names
CREATE OR REPLACE FUNCTION handle_new_profile_extensions()
RETURNS trigger AS $$
DECLARE
    display_name_value text;
BEGIN
    -- Get display_name from the user's metadata (if available)
    SELECT COALESCE(u.raw_user_meta_data->>'display_name', '') INTO display_name_value
    FROM auth.users u 
    WHERE u.id = NEW.user_id;

    IF NEW.user_type = 'business' THEN
        INSERT INTO public.business_profiles (profile_id, name)
        VALUES (NEW.id, display_name_value);
    ELSIF NEW.user_type = 'community' THEN
        INSERT INTO public.community_profiles (profile_id, name)
        VALUES (NEW.id, display_name_value);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update constraint functions to work with new schema
CREATE OR REPLACE FUNCTION enforce_business_profile_constraint()
RETURNS trigger AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = NEW.profile_id AND user_type = 'business'
    ) THEN
        RAISE EXCEPTION 'business_profiles can only be created for profiles with user_type=business';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION enforce_community_profile_constraint()
RETURNS trigger AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = NEW.profile_id AND user_type = 'community'
    ) THEN
        RAISE EXCEPTION 'community_profiles can only be created for profiles with user_type=community';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Add constraint triggers (if they don't exist)
DROP TRIGGER IF EXISTS enforce_business_constraint ON business_profiles;
CREATE TRIGGER enforce_business_constraint
    BEFORE INSERT ON business_profiles
    FOR EACH ROW EXECUTE FUNCTION enforce_business_profile_constraint();

DROP TRIGGER IF EXISTS enforce_community_constraint ON community_profiles;
CREATE TRIGGER enforce_community_constraint
    BEFORE INSERT ON community_profiles
    FOR EACH ROW EXECUTE FUNCTION enforce_community_profile_constraint();
