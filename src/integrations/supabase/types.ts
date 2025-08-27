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
      admin_profiles: {
        Row: {
          access_scope: string | null
          created_at: string
          deleted_at: string | null
          deletion_scheduled_at: string | null
          id: string
          permissions: Json | null
          role_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_scope?: string | null
          created_at?: string
          deleted_at?: string | null
          deletion_scheduled_at?: string | null
          id?: string
          permissions?: Json | null
          role_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_scope?: string | null
          created_at?: string
          deleted_at?: string | null
          deletion_scheduled_at?: string | null
          id?: string
          permissions?: Json | null
          role_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      blogs: {
        Row: {
          author_id: string
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          hero_image: string | null
          id: string
          meta_description: string | null
          published_at: string | null
          reading_time: number | null
          slug: string
          status: Database["public"]["Enums"]["blog_status"]
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          hero_image?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          status?: Database["public"]["Enums"]["blog_status"]
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          hero_image?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_status"]
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          company_size: string | null
          country: string | null
          cover_url: string | null
          created_at: string
          deleted_at: string | null
          deletion_scheduled_at: string | null
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          phone: string | null
          slug: string | null
          tags: Json
          updated_at: string
          user_id: string
          value_statement: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deletion_scheduled_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          phone?: string | null
          slug?: string | null
          tags?: Json
          updated_at?: string
          user_id: string
          value_statement?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deletion_scheduled_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          phone?: string | null
          slug?: string | null
          tags?: Json
          updated_at?: string
          user_id?: string
          value_statement?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          business_profile_id: string | null
          community_assigned: string | null
          content: string | null
          created_at: string
          credit_refund: number | null
          description: string | null
          draft_data: Json | null
          end_date: string | null
          event_date: string | null
          expected_outcomes: Json | null
          goal_type: Database["public"]["Enums"]["campaign_goal_type"] | null
          id: string
          metrics: Json | null
          offer_type: Json | null
          owner_id: string
          owner_type: Database["public"]["Enums"]["user_type"]
          package_credits: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          survey_completed_at: string | null
          survey_data: Json
          target_audience: string | null
          title: string
          updated_at: string
          venue_details: Json | null
          wizard_step: number | null
        }
        Insert: {
          budget?: number | null
          business_profile_id?: string | null
          community_assigned?: string | null
          content?: string | null
          created_at?: string
          credit_refund?: number | null
          description?: string | null
          draft_data?: Json | null
          end_date?: string | null
          event_date?: string | null
          expected_outcomes?: Json | null
          goal_type?: Database["public"]["Enums"]["campaign_goal_type"] | null
          id?: string
          metrics?: Json | null
          offer_type?: Json | null
          owner_id: string
          owner_type: Database["public"]["Enums"]["user_type"]
          package_credits?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          survey_completed_at?: string | null
          survey_data?: Json
          target_audience?: string | null
          title: string
          updated_at?: string
          venue_details?: Json | null
          wizard_step?: number | null
        }
        Update: {
          budget?: number | null
          business_profile_id?: string | null
          community_assigned?: string | null
          content?: string | null
          created_at?: string
          credit_refund?: number | null
          description?: string | null
          draft_data?: Json | null
          end_date?: string | null
          event_date?: string | null
          expected_outcomes?: Json | null
          goal_type?: Database["public"]["Enums"]["campaign_goal_type"] | null
          id?: string
          metrics?: Json | null
          offer_type?: Json | null
          owner_id?: string
          owner_type?: Database["public"]["Enums"]["user_type"]
          package_credits?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          survey_completed_at?: string | null
          survey_data?: Json
          target_audience?: string | null
          title?: string
          updated_at?: string
          venue_details?: Json | null
          wizard_step?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_community_assigned_fkey"
            columns: ["community_assigned"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_profiles: {
        Row: {
          about_bio: string | null
          activation_packages: Json | null
          audience_active: number | null
          audience_total: number | null
          avatar_url: string | null
          avg_engagement_pct: number | null
          blackout_ranges: unknown[] | null
          brand_rating_avg: number | null
          categories: Json | null
          city: string | null
          community_name: string | null
          complete_profile_completed: boolean | null
          completed_activations_count: number | null
          completed_campaigns: Json | null
          completion_pct: number | null
          connect_socials_completed: boolean | null
          country: string | null
          cover_url: string | null
          created_at: string
          deleted_at: string | null
          deletion_scheduled_at: string | null
          demographics: Json | null
          description: string | null
          earnings_total_cents: number | null
          fit_for: Json | null
          focus_area: string | null
          id: string
          kpis: Json | null
          languages: Json | null
          location: string | null
          media_kit_url: string | null
          member_count: number | null
          metrics_verified: boolean | null
          next_payout_date: string | null
          on_time_pct: number | null
          preferred_slots: Json | null
          published: boolean | null
          published_at: string | null
          reply_sla_pct: number | null
          safety_notes: string | null
          slug: string | null
          social_links: Json | null
          tags: Json | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          tier: string | null
          trust_score: number | null
          typical_attendance_max: number | null
          typical_attendance_min: number | null
          ugc_links: string[] | null
          ugc_showcase: Json | null
          updated_at: string
          user_id: string
          value_proposition: string | null
          verify_identity_completed: boolean | null
        }
        Insert: {
          about_bio?: string | null
          activation_packages?: Json | null
          audience_active?: number | null
          audience_total?: number | null
          avatar_url?: string | null
          avg_engagement_pct?: number | null
          blackout_ranges?: unknown[] | null
          brand_rating_avg?: number | null
          categories?: Json | null
          city?: string | null
          community_name?: string | null
          complete_profile_completed?: boolean | null
          completed_activations_count?: number | null
          completed_campaigns?: Json | null
          completion_pct?: number | null
          connect_socials_completed?: boolean | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deletion_scheduled_at?: string | null
          demographics?: Json | null
          description?: string | null
          earnings_total_cents?: number | null
          fit_for?: Json | null
          focus_area?: string | null
          id?: string
          kpis?: Json | null
          languages?: Json | null
          location?: string | null
          media_kit_url?: string | null
          member_count?: number | null
          metrics_verified?: boolean | null
          next_payout_date?: string | null
          on_time_pct?: number | null
          preferred_slots?: Json | null
          published?: boolean | null
          published_at?: string | null
          reply_sla_pct?: number | null
          safety_notes?: string | null
          slug?: string | null
          social_links?: Json | null
          tags?: Json | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          tier?: string | null
          trust_score?: number | null
          typical_attendance_max?: number | null
          typical_attendance_min?: number | null
          ugc_links?: string[] | null
          ugc_showcase?: Json | null
          updated_at?: string
          user_id: string
          value_proposition?: string | null
          verify_identity_completed?: boolean | null
        }
        Update: {
          about_bio?: string | null
          activation_packages?: Json | null
          audience_active?: number | null
          audience_total?: number | null
          avatar_url?: string | null
          avg_engagement_pct?: number | null
          blackout_ranges?: unknown[] | null
          brand_rating_avg?: number | null
          categories?: Json | null
          city?: string | null
          community_name?: string | null
          complete_profile_completed?: boolean | null
          completed_activations_count?: number | null
          completed_campaigns?: Json | null
          completion_pct?: number | null
          connect_socials_completed?: boolean | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deletion_scheduled_at?: string | null
          demographics?: Json | null
          description?: string | null
          earnings_total_cents?: number | null
          fit_for?: Json | null
          focus_area?: string | null
          id?: string
          kpis?: Json | null
          languages?: Json | null
          location?: string | null
          media_kit_url?: string | null
          member_count?: number | null
          metrics_verified?: boolean | null
          next_payout_date?: string | null
          on_time_pct?: number | null
          preferred_slots?: Json | null
          published?: boolean | null
          published_at?: string | null
          reply_sla_pct?: number | null
          safety_notes?: string | null
          slug?: string | null
          social_links?: Json | null
          tags?: Json | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          tier?: string | null
          trust_score?: number | null
          typical_attendance_max?: number | null
          typical_attendance_min?: number | null
          ugc_links?: string[] | null
          ugc_showcase?: Json | null
          updated_at?: string
          user_id?: string
          value_proposition?: string | null
          verify_identity_completed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "community_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_trust: {
        Row: {
          brand_rating_avg: number | null
          community_id: string
          completion_pct: number | null
          created_at: string
          id: string
          on_time_pct: number | null
          period_end: string
          period_start: string
          reply_sla_pct: number | null
          trust_score: number | null
          updated_at: string
        }
        Insert: {
          brand_rating_avg?: number | null
          community_id: string
          completion_pct?: number | null
          created_at?: string
          id?: string
          on_time_pct?: number | null
          period_end: string
          period_start: string
          reply_sla_pct?: number | null
          trust_score?: number | null
          updated_at?: string
        }
        Update: {
          brand_rating_avg?: number | null
          community_id?: string
          completion_pct?: number | null
          created_at?: string
          id?: string
          on_time_pct?: number | null
          period_end?: string
          period_start?: string
          reply_sla_pct?: number | null
          trust_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_trust_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount_cents: number
          community_id: string
          created_at: string
          id: string
          paid_at: string | null
          scheduled_for: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_cents?: number
          community_id: string
          created_at?: string
          id?: string
          paid_at?: string | null
          scheduled_for: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          community_id?: string
          created_at?: string
          id?: string
          paid_at?: string | null
          scheduled_for?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          deleted_at: string | null
          deletion_scheduled_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          deletion_scheduled_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          deletion_scheduled_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_trust_score: {
        Args: { community_profile_id: string }
        Returns: number
      }
      get_blog_author_info: {
        Args: { author_user_id: string }
        Returns: {
          first_name: string
          last_name: string
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      restore_user_account: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      soft_delete_user_account: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      update_community_tier: {
        Args: { community_profile_id: string }
        Returns: string
      }
      update_earnings_totals: {
        Args: { community_profile_id: string }
        Returns: undefined
      }
    }
    Enums: {
      blog_status: "draft" | "published" | "archived"
      campaign_goal_type:
        | "engagement"
        | "product_testing"
        | "revenue_boost"
        | "google_reviews"
      campaign_status:
        | "draft"
        | "to_review"
        | "active"
        | "completed"
        | "cancelled"
        | "rejected_by_community"
      user_type: "business" | "community" | "admin"
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
      blog_status: ["draft", "published", "archived"],
      campaign_goal_type: [
        "engagement",
        "product_testing",
        "revenue_boost",
        "google_reviews",
      ],
      campaign_status: [
        "draft",
        "to_review",
        "active",
        "completed",
        "cancelled",
        "rejected_by_community",
      ],
      user_type: ["business", "community", "admin"],
    },
  },
} as const
