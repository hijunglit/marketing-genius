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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai: {
        Row: {
          ai_id: number
          category: string
          company_description: string
          company_name: string
          core_service: string
          created_at: string
          profiles_id: string
          updated_at: string
        }
        Insert: {
          ai_id?: never
          category: string
          company_description: string
          company_name: string
          core_service: string
          created_at?: string
          profiles_id: string
          updated_at?: string
        }
        Update: {
          ai_id?: never
          category?: string
          company_description?: string
          company_name?: string
          core_service?: string
          created_at?: string
          profiles_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_profiles_id_profiles_profile_id_fk"
            columns: ["profiles_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      contents: {
        Row: {
          contents_id: number
          created_at: string
          hashtag: string
          text: string
          updated_at: string
        }
        Insert: {
          contents_id?: never
          created_at?: string
          hashtag: string
          text: string
          updated_at?: string
        }
        Update: {
          contents_id?: never
          created_at?: string
          hashtag?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      images: {
        Row: {
          contents_id: number | null
          image_id: number
          image_url: string
        }
        Insert: {
          contents_id?: number | null
          image_id?: never
          image_url: string
        }
        Update: {
          contents_id?: number | null
          image_id?: never
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_contents_id_contents_contents_id_fk"
            columns: ["contents_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["contents_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          name: string
          profile_id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          name: string
          profile_id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          name?: string
          profile_id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      request_contents: {
        Row: {
          ai_id: number
          contents_id: number | null
          core_message: string
          created_at: string
          is_confirm: boolean
          platform: string
          product_name: string
          profile_id: string
          request_id: number
          target: string
          template: string
          title: string
        }
        Insert: {
          ai_id: number
          contents_id?: number | null
          core_message: string
          created_at?: string
          is_confirm?: boolean
          platform: string
          product_name: string
          profile_id: string
          request_id?: never
          target: string
          template: string
          title: string
        }
        Update: {
          ai_id?: number
          contents_id?: number | null
          core_message?: string
          created_at?: string
          is_confirm?: boolean
          platform?: string
          product_name?: string
          profile_id?: string
          request_id?: never
          target?: string
          template?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_contents_ai_id_ai_ai_id_fk"
            columns: ["ai_id"]
            isOneToOne: false
            referencedRelation: "ai"
            referencedColumns: ["ai_id"]
          },
          {
            foreignKeyName: "request_contents_contents_id_contents_contents_id_fk"
            columns: ["contents_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["contents_id"]
          },
          {
            foreignKeyName: "request_contents_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
