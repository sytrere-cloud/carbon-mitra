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
      audit_assignments: {
        Row: {
          assigned_at: string
          auditor_id: string
          created_at: string
          farm_id: string
          id: string
          notes: string | null
          season: string | null
          status: string
          year: number | null
        }
        Insert: {
          assigned_at?: string
          auditor_id: string
          created_at?: string
          farm_id: string
          id?: string
          notes?: string | null
          season?: string | null
          status?: string
          year?: number | null
        }
        Update: {
          assigned_at?: string
          auditor_id?: string
          created_at?: string
          farm_id?: string
          id?: string
          notes?: string | null
          season?: string | null
          status?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_assignments_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_reports: {
        Row: {
          auditor_id: string
          created_at: string
          farm_ids: string[] | null
          generated_at: string | null
          id: string
          report_data: Json | null
          report_type: string
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          auditor_id: string
          created_at?: string
          farm_ids?: string[] | null
          generated_at?: string | null
          id?: string
          report_data?: Json | null
          report_type?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          auditor_id?: string
          created_at?: string
          farm_ids?: string[] | null
          generated_at?: string | null
          id?: string
          report_data?: Json | null
          report_type?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      consent_agreements: {
        Row: {
          aadhaar_last_four: string | null
          agreement_hash: string | null
          agreement_type: string
          agreement_version: string
          consent_method: string
          created_at: string
          device_info: Json | null
          full_name: string
          id: string
          ip_address: string | null
          otp_verified: boolean | null
          signature_data: string
          signature_type: string
          signed_at: string
          user_id: string
          voice_consent_url: string | null
        }
        Insert: {
          aadhaar_last_four?: string | null
          agreement_hash?: string | null
          agreement_type?: string
          agreement_version?: string
          consent_method?: string
          created_at?: string
          device_info?: Json | null
          full_name: string
          id?: string
          ip_address?: string | null
          otp_verified?: boolean | null
          signature_data: string
          signature_type: string
          signed_at?: string
          user_id: string
          voice_consent_url?: string | null
        }
        Update: {
          aadhaar_last_four?: string | null
          agreement_hash?: string | null
          agreement_type?: string
          agreement_version?: string
          consent_method?: string
          created_at?: string
          device_info?: Json | null
          full_name?: string
          id?: string
          ip_address?: string | null
          otp_verified?: boolean | null
          signature_data?: string
          signature_type?: string
          signed_at?: string
          user_id?: string
          voice_consent_url?: string | null
        }
        Relationships: []
      }
      farm_photos: {
        Row: {
          captured_at: string
          compass_heading: number | null
          created_at: string
          device_info: Json | null
          farm_id: string
          id: string
          latitude: number | null
          longitude: number | null
          milestone_stage: string | null
          network_id: string | null
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
          compass_heading?: number | null
          created_at?: string
          device_info?: Json | null
          farm_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          milestone_stage?: string | null
          network_id?: string | null
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
          compass_heading?: number | null
          created_at?: string
          device_info?: Json | null
          farm_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          milestone_stage?: string | null
          network_id?: string | null
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
          aadhaar_last_four: string | null
          created_at: string
          district: string | null
          full_name: string | null
          id: string
          kisan_id: string | null
          kyc_completed_at: string | null
          kyc_status: string | null
          language: string | null
          phone: string | null
          referral_code: string | null
          state: string | null
          updated_at: string
          user_id: string
          village: string | null
        }
        Insert: {
          aadhaar_last_four?: string | null
          created_at?: string
          district?: string | null
          full_name?: string | null
          id?: string
          kisan_id?: string | null
          kyc_completed_at?: string | null
          kyc_status?: string | null
          language?: string | null
          phone?: string | null
          referral_code?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          village?: string | null
        }
        Update: {
          aadhaar_last_four?: string | null
          created_at?: string
          district?: string | null
          full_name?: string | null
          id?: string
          kisan_id?: string | null
          kyc_completed_at?: string | null
          kyc_status?: string | null
          language?: string | null
          phone?: string | null
          referral_code?: string | null
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
      app_role: "admin" | "farmer" | "auditor"
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
      app_role: ["admin", "farmer", "auditor"],
    },
  },
} as const
