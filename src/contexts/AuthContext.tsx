import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  email?: string;
  phone_number?: string;
  user_type: 'business' | 'community';
  created_at: string;
  updated_at: string;
  // Extended profile fields
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

      if (session?.user) {
        // Give database triggers time to complete, then fetch profile
        setTimeout(() => fetchProfile(session.user!.id), 200);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(() => fetchProfile(session.user!.id), 200);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      // Get base profile first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError || !profileData) {
        console.error('Error fetching base profile:', profileError);
        return null;
      }

      // Cast profileData to include user_type
      const typedProfileData = profileData as any;

      // Now get the extended profile data based on user_type
      let extendedData = {};
      
      if (typedProfileData.user_type === 'business') {
        const businessQuery = await (supabase as any)
          .from('business_profiles')
          .select('*')
          .eq('profile_id', typedProfileData.id)
          .maybeSingle();
        
        const businessData = businessQuery.data;
        
        if (businessData) {
          extendedData = {
            name: businessData.name,
            city: businessData.city,
            profile_photo: businessData.profile_photo,
            website: businessData.website,
            instagram: businessData.instagram,
            business_type: businessData.business_type,
          };
        }
      } else if (typedProfileData.user_type === 'community') {
        const communityQuery = await (supabase as any)
          .from('community_profiles')
          .select('*')
          .eq('profile_id', typedProfileData.id)
          .maybeSingle();
        
        const communityData = communityQuery.data;
        
        if (communityData) {
          extendedData = {
            name: communityData.name,
            city: communityData.city,
            profile_photo: communityData.profile_photo,
            website: communityData.website,
            instagram: communityData.instagram,
            tiktok: communityData.tiktok,
            community_type: communityData.community_type,
          };
        }
      }

      const profile: Profile = {
        ...typedProfileData,
        ...extendedData,
        user_type: typedProfileData.user_type as 'business' | 'community',
      };

      setProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const signUp = async (email: string, password: string, type: 'business' | 'community', displayName: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { 
            type: type,
            display_name: displayName 
          }
        }
      });

      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link. Please check your email to complete registration.",
        });
      }

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
      
      if (error) {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Signin error:', error);
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
    setSession(null);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) {
      return { error: new Error('No user or profile loaded') };
    }

    try {
      // Separate updates for base profile and extended profile
      const baseProfileUpdates: any = {};
      const extendedProfileUpdates: any = {};

      // Base profile fields
      if (updates.email !== undefined) baseProfileUpdates.email = updates.email;
      if (updates.phone_number !== undefined) baseProfileUpdates.phone_number = updates.phone_number;

      // Extended profile fields
      if (updates.name !== undefined) extendedProfileUpdates.name = updates.name;
      if (updates.city !== undefined) extendedProfileUpdates.city = updates.city;
      if (updates.profile_photo !== undefined) extendedProfileUpdates.profile_photo = updates.profile_photo;
      if (updates.website !== undefined) extendedProfileUpdates.website = updates.website;
      if (updates.instagram !== undefined) extendedProfileUpdates.instagram = updates.instagram;
      if (updates.tiktok !== undefined) extendedProfileUpdates.tiktok = updates.tiktok;
      if (updates.business_type !== undefined) extendedProfileUpdates.business_type = updates.business_type;
      if (updates.community_type !== undefined) extendedProfileUpdates.community_type = updates.community_type;

      // Update base profile if needed
      if (Object.keys(baseProfileUpdates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(baseProfileUpdates)
          .eq('user_id', user.id);
          
        if (error) return { error };
      }

      // Update extended profile if needed
      if (Object.keys(extendedProfileUpdates).length > 0) {
        const table = profile.user_type === 'business' ? 'business_profiles' : 'community_profiles';
        const { error } = await supabase
          .from(table as any)
          .update(extendedProfileUpdates)
          .eq('profile_id', profile.id);
          
        if (error) return { error };
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Error",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      loading, 
      signUp, 
      signIn, 
      signOut, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};