/**
 * Baycarl Petshop - Supabase Database Types
 * Auto-generated style types for TypeScript integration
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          sku: string | null;
          price: number;
          cost_price: number;
          stock_quantity: number;
          low_stock_threshold: number;
          image_url: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: string;
          sku?: string | null;
          price: number;
          cost_price: number;
          stock_quantity?: number;
          low_stock_threshold?: number;
          image_url?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          sku?: string | null;
          price?: number;
          cost_price?: number;
          stock_quantity?: number;
          low_stock_threshold?: number;
          image_url?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          customer_email: string;
          customer_name: string | null;
          total_amount: number;
          status: OrderStatus;
          payment_status: PaymentStatus;
          payment_reference: string | null;
          paystack_reference: string | null;
          shipping_address: Json | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          customer_email: string;
          customer_name?: string | null;
          total_amount: number;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_reference?: string | null;
          paystack_reference?: string | null;
          shipping_address?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          customer_email?: string;
          customer_name?: string | null;
          total_amount?: number;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_reference?: string | null;
          paystack_reference?: string | null;
          shipping_address?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          amount: number;
          category: string;
          expense_date: string;
          receipt_url: string | null;
          recorded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          amount: number;
          category: string;
          expense_date?: string;
          receipt_url?: string | null;
          recorded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          amount?: number;
          category?: string;
          expense_date?: string;
          receipt_url?: string | null;
          recorded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      revenue_logs: {
        Row: {
          id: string;
          order_id: string | null;
          amount: number;
          cost_amount: number;
          profit: number;
          payment_method: string | null;
          payment_reference: string | null;
          notes: string | null;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          amount: number;
          cost_amount?: number;
          payment_method?: string | null;
          payment_reference?: string | null;
          notes?: string | null;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          amount?: number;
          cost_amount?: number;
          payment_method?: string | null;
          payment_reference?: string | null;
          notes?: string | null;
          logged_at?: string;
          created_at?: string;
        };
      };
      inventory_logs: {
        Row: {
          id: string;
          product_id: string;
          action: string;
          previous_values: Json | null;
          new_values: Json | null;
          performed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          action: string;
          previous_values?: Json | null;
          new_values?: Json | null;
          performed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          action?: string;
          previous_values?: Json | null;
          new_values?: Json | null;
          performed_by?: string | null;
          created_at?: string;
        };
      };
    };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
    };
    Functions: {
      get_user_role: {
        Args: { user_id: string };
        Returns: UserRole;
      };
      is_director: {
        Args: { user_id: string };
        Returns: boolean;
      };
      is_staff: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };
  };
};

// Enum types
export type UserRole = 'director' | 'manager' | 'customer';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'successful' | 'failed';

// Table row types (convenience aliases)
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update'];

export type Expense = Database['public']['Tables']['expenses']['Row'];
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
export type ExpenseUpdate = Database['public']['Tables']['expenses']['Update'];

export type RevenueLog = Database['public']['Tables']['revenue_logs']['Row'];
export type RevenueLogInsert = Database['public']['Tables']['revenue_logs']['Insert'];
export type RevenueLogUpdate = Database['public']['Tables']['revenue_logs']['Update'];

export type InventoryLog = Database['public']['Tables']['inventory_logs']['Row'];
export type InventoryLogInsert = Database['public']['Tables']['inventory_logs']['Insert'];
export type InventoryLogUpdate = Database['public']['Tables']['inventory_logs']['Update'];
