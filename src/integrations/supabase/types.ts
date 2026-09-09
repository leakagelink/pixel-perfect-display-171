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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          bullets: string[]
          category: string
          coverage: Json
          created_at: string
          dek: string
          headline: string
          id: string
          image_url: string | null
          is_featured: boolean
          is_published: boolean
          published_at: string
          reading_time: string
          slug: string
          sources: string[]
          timeline: Json
          updated_at: string
          why_it_matters: string
        }
        Insert: {
          bullets?: string[]
          category?: string
          coverage?: Json
          created_at?: string
          dek?: string
          headline: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          reading_time?: string
          slug: string
          sources?: string[]
          timeline?: Json
          updated_at?: string
          why_it_matters?: string
        }
        Update: {
          bullets?: string[]
          category?: string
          coverage?: Json
          created_at?: string
          dek?: string
          headline?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          reading_time?: string
          slug?: string
          sources?: string[]
          timeline?: Json
          updated_at?: string
          why_it_matters?: string
        }
        Relationships: []
      }
      breaking_news: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          sort_order: number
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          text?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      shorts: {
        Row: {
          category: string
          created_at: string
          headline: string
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string
          sort_order: number
          source: string | null
          summary: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          headline: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string
          sort_order?: number
          source?: string | null
          summary?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          headline?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string
          sort_order?: number
          source?: string | null
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      trending_topics: {
        Row: {
          count_label: string
          created_at: string
          id: string
          is_active: boolean
          sort_order: number
          tag: string
        }
        Insert: {
          count_label?: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          tag: string
        }
        Update: {
          count_label?: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          tag?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          ai_brief: boolean
          category: string
          created_at: string
          duration: string
          id: string
          image_url: string | null
          is_published: boolean
          sort_order: number
          source: string | null
          status: string
          title: string
          updated_at: string
          video_url: string | null
          views: string
        }
        Insert: {
          ai_brief?: boolean
          category?: string
          created_at?: string
          duration?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          sort_order?: number
          source?: string | null
          status?: string
          title: string
          updated_at?: string
          video_url?: string | null
          views?: string
        }
        Update: {
          ai_brief?: boolean
          category?: string
          created_at?: string
          duration?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          sort_order?: number
          source?: string | null
          status?: string
          title?: string
          updated_at?: string
          video_url?: string | null
          views?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
