/**
 * Database type definitions for Supabase
 * Auto-generated types based on database schema
 * Run: supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
 */

// This would be auto-generated, but here's the structure:
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'customer' | 'admin' | 'staff';
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'customer' | 'admin' | 'staff';
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'customer' | 'admin' | 'staff';
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          user_id: string;
          guest_name: string;
          guest_email: string;
          guest_phone: string | null;
          reservation_date: string;
          reservation_time: string;
          guest_count: number;
          special_requests: string | null;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          guest_name: string;
          guest_email: string;
          guest_phone?: string | null;
          reservation_date: string;
          reservation_time: string;
          guest_count: number;
          special_requests?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          guest_name?: string;
          guest_email?: string;
          guest_phone?: string | null;
          reservation_date?: string;
          reservation_time?: string;
          guest_count?: number;
          special_requests?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: 'coffee' | 'tea' | 'food' | 'dessert' | 'beverage';
          image_url: string | null;
          available: boolean;
          preparation_time: number;
          allergens: string[] | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          category: 'coffee' | 'tea' | 'food' | 'dessert' | 'beverage';
          image_url?: string | null;
          available?: boolean;
          preparation_time: number;
          allergens?: string[] | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: 'coffee' | 'tea' | 'food' | 'dessert' | 'beverage';
          image_url?: string | null;
          available?: boolean;
          preparation_time?: number;
          allergens?: string[] | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
          order_type: 'dine_in' | 'takeaway' | 'delivery';
          estimated_ready_time: string | null;
          special_instructions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          total_amount: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
          order_type: 'dine_in' | 'takeaway' | 'delivery';
          estimated_ready_time?: string | null;
          special_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          total_amount?: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
          order_type?: 'dine_in' | 'takeaway' | 'delivery';
          estimated_ready_time?: string | null;
          special_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          unit_price: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          unit_price: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string;
          quantity?: number;
          unit_price?: number;
          notes?: string | null;
        };
      };
      feedback: {
        Row: {
          id: string;
          user_id: string;
          type: 'complaint' | 'suggestion' | 'compliment' | 'inquiry' | 'other';
          subject: string;
          message: string;
          rating: number | null;
          status: 'open' | 'in_progress' | 'resolved' | 'closed';
          admin_response: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'complaint' | 'suggestion' | 'compliment' | 'inquiry' | 'other';
          subject: string;
          message: string;
          rating?: number | null;
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          admin_response?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'complaint' | 'suggestion' | 'compliment' | 'inquiry' | 'other';
          subject?: string;
          message?: string;
          rating?: number | null;
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          admin_response?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
