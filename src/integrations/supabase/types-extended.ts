// Extended types to include tables missing from auto-generated types.ts
import type { Database as GeneratedDatabase, Json } from './types';

export type Database = GeneratedDatabase & {
  public: GeneratedDatabase['public'] & {
    Tables: GeneratedDatabase['public']['Tables'] & {
      business_profiles: {
        Row: {
          about: string | null;
          business_type: string | null;
          city: string | null;
          created_at: string;
          instagram: string | null;
          name: string | null;
          profile_id: string;
          profile_photo: string | null;
          updated_at: string;
          website: string | null;
        };
        Insert: {
          about?: string | null;
          business_type?: string | null;
          city?: string | null;
          created_at?: string;
          instagram?: string | null;
          name?: string | null;
          profile_id: string;
          profile_photo?: string | null;
          updated_at?: string;
          website?: string | null;
        };
        Update: {
          about?: string | null;
          business_type?: string | null;
          city?: string | null;
          created_at?: string;
          instagram?: string | null;
          name?: string | null;
          profile_id?: string;
          profile_photo?: string | null;
          updated_at?: string;
          website?: string | null;
        };
        Relationships: [];
      };

      business_subscriptions: {
        Row: {
          billing_info: Json | null;
          id: string;
          subscription_status: GeneratedDatabase['public']['Enums']['subscription_status'] | null;
        };
        Insert: {
          billing_info?: Json | null;
          id: string;
          subscription_status?: GeneratedDatabase['public']['Enums']['subscription_status'] | null;
        };
        Update: {
          billing_info?: Json | null;
          id?: string;
          subscription_status?: GeneratedDatabase['public']['Enums']['subscription_status'] | null;
        };
        Relationships: [];
      };

      community_profiles: {
        Row: {
          about: string | null;
          city: string | null;
          community_type: string | null;
          created_at: string;
          Featured: boolean;
          instagram: string | null;
          name: string | null;
          profile_id: string;
          profile_photo: string | null;
          tiktok: string | null;
          updated_at: string;
          website: string | null;
        };
        Insert: {
          about?: string | null;
          city?: string | null;
          community_type?: string | null;
          created_at?: string;
          Featured?: boolean;
          instagram?: string | null;
          name?: string | null;
          profile_id: string;
          profile_photo?: string | null;
          tiktok?: string | null;
          updated_at?: string;
          website?: string | null;
        };
        Update: {
          about?: string | null;
          city?: string | null;
          community_type?: string | null;
          created_at?: string;
          Featured?: boolean;
          instagram?: string | null;
          name?: string | null;
          profile_id?: string;
          profile_photo?: string | null;
          tiktok?: string | null;
          updated_at?: string;
          website?: string | null;
        };
        Relationships: [];
      };

      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          phone_number: string | null;
          updated_at: string;
          user_id: string;
          user_type: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          phone_number?: string | null;
          updated_at?: string;
          user_id?: string;
          user_type?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          phone_number?: string | null;
          updated_at?: string;
          user_id?: string;
          user_type?: string | null;
        };
        Relationships: [];
      };

      reviews: {
        Row: {
          collaboration_id: string;
          created_at: string;
          id: string;
          rating: number;
          reviewee_profile_id: string;
          reviewer_profile_id: string;
          text: string | null;
        };
        Insert: {
          collaboration_id: string;
          created_at?: string;
          id?: string;
          rating: number;
          reviewee_profile_id: string;
          reviewer_profile_id: string;
          text?: string | null;
        };
        Update: {
          collaboration_id?: string;
          created_at?: string;
          id?: string;
          rating?: number;
          reviewee_profile_id?: string;
          reviewer_profile_id?: string;
          text?: string | null;
        };
        Relationships: [];
      };

      success_stories: {
        Row: {
          company: string;
          created_at: string;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          role: string;
          testimonial: string;
          updated_at: string;
          video_url: string | null;
        };
        Insert: {
          company: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          role: string;
          testimonial: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Update: {
          company?: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          role?: string;
          testimonial?: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Relationships: [];
      };

      surveys: {
        Row: {
          answers: Json;
          collaboration_id: string;
          filled_by_profile_id: string;
          id: string;
          score: number | null;
          submitted_at: string | null;
        };
        Insert: {
          answers?: Json;
          collaboration_id: string;
          filled_by_profile_id: string;
          id?: string;
          score?: number | null;
          submitted_at?: string | null;
        };
        Update: {
          answers?: Json;
          collaboration_id?: string;
          filled_by_profile_id?: string;
          id?: string;
          score?: number | null;
          submitted_at?: string | null;
        };
        Relationships: [];
      };
    };
  };
};

export type { Json };
