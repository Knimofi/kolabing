import { supabase } from '@/integrations/supabase/client';

export interface PublicBusinessProfile {
  id: string;
  name: string | null;
  business_type: string | null;
  city: string | null;
  profile_photo: string | null;
  website: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicCommunityProfile {
  id: string;
  name: string | null;
  community_type: string | null;
  city: string | null;
  profile_photo: string | null;
  website: string | null;
  instagram: string | null;
  tiktok: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessSubscription {
  id: string;
  subscription_status: 'active' | 'past_due' | 'inactive' | 'cancelled' | null;
  billing_info: any;
}

/**
 * Fetch public business profile data
 */
export async function getBusinessProfile(profileId: string): Promise<PublicBusinessProfile | null> {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('id', profileId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching business profile:', error);
    return null;
  }

  return data;
}

/**
 * Fetch public community profile data
 */
export async function getCommunityProfile(profileId: string): Promise<PublicCommunityProfile | null> {
  const { data, error } = await supabase
    .from('community_profiles')
    .select('*')
    .eq('id', profileId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching community profile:', error);
    return null;
  }

  return data;
}

/**
 * Fetch multiple business profiles (for listings, directories, etc.)
 */
export async function getBusinessProfiles(limit = 10, offset = 0): Promise<PublicBusinessProfile[]> {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching business profiles:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch multiple community profiles (for listings, directories, etc.)
 */
export async function getCommunityProfiles(limit = 10, offset = 0): Promise<PublicCommunityProfile[]> {
  const { data, error } = await supabase
    .from('community_profiles')
    .select('*')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching community profiles:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch business subscription data (private - only for the business owner)
 */
export async function getBusinessSubscription(businessProfileId: string): Promise<BusinessSubscription | null> {
  const { data, error } = await supabase
    .from('business_subscriptions')
    .select('*')
    .eq('id', businessProfileId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching business subscription:', error);
    return null;
  }

  return data;
}

/**
 * Update business profile public data
 */
export async function updateBusinessProfile(profileId: string, updates: Partial<PublicBusinessProfile>) {
  const { error } = await supabase
    .from('business_profiles')
    .update(updates)
    .eq('id', profileId);

  if (error) {
    console.error('Error updating business profile:', error);
    return { error };
  }

  return { error: null };
}

/**
 * Update community profile public data
 */
export async function updateCommunityProfile(profileId: string, updates: Partial<PublicCommunityProfile>) {
  const { error } = await supabase
    .from('community_profiles')
    .update(updates)
    .eq('id', profileId);

  if (error) {
    console.error('Error updating community profile:', error);
    return { error };
  }

  return { error: null };
}

/**
 * Update business subscription data (private)
 */
export async function updateBusinessSubscription(businessProfileId: string, updates: Partial<BusinessSubscription>) {
  const { error } = await supabase
    .from('business_subscriptions')
    .update(updates)
    .eq('id', businessProfileId);

  if (error) {
    console.error('Error updating business subscription:', error);
    return { error };
  }

  return { error: null };
}