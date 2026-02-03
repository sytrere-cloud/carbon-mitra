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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      carbon_credits: {
        Row: {
          buyer_name: string | null
          created_at: string
          credits_amount: number
          farm_id: string
          id: string
          payout_amount: number | null
          payout_status: string | null
          price_per_credit: number | null
          sale_date: string | null
          season: string | null
          status: string | null
          updated_at: string
          user_id: string
          verification_date: string | null
          year: number | null
        }
        Insert: {
          buyer_name?: string | null
          created_at?: string
          credits_amount: number
          farm_id: string
          id?: string
          payout_amount?: number | null
          payout_status?: string | null
          price_per_credit?: number | null
          sale_date?: string | null
          season?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          verification_date?: string | null
          year?: number | null
        }
        Update: {
          buyer_name?: string | null
          created_at?: string
          credits_amount?: number
          farm_id?: string
          id?: string
          payout_amount?: number | null
          payout_status?: string | null
          price_per_credit?: number | null
          sale_date?: string | null
          season?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_credits_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_photos: {
        Row: {
          captured_at: string
          created_at: string
          farm_id: string
          id: string
          latitude: number | null
          longitude: number | null
          photo_type: string
          photo_url: string
          rejection_reason: string | null
          user_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          captured_at: string
          created_at?: string
          farm_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          photo_type: string
          photo_url: string
          rejection_reason?: string | null
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          captured_at?: string
          created_at?: string
          farm_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          photo_type?: string
          photo_url?: string
          rejection_reason?: string | null
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farm_photos_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          area_hectares: number | null
          boundary: Json | null
          created_at: string
          crop_type: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          area_hectares?: number | null
          boundary?: Json | null
          created_at?: string
          crop_type?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          area_hectares?: number | null
          boundary?: Json | null
          created_at?: string
          crop_type?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ndvi_readings: {
        Row: {
          created_at: string
          farm_id: string
          grid_data: Json | null
          health_score: number | null
          id: string
          ndvi_value: number | null
          reading_date: string
        }
        Insert: {
          created_at?: string
          farm_id: string
          grid_data?: Json | null
          health_score?: number | null
          id?: string
          ndvi_value?: number | null
          reading_date: string
        }
        Update: {
          created_at?: string
          farm_id?: string
          grid_data?: Json | null
          health_score?: number | null
          id?: string
          ndvi_value?: number | null
          reading_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "ndvi_readings_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          district: string | null
          full_name: string | null
          id: string
          language: string | null
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string
          village: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          village?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          village?: string | null
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
      app_role: "admin" | "farmer"
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
      app_role: ["admin", "farmer"],
    },
  },
} as const
