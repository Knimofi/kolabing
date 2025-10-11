export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      analytics_events: {
        Row: {
          actor_profile_id: string | null;
          event_type: Database["public"]["Enums"]["event_type"];
          id: string;
          occurred_at: string;
          payload: Json;
        };
        Insert: {
          actor_profile_id?: string | null;
          event_type: Database["public"]["Enums"]["event_type"];
          id?: string;
          occurred_at?: string;
          payload?: Json;
        };
        Update: {
          actor_profile_id?: string | null;
          event_type?: Database["public"]["Enums"]["event_type"];
          id?: string;
          occurred_at?: string;
          payload?: Json;
        };
        Relationships: [];
      };

      applications: {
        Row: {
          applicant_profile_id: string;
          applicant_profile_type: string;
          availability: string | null;
          collab_opportunity_id: string;
          created_at: string;
          id: string;
          message: string | null;
          status: Database["public"]["Enums"]["application_status"];
          updated_at: string;
        };
        Insert: {
          applicant_profile_id: string;
          applicant_profile_type: string;
          availability?: string | null;
          collab_opportunity_id: string;
          created_at?: string;
          id?: string;
          message?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
          updated_at?: string;
        };
        Update: {
          applicant_profile_id?: string;
          applicant_profile_type?: string;
          availability?: string | null;
          collab_opportunity_id?: string;
          created_at?: string;
          id?: string;
          message?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_applicant_profile_id_fkey";
            columns: ["applicant_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_collab_opportunity_id_fkey";
            columns: ["collab_opportunity_id"];
            isOneToOne: false;
            referencedRelation: "collab_opportunities";
            referencedColumns: ["id"];
          }
        ];
      };

      collab_opportunities: {
        Row: {
          address: string | null;
          availability_end: string | null;
          availability_start: string | null;
          business_offer: Json;
          categories: Json | null;
          community_deliverables: Json;
          created_at: string;
          creator_profile_id: string;
          creator_profile_type: string;
          description: string;
          id: string;
          no_venue: boolean | null;
          offer_photo: string | null;
          published_at: string | null;
          status: Database["public"]["Enums"]["offer_status"];
          timeline_days: number | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          availability_end?: string | null;
          availability_start?: string | null;
          business_offer?: Json;
          categories?: Json | null;
          community_deliverables?: Json;
          created_at?: string;
          creator_profile_id: string;
          creator_profile_type: string;
          description: string;
          id?: string;
          no_venue?: boolean | null;
          offer_photo?: string | null;
          published_at?: string | null;
          status?: Database["public"]["Enums"]["offer_status"];
          timeline_days?: number | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          availability_end?: string | null;
          availability_start?: string | null;
          business_offer?: Json;
          categories?: Json | null;
          community_deliverables?: Json;
          created_at?: string;
          creator_profile_id?: string;
          creator_profile_type?: string;
          description?: string;
          id?: string;
          no_venue?: boolean | null;
          offer_photo?: string | null;
          published_at?: string | null;
          status?: Database["public"]["Enums"]["offer_status"];
          timeline_days?: number | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collab_opportunities_creator_profile_id_fkey";
            columns: ["creator_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      collaborations: {
        Row: {
          applicant_profile_id: string;
          application_id: string;
          collab_opportunity_id: string;
          completed_at: string | null;
          contact_methods: Json | null;
          created_at: string;
          creator_profile_id: string;
          id: string;
          scheduled_date: string | null;
          status: Database["public"]["Enums"]["collaboration_status"];
          updated_at: string;
        };
        Insert: {
          applicant_profile_id: string;
          application_id: string;
          collab_opportunity_id: string;
          completed_at?: string | null;
          contact_methods?: Json | null;
          created_at?: string;
          creator_profile_id: string;
          id?: string;
          scheduled_date?: string | null;
          status?: Database["public"]["Enums"]["collaboration_status"];
          updated_at?: string;
        };
        Update: {
          applicant_profile_id?: string;
          application_id?: string;
          collab_opportunity_id?: string;
          completed_at?: string | null;
          contact_methods?: Json | null;
          created_at?: string;
          creator_profile_id?: string;
          id?: string;
          scheduled_date?: string | null;
          status?: Database["public"]["Enums"]["collaboration_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collaborations_applicant_profile_id_fkey";
            columns: ["applicant_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collaborations_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: true;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collaborations_collab_opportunity_id_fkey";
            columns: ["collab_opportunity_id"];
            isOneToOne: false;
            referencedRelation: "collab_opportunities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collaborations_creator_profile_id_fkey";
            columns: ["creator_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      // Legacy or unchanged tables omitted for brevity...
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      // Only update function names/args if the migration changed them
      accept_application: {
        Args: { p_application_id: string };
        Returns: string;
      };
      create_analytics_event: {
        Args: {
          p_actor_profile_id: string;
          p_event_type: Database["public"]["Enums"]["event_type"];
          p_payload?: Json;
        };
        Returns: string;
      };
      create_user_profile: {
        Args: {
          display_name: string;
          profile_type: string;
          user_email: string;
          user_id: string;
        };
        Returns: string;
      };
      get_current_profile_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_applicant_of_application: {
        Args: { application_id: string };
        Returns: boolean;
      };
      is_creator_of_opportunity: {
        Args: { opportunity_id: string };
        Returns: boolean;
      };
      is_participant_of_collaboration: {
        Args: { collaboration_id: string };
        Returns: boolean;
      };
      is_profile_owner: {
        Args: { profile_id: string };
        Returns: boolean;
      };
      is_profile_owner_by_user_id: {
        Args: { profile_user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      application_status: "pending" | "accepted" | "declined" | "withdrawn";
      collaboration_goal:
        | "brand_awareness"
        | "lead_generation"
        | "content_creation"
        | "event_partnership"
        | "product_promotion";
      collaboration_status: "scheduled" | "active" | "completed" | "cancelled";
      event_type:
        | "offer_created"
        | "offer_published"
        | "application_submitted"
        | "application_accepted"
        | "application_declined"
        | "collaboration_completed"
        | "survey_submitted"
        | "review_submitted";
      offer_status: "draft" | "published" | "closed" | "completed";
      subscription_status: "active" | "past_due" | "inactive" | "cancelled";
      user_type: "business" | "community";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"] & DefaultSchema["Views"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends { Row: infer R }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] & DefaultSchema["Views"]
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends { Row: infer R }
      ? R
      : never
    : never;

export type TablesInsert<...> = ... //unchanged logic for Inserts

export type TablesUpdate<...> = ... //unchanged logic for Updates

export type Enums<...> = ... //unchanged logic for Enums

export type CompositeTypes<...> = ... //unchanged logic for CompositeTypes

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
} as const;
