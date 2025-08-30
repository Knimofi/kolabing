import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  // Private profile data
  id: string;
  user_id: string;
  email?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
  // Derived data
  type: 'business' | 'community';
  // Public profile data (from business_profiles or community_profiles)
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch with setTimeout to prevent auth state change deadlock
          setTimeout(async () => {
            await fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          await fetchProfile(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // First get the basic profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      // Try to get business profile data
      const { data: businessData } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', profileData.id)
        .maybeSingle();

      // Try to get community profile data  
      const { data: communityData } = await supabase
        .from('community_profiles')
        .select('*')
        .eq('id', profileData.id)
        .maybeSingle();

      // Determine profile type and combine data
      let profile: Profile;
      if (businessData) {
        profile = {
          ...profileData,
          type: 'business',
          name: businessData.name,
          city: businessData.city,
          profile_photo: businessData.profile_photo,
          website: businessData.website,
          instagram: businessData.instagram,
          business_type: businessData.business_type
        };
      } else if (communityData) {
        profile = {
          ...profileData,
          type: 'community',
          name: communityData.name,
          city: communityData.city,
          profile_photo: communityData.profile_photo,
          website: communityData.website,
          instagram: communityData.instagram,
          tiktok: communityData.tiktok,
          community_type: communityData.community_type
        };
      } else {
        console.error('No business or community profile found for user');
        return;
      }

      setProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, type: 'business' | 'community', displayName: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      console.log('Starting signup for:', email, 'type:', type);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName,
            type: type
          }
        }
      });

      if (error) {
        console.error('Auth signup error:', error);
        return { error };
      }

      console.log('Auth signup successful, user ID:', data.user?.id);

      // Create profile if user was created
      if (data.user) {
        // Add delay to ensure user is fully created
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Creating profile for user:', data.user.id);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            user_id: data.user.id,
            email: email
          }])
          .select()
          .single();

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return { error: profileError };
        }

        console.log('Profile created successfully, ID:', profileData.id);

        // Create type-specific profile using the profile.id
        if (type === 'business') {
          console.log('Creating business profile for profile ID:', profileData.id);
          
          const { error: businessError } = await supabase
            .from('business_profiles')
            .insert([{
              id: profileData.id,
              name: displayName
            }]);
          
          if (businessError) {
            console.error('Error creating business profile:', businessError);
            return { error: businessError };
          }
          
          console.log('Business profile created successfully');
        } else {
          console.log('Creating community profile for profile ID:', profileData.id);
          
          const { error: communityError } = await supabase
            .from('community_profiles')
            .insert([{
              id: profileData.id,
              name: displayName
            }]);
          
          if (communityError) {
            console.error('Error creating community profile:', communityError);
            return { error: communityError };
          }
          
          console.log('Community profile created successfully');
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Signup catch error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
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
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: new Error('No user logged in or profile not loaded') };

    try {
      // Separate private and public updates
      const privateUpdates: any = {};
      const publicUpdates: any = {};

      // Private fields go to profiles table
      if (updates.email !== undefined) privateUpdates.email = updates.email;
      if (updates.phone_number !== undefined) privateUpdates.phone_number = updates.phone_number;

      // Public fields go to type-specific table
      if (updates.name !== undefined) publicUpdates.name = updates.name;
      if (updates.city !== undefined) publicUpdates.city = updates.city;
      if (updates.profile_photo !== undefined) publicUpdates.profile_photo = updates.profile_photo;
      if (updates.website !== undefined) publicUpdates.website = updates.website;
      if (updates.instagram !== undefined) publicUpdates.instagram = updates.instagram;
      if (updates.tiktok !== undefined) publicUpdates.tiktok = updates.tiktok;
      if (updates.business_type !== undefined) publicUpdates.business_type = updates.business_type;
      if (updates.community_type !== undefined) publicUpdates.community_type = updates.community_type;

      // Update private profile if needed
      if (Object.keys(privateUpdates).length > 0) {
        const { error: privateError } = await supabase
          .from('profiles')
          .update(privateUpdates)
          .eq('user_id', user.id);

        if (privateError) return { error: privateError };
      }

      // Update public profile if needed
      if (Object.keys(publicUpdates).length > 0) {
        const tableName = profile.type === 'business' ? 'business_profiles' : 'community_profiles';
        const { error: publicError } = await supabase
          .from(tableName)
          .update(publicUpdates)
          .eq('id', profile.id);

        if (publicError) return { error: publicError };
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};