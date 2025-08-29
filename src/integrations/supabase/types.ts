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
        Relationships: [
          {
            foreignKeyName: "analytics_events_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          community_profile_id: string
          created_at: string
          id: string
          message: string | null
          offer_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          community_profile_id: string
          created_at?: string
          id?: string
          message?: string | null
          offer_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
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
          billing_info: Json | null
          business_type: string | null
          created_at: string
          profile_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string
        }
        Insert: {
          billing_info?: Json | null
          business_type?: string | null
          created_at?: string
          profile_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string
        }
        Update: {
          billing_info?: Json | null
          business_type?: string | null
          created_at?: string
          profile_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
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
          additional_links: Json | null
          community_type: string | null
          created_at: string
          members_estimate: number | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          additional_links?: Json | null
          community_type?: string | null
          created_at?: string
          members_estimate?: number | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          additional_links?: Json | null
          community_type?: string | null
          created_at?: string
          members_estimate?: number | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles_public"
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
          collaboration_goal: Database["public"]["Enums"]["collaboration_goal"]
          community_deliverables: Json
          created_at: string
          description: string
          id: string
          no_venue: boolean | null
          published_at: string | null
          status: Database["public"]["Enums"]["offer_status"]
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
          collaboration_goal: Database["public"]["Enums"]["collaboration_goal"]
          community_deliverables?: Json
          created_at?: string
          description: string
          id?: string
          no_venue?: boolean | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
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
          collaboration_goal?: Database["public"]["Enums"]["collaboration_goal"]
          community_deliverables?: Json
          created_at?: string
          description?: string
          id?: string
          no_venue?: boolean | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
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
          bio: string | null
          city: string | null
          contact_info: Json | null
          created_at: string
          display_name: string
          id: string
          profile_photo: string | null
          social_links: Json | null
          type: Database["public"]["Enums"]["user_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          city?: string | null
          contact_info?: Json | null
          created_at?: string
          display_name: string
          id?: string
          profile_photo?: string | null
          social_links?: Json | null
          type: Database["public"]["Enums"]["user_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          city?: string | null
          contact_info?: Json | null
          created_at?: string
          display_name?: string
          id?: string
          profile_photo?: string | null
          social_links?: Json | null
          type?: Database["public"]["Enums"]["user_type"]
          updated_at?: string
          user_id?: string
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
          {
            foreignKeyName: "reviews_reviewee_profile_id_fkey"
            columns: ["reviewee_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_profile_id_fkey"
            columns: ["reviewee_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_profile_id_fkey"
            columns: ["reviewer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_profile_id_fkey"
            columns: ["reviewer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_period_end: string | null
          billing_period_start: string | null
          business_profile_id: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string
        }
        Insert: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          business_profile_id: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string
        }
        Update: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          business_profile_id?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
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
          {
            foreignKeyName: "surveys_filled_by_profile_id_fkey"
            columns: ["filled_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_filled_by_profile_id_fkey"
            columns: ["filled_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      profiles_public: {
        Row: {
          bio: string | null
          city: string | null
          contact_info: Json | null
          created_at: string | null
          display_name: string | null
          id: string | null
          profile_photo: string | null
          social_links: Json | null
          type: Database["public"]["Enums"]["user_type"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          contact_info?: never
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          profile_photo?: string | null
          social_links?: Json | null
          type?: Database["public"]["Enums"]["user_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          contact_info?: never
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          profile_photo?: string | null
          social_links?: Json | null
          type?: Database["public"]["Enums"]["user_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      get_current_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_safe_profile_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          bio: string
          city: string
          contact_info: Json
          created_at: string
          display_name: string
          id: string
          profile_photo: string
          social_links: Json
          type: Database["public"]["Enums"]["user_type"]
          updated_at: string
          user_id: string
        }[]
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
