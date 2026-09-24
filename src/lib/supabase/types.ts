export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AuthProvider = "google" | "github";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          unique_user_id: string;
          email: string;
          auth_provider: AuthProvider;
          auth_provider_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          unique_user_id: string;
          email: string;
          auth_provider: AuthProvider;
          auth_provider_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          unique_user_id?: string;
          email?: string;
          auth_provider?: AuthProvider;
          auth_provider_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          user_id: string;
          full_name: string | null;
          dob: string | null;
          institution_name: string | null;
          course_details: string | null;
          phone: string | null;
          extra_fields: Json;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          full_name?: string | null;
          dob?: string | null;
          institution_name?: string | null;
          course_details?: string | null;
          phone?: string | null;
          extra_fields?: Json;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          full_name?: string | null;
          dob?: string | null;
          institution_name?: string | null;
          course_details?: string | null;
          phone?: string | null;
          extra_fields?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      logos: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          storage_path: string;
          is_system: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          storage_path: string;
          is_system?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          storage_path?: string;
          is_system?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "logos_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      templates: {
        Row: {
          id: string;
          name: string;
          preview_image_url: string | null;
          field_schema: Json;
          html_template: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          preview_image_url?: string | null;
          field_schema: Json;
          html_template: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          preview_image_url?: string | null;
          field_schema?: Json;
          html_template?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      cover_pages: {
        Row: {
          id: string;
          user_id: string;
          template_id: string;
          logo_id: string | null;
          form_data: Json;
          pdf_storage_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id: string;
          logo_id?: string | null;
          form_data: Json;
          pdf_storage_path?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          template_id?: string;
          logo_id?: string | null;
          form_data?: Json;
          pdf_storage_path?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cover_pages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cover_pages_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "templates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cover_pages_logo_id_fkey";
            columns: ["logo_id"];
            isOneToOne: false;
            referencedRelation: "logos";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      auth_provider: AuthProvider;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type TemplateFieldType = "text" | "date" | "select" | "textarea";

export interface TemplateFieldSchema {
  name: string;
  label: string;
  type: TemplateFieldType;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  section?: "personal" | "course" | "faculty" | "assignment";
}

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type UserProfileRow = Database["public"]["Tables"]["user_profiles"]["Row"];
export type LogoRow = Database["public"]["Tables"]["logos"]["Row"];
export type LogoWithSignedUrl = LogoRow & {
  signed_url?: string | null;
};
export type TemplateRow = Database["public"]["Tables"]["templates"]["Row"];
export type CoverPageRow = Database["public"]["Tables"]["cover_pages"]["Row"];
export type EnrichedCoverPageRow = CoverPageRow & {
  template_name?: string;
  pdf_download_url?: string | null;
};

