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
      accounting_entries: {
        Row: {
          account_name: string
          created_at: string
          credit: number
          debit: number
          description: string | null
          entry_date: string
          id: string
          reference: string | null
          section: Database["public"]["Enums"]["business_section"]
          user_id: string | null
        }
        Insert: {
          account_name: string
          created_at?: string
          credit?: number
          debit?: number
          description?: string | null
          entry_date?: string
          id?: string
          reference?: string | null
          section: Database["public"]["Enums"]["business_section"]
          user_id?: string | null
        }
        Update: {
          account_name?: string
          created_at?: string
          credit?: number
          debit?: number
          description?: string | null
          entry_date?: string
          id?: string
          reference?: string | null
          section?: Database["public"]["Enums"]["business_section"]
          user_id?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          active: boolean
          address: string | null
          bank_account: string | null
          bank_name: string | null
          base_salary: number
          created_at: string
          dni: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          position: string | null
          section: Database["public"]["Enums"]["business_section"]
          start_date: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          address?: string | null
          bank_account?: string | null
          bank_name?: string | null
          base_salary?: number
          created_at?: string
          dni?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          position?: string | null
          section: Database["public"]["Enums"]["business_section"]
          start_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          address?: string | null
          bank_account?: string | null
          bank_name?: string | null
          base_salary?: number
          created_at?: string
          dni?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          position?: string | null
          section?: Database["public"]["Enums"]["business_section"]
          start_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string
          expense_date: string
          id: string
          section: Database["public"]["Enums"]["business_section"]
          user_id: string | null
        }
        Insert: {
          amount?: number
          category?: string | null
          created_at?: string
          description: string
          expense_date?: string
          id?: string
          section: Database["public"]["Enums"]["business_section"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          section?: Database["public"]["Enums"]["business_section"]
          user_id?: string | null
        }
        Relationships: []
      }
      income: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          income_date: string
          section: Database["public"]["Enums"]["business_section"]
          source: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          income_date?: string
          section: Database["public"]["Enums"]["business_section"]
          source?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          income_date?: string
          section?: Database["public"]["Enums"]["business_section"]
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string
          description: string | null
          id: string
          min_stock: number
          name: string
          quantity: number
          section: Database["public"]["Enums"]["business_section"]
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          min_stock?: number
          name: string
          quantity?: number
          section: Database["public"]["Enums"]["business_section"]
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          min_stock?: number
          name?: string
          quantity?: number
          section?: Database["public"]["Enums"]["business_section"]
          unit_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      payroll: {
        Row: {
          base_salary: number
          bonuses: number
          created_at: string
          deductions: number
          employee_id: string
          id: string
          month: number
          net_salary: number
          notes: string | null
          paid: boolean
          paid_date: string | null
          section: Database["public"]["Enums"]["business_section"]
          year: number
        }
        Insert: {
          base_salary?: number
          bonuses?: number
          created_at?: string
          deductions?: number
          employee_id: string
          id?: string
          month: number
          net_salary?: number
          notes?: string | null
          paid?: boolean
          paid_date?: string | null
          section: Database["public"]["Enums"]["business_section"]
          year: number
        }
        Update: {
          base_salary?: number
          bonuses?: number
          created_at?: string
          deductions?: number
          employee_id?: string
          id?: string
          month?: number
          net_salary?: number
          notes?: string | null
          paid?: boolean
          paid_date?: string | null
          section?: Database["public"]["Enums"]["business_section"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allowed_pages: string[] | null
          allowed_sections: string[] | null
          created_at: string
          dni: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          section: Database["public"]["Enums"]["business_section"] | null
          updated_at: string
        }
        Insert: {
          allowed_pages?: string[] | null
          allowed_sections?: string[] | null
          created_at?: string
          dni?: string | null
          email?: string | null
          full_name?: string
          id: string
          phone?: string | null
          section?: Database["public"]["Enums"]["business_section"] | null
          updated_at?: string
        }
        Update: {
          allowed_pages?: string[] | null
          allowed_sections?: string[] | null
          created_at?: string
          dni?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          section?: Database["public"]["Enums"]["business_section"] | null
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          purchase_date: string
          quantity: number
          section: Database["public"]["Enums"]["business_section"]
          supplier: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          purchase_date?: string
          quantity?: number
          section: Database["public"]["Enums"]["business_section"]
          supplier?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          purchase_date?: string
          quantity?: number
          section?: Database["public"]["Enums"]["business_section"]
          supplier?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          amount: number
          client_name: string | null
          created_at: string
          description: string
          id: string
          quantity: number
          sale_date: string
          section: Database["public"]["Enums"]["business_section"]
          user_id: string | null
        }
        Insert: {
          amount?: number
          client_name?: string | null
          created_at?: string
          description: string
          id?: string
          quantity?: number
          sale_date?: string
          section: Database["public"]["Enums"]["business_section"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          client_name?: string | null
          created_at?: string
          description?: string
          id?: string
          quantity?: number
          sale_date?: string
          section?: Database["public"]["Enums"]["business_section"]
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "worker" | "viewer" | "super_admin"
      business_section: "gimnasia" | "clinica" | "peluqueria"
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
      app_role: ["admin", "worker", "viewer", "super_admin"],
      business_section: ["gimnasia", "clinica", "peluqueria"],
    },
  },
} as const
