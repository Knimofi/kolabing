import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ensureUserProvisioned } from '@/lib/auth-provisioning';

interface Profile {
  id: string;
  user_id: string;
  email?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
  type: 'business' | 'community';
  name?: string;
  city?: string;
  profile_photo?: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  business_type?: string;
  community_type?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, type: 'business' | 'community', displayName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) setTimeout(() => provisionThenFetch(session.user!), 0);
      else setProfile(null);

      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) setTimeout(() => provisionThenFetch(session.user!), 0);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!profileData) return console.log('No profile found');

      const { data: businessData } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', profileData.id)
        .maybeSingle();

      const { data: communityData } = await supabase
        .from('community_profiles')
        .select('*')
        .eq('id', profileData.id)
        .maybeSingle();

      let profile: Profile;
      if (businessData) {
        profile = { ...profileData, type: 'business', ...businessData };
      } else if (communityData) {
        profile = { ...profileData, type: 'community', ...communityData };
      } else return console.error('No business or community profile found');

      setProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const provisionThenFetch = async (userObj: User) => {
    try {
      await ensureUserProvisioned(userObj);
    } catch (e) {
      console.error('Provisioning error:', e);
    }
    await fetchProfile(userObj.id);
  };

  const signUp = async (email: string, password: string, type: 'business' | 'community', displayName: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { display_name: displayName, type }
        }
      });
      return { error };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: new Error('No user or profile loaded') };

    try {
      const privateUpdates: any = {};
      const publicUpdates: any = {};

      if (updates.email !== undefined) privateUpdates.email = updates.email;
      if (updates.phone_number !== undefined) privateUpdates.phone_number = updates.phone_number;
      if (updates.name !== undefined) publicUpdates.name = updates.name;
      if (updates.city !== undefined) publicUpdates.city = updates.city;
      if (updates.profile_photo !== undefined) publicUpdates.profile_photo = updates.profile_photo;
      if (updates.website !== undefined) publicUpdates.website = updates.website;
      if (updates.instagram !== undefined) publicUpdates.instagram = updates.instagram;
      if (updates.tiktok !== undefined) publicUpdates.tiktok = updates.tiktok;
      if (updates.business_type !== undefined) publicUpdates.business_type = updates.business_type;
      if (updates.community_type !== undefined) publicUpdates.community_type = updates.community_type;

      if (Object.keys(privateUpdates).length) {
        const { error } = await supabase.from('profiles').update(privateUpdates).eq('user_id', user.id);
        if (error) return { error };
      }

      if (Object.keys(publicUpdates).length) {
        const table = profile.type === 'business' ? 'business_profiles' : 'community_profiles';
        const { error } = await supabase.from(table).update(publicUpdates).eq('id', profile.id);
        if (error) return { error };
      }

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
