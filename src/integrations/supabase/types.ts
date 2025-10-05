export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          actor_profile_id: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          occurred_at: string
          payload: Json
        }
        Insert: {
          actor_profile_id?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          occurred_at?: string
          payload?: Json
        }
        Update: {
          actor_profile_id?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          occurred_at?: string
          payload?: Json
        }
        Relationships: []
      }
      applications: {
        Row: {
          availability: string | null
          community_profile_id: string
          created_at: string
          id: string
          message: string | null
          offer_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          availability?: string | null
          community_profile_id: string
          created_at?: string
          id?: string
          message?: string | null
          offer_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          availability?: string | null
          community_profile_id?: string
          created_at?: string
          id?: string
          message?: string | null
          offer_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_community_profile_id_fkey"
            columns: ["community_profile_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "applications_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          about: string | null
          business_type: string | null
          city: string | null
          created_at: string
          instagram: string | null
          name: string | null
          profile_id: string
          profile_photo: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          about?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          instagram?: string | null
          name?: string | null
          profile_id: string
          profile_photo?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          about?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          instagram?: string | null
          name?: string | null
          profile_id?: string
          profile_photo?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_subscriptions: {
        Row: {
          billing_info: Json | null
          id: string
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
        }
        Insert: {
          billing_info?: Json | null
          id: string
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
        }
        Update: {
          billing_info?: Json | null
          id?: string
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "business_subscriptions_profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "business_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      collaborations: {
        Row: {
          application_id: string
          business_profile_id: string
          community_profile_id: string
          completed_at: string | null
          created_at: string
          id: string
          offer_id: string
          scheduled_date: string | null
          status: Database["public"]["Enums"]["collaboration_status"]
          updated_at: string
        }
        Insert: {
          application_id: string
          business_profile_id: string
          community_profile_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          offer_id: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["collaboration_status"]
          updated_at?: string
        }
        Update: {
          application_id?: string
          business_profile_id?: string
          community_profile_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          offer_id?: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["collaboration_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "collaborations_community_profile_id_fkey"
            columns: ["community_profile_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "collaborations_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      community_profiles: {
        Row: {
          about: string | null
          city: string | null
          community_type: string | null
          created_at: string
          Featured: boolean
          instagram: string | null
          name: string | null
          profile_id: string
          profile_photo: string | null
          tiktok: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          about?: string | null
          city?: string | null
          community_type?: string | null
          created_at?: string
          Featured?: boolean
          instagram?: string | null
          name?: string | null
          profile_id: string
          profile_photo?: string | null
          tiktok?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          about?: string | null
          city?: string | null
          community_type?: string | null
          created_at?: string
          Featured?: boolean
          instagram?: string | null
          name?: string | null
          profile_id?: string
          profile_photo?: string | null
          tiktok?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_profiles_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          address: string | null
          availability_end: string | null
          availability_start: string | null
          business_offer: Json
          business_profile_id: string
          categories: Json | null
          community_deliverables: Json
          created_at: string
          description: string
          id: string
          no_venue: boolean | null
          offer_photo: string | null
          published_at: string | null
          status: Database["public"]["Enums"]["offer_status"]
          timeline_days: number | null
          title: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          availability_end?: string | null
          availability_start?: string | null
          business_offer?: Json
          business_profile_id: string
          categories?: Json | null
          community_deliverables?: Json
          created_at?: string
          description: string
          id?: string
          no_venue?: boolean | null
          offer_photo?: string | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
          timeline_days?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          availability_end?: string | null
          availability_start?: string | null
          business_offer?: Json
          business_profile_id?: string
          categories?: Json | null
          community_deliverables?: Json
          created_at?: string
          description?: string
          id?: string
          no_venue?: boolean | null
          offer_photo?: string | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
          timeline_days?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          phone_number: string | null
          updated_at: string
          user_id: string
          user_type: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          collaboration_id: string
          created_at: string
          id: string
          rating: number
          reviewee_profile_id: string
          reviewer_profile_id: string
          text: string | null
        }
        Insert: {
          collaboration_id: string
          created_at?: string
          id?: string
          rating: number
          reviewee_profile_id: string
          reviewer_profile_id: string
          text?: string | null
        }
        Update: {
          collaboration_id?: string
          created_at?: string
          id?: string
          rating?: number
          reviewee_profile_id?: string
          reviewer_profile_id?: string
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      success_stories: {
        Row: {
          company: string
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          role: string
          testimonial: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          company: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          role: string
          testimonial: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          role?: string
          testimonial?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      surveys: {
        Row: {
          answers: Json
          collaboration_id: string
          filled_by_profile_id: string
          id: string
          score: number | null
          submitted_at: string
        }
        Insert: {
          answers?: Json
          collaboration_id: string
          filled_by_profile_id: string
          id?: string
          score?: number | null
          submitted_at?: string
        }
        Update: {
          answers?: Json
          collaboration_id?: string
          filled_by_profile_id?: string
          id?: string
          score?: number | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "surveys_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_application: {
        Args: { p_application_id: string }
        Returns: string
      }
      create_analytics_event: {
        Args: {
          p_actor_profile_id: string
          p_event_type: Database["public"]["Enums"]["event_type"]
          p_payload?: Json
        }
        Returns: string
      }
      create_user_profile: {
        Args: {
          display_name: string
          profile_type: string
          user_email: string
          user_id: string
        }
        Returns: string
      }
      get_current_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_business_owner_of_offer: {
        Args: { offer_id: string }
        Returns: boolean
      }
      is_community_of_application: {
        Args: { application_id: string }
        Returns: boolean
      }
      is_participant_of_collaboration: {
        Args: { collaboration_id: string }
        Returns: boolean
      }
      is_profile_owner: {
        Args: { profile_id: string }
        Returns: boolean
      }
      is_profile_owner_by_user_id: {
        Args: { profile_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      application_status: "pending" | "accepted" | "declined" | "withdrawn"
      collaboration_goal:
        | "brand_awareness"
        | "lead_generation"
        | "content_creation"
        | "event_partnership"
        | "product_promotion"
      collaboration_status: "scheduled" | "active" | "completed" | "cancelled"
      event_type:
        | "offer_created"
        | "offer_published"
        | "application_submitted"
        | "application_accepted"
        | "application_declined"
        | "collaboration_completed"
        | "survey_submitted"
        | "review_submitted"
      offer_status: "draft" | "published" | "closed" | "completed"
      subscription_status: "active" | "past_due" | "inactive" | "cancelled"
      user_type: "business" | "community"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["pending", "accepted", "declined", "withdrawn"],
      collaboration_goal: [
        "brand_awareness",
        "lead_generation",
        "content_creation",
        "event_partnership",
        "product_promotion",
      ],
      collaboration_status: ["scheduled", "active", "completed", "cancelled"],
      event_type: [
        "offer_created",
        "offer_published",
        "application_submitted",
        "application_accepted",
        "application_declined",
        "collaboration_completed",
        "survey_submitted",
        "review_submitted",
      ],
      offer_status: ["draft", "published", "closed", "completed"],
      subscription_status: ["active", "past_due", "inactive", "cancelled"],
      user_type: ["business", "community"],
    },
  },
} as const
