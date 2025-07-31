import { ProductSpecifications, ProductDimensions, HomepageItems, HomepageConfig } from './admin/product'

export interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  notes?: string
  variant?: string
  variants?: OrderItemVariant[]
}

export interface OrderItemVariant {
  variant_name: string
  option_name: string
  price_modifier: number
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  type: 'size' | 'addon' | 'option'
  is_required: boolean
  min_selection: number
  max_selection: number
  display_order: number
  created_at: string
  updated_at: string
}

export interface VariantOption {
  id: string
  variant_id: string
  name: string
  price_modifier: number
  is_default: boolean
  is_available: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          parent_id: number | null
          image_url: string | null
          is_active: boolean
          display_order: number | null
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          parent_id?: number | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          parent_id?: number | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          short_description: string | null
          price: number
          compare_price: number | null
          cost: number | null
          sku: string | null
          barcode: string | null
          availability: boolean
          is_active: boolean
          is_featured: boolean
          category_id: number | null
          brand: string | null
          images: string[] | null
          specifications: ProductSpecifications | null
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          tags: string[] | null
          weight: number | null
          dimensions: ProductDimensions | null
          stock_quantity: number | null
          track_stock: boolean | null
          allow_backorders: boolean | null
          low_stock_threshold: number | null
          shipping_class: string | null
          requires_shipping: boolean | null
          digital_product_url: string | null
          digital_product_type: string | null
          tax_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          price: number
          compare_price?: number | null
          cost?: number | null
          sku?: string | null
          barcode?: string | null
          availability?: boolean
          is_active?: boolean
          is_featured?: boolean
          category_id?: number | null
          brand?: string | null
          images?: string[] | null
          specifications?: ProductSpecifications | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          tags?: string[] | null
          weight?: number | null
          dimensions?: ProductDimensions | null
          stock_quantity?: number | null
          track_stock?: boolean | null
          allow_backorders?: boolean | null
          low_stock_threshold?: number | null
          shipping_class?: string | null
          requires_shipping?: boolean | null
          digital_product_url?: string | null
          digital_product_type?: string | null
          tax_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          price?: number
          compare_price?: number | null
          cost?: number | null
          sku?: string | null
          barcode?: string | null
          availability?: boolean
          is_active?: boolean
          is_featured?: boolean
          category_id?: number | null
          brand?: string | null
          images?: string[] | null
          specifications?: ProductSpecifications | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          tags?: string[] | null
          weight?: number | null
          dimensions?: ProductDimensions | null
          stock_quantity?: number | null
          track_stock?: boolean | null
          allow_backorders?: boolean | null
          low_stock_threshold?: number | null
          shipping_class?: string | null
          requires_shipping?: boolean | null
          digital_product_url?: string | null
          digital_product_type?: string | null
          tax_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      homepage_features: {
        Row: {
          id: string
          type: 'carousel' | 'featured_products' | 'categories' | 'banner' | 'html_block' | 'announcement'
          title: string | null
          subtitle: string | null
          items: HomepageItems[] | null
          config: HomepageConfig | null
          is_active: boolean
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'carousel' | 'featured_products' | 'categories' | 'banner' | 'html_block' | 'announcement'
          title?: string | null
          subtitle?: string | null
          items?: HomepageItems[] | null
          config?: HomepageConfig | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'carousel' | 'featured_products' | 'categories' | 'banner' | 'html_block' | 'announcement'
          title?: string | null
          subtitle?: string | null
          items?: HomepageItems[] | null
          config?: HomepageConfig | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          table_number: string | null
          items: OrderItem[]
          total_amount: number
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'refunded'
          notes: string | null
          user_id: string | null
          guest_token_id: string | null
          delivery_type: 'pickup' | 'delivery' | 'dine_in'
          delivery_address: string | null
          delivery_time: string | null
          payment_method: 'cash' | 'card' | 'online'
          payment_status: 'pending' | 'paid' | 'failed'
          discount_amount: number | null
          discount_code: string | null
          tax_amount: number | null
          subtotal: number | null
          tip_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          table_number?: string | null
          items: OrderItem[]
          total_amount: number
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'refunded'
          notes?: string | null
          user_id?: string | null
          guest_token_id?: string | null
          delivery_type?: 'pickup' | 'delivery' | 'dine_in'
          delivery_address?: string | null
          delivery_time?: string | null
          payment_method?: 'cash' | 'card' | 'online'
          payment_status?: 'pending' | 'paid' | 'failed'
          discount_amount?: number | null
          discount_code?: string | null
          tax_amount?: number | null
          subtotal?: number | null
          tip_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          table_number?: string | null
          items?: OrderItem[]
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'refunded'
          notes?: string | null
          user_id?: string | null
          guest_token_id?: string | null
          delivery_type?: 'pickup' | 'delivery' | 'dine_in'
          delivery_address?: string | null
          delivery_time?: string | null
          payment_method?: 'cash' | 'card' | 'online'
          payment_status?: 'pending' | 'paid' | 'failed'
          discount_amount?: number | null
          discount_code?: string | null
          tax_amount?: number | null
          subtotal?: number | null
          tip_amount?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          email_verified: boolean | null
          email_verification_token: string | null
          email_verification_expires: string | null
          password_hash: string
          magic_link_token: string | null
          magic_link_expires: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          email_verified?: boolean | null
          email_verification_token?: string | null
          email_verification_expires?: string | null
          password_hash: string
          magic_link_token?: string | null
          magic_link_expires?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          email_verified?: boolean | null
          email_verification_token?: string | null
          email_verification_expires?: string | null
          password_hash?: string
          magic_link_token?: string | null
          magic_link_expires?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loyalty_programs: {
        Row: {
          id: string
          name: string
          description: string
          type: 'purchase_count' | 'google_review'
          required_count: number
          reward_description: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          type: 'purchase_count' | 'google_review'
          required_count: number
          reward_description: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: 'purchase_count' | 'google_review'
          required_count?: number
          reward_description?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_loyalty_progress: {
        Row: {
          id: string
          user_id: string
          loyalty_program_id: string
          current_count: number
          completed_count: number
          last_action_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          loyalty_program_id: string
          current_count?: number
          completed_count?: number
          last_action_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          loyalty_program_id?: string
          current_count?: number
          completed_count?: number
          last_action_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loyalty_rewards: {
        Row: {
          id: string
          user_id: string
          loyalty_program_id: string
          reward_code: string
          is_used: boolean
          used_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          loyalty_program_id: string
          reward_code: string
          is_used?: boolean
          used_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          loyalty_program_id?: string
          reward_code?: string
          is_used?: boolean
          used_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      guest_tokens: {
        Row: {
          id: string
          token: string
          user_data: Record<string, unknown> | null
          converted_to_user_id: string | null
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          token: string
          user_data?: Record<string, unknown> | null
          converted_to_user_id?: string | null
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          token?: string
          user_data?: Record<string, unknown> | null
          converted_to_user_id?: string | null
          created_at?: string
          expires_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          order_id: string | null
          type: string
          title: string
          message: string
          data: Record<string, unknown> | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          type: string
          title: string
          message: string
          data?: Record<string, unknown> | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          type?: string
          title?: string
          message?: string
          data?: Record<string, unknown> | null
          is_read?: boolean
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          username: string
          password_hash: string
          role: string
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          role?: string
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          role?: string
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      export_logs: {
        Row: {
          id: string
          admin_user_id: string
          export_type: string
          filters: Record<string, unknown> | null
          row_count: number | null
          file_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id: string
          export_type: string
          filters?: Record<string, unknown> | null
          row_count?: number | null
          file_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string
          export_type?: string
          filters?: Record<string, unknown> | null
          row_count?: number | null
          file_url?: string | null
          created_at?: string
        }
      }
      google_reviews: {
        Row: {
          id: string
          user_id: string
          review_id: string
          rating: number
          review_text: string | null
          reviewer_name: string | null
          review_date: string | null
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          review_id: string
          rating: number
          review_text?: string | null
          reviewer_name?: string | null
          review_date?: string | null
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          review_id?: string
          rating?: number
          review_text?: string | null
          reviewer_name?: string | null
          review_date?: string | null
          verified?: boolean
          created_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: number
          name: string
          type: 'size' | 'addon' | 'option'
          is_required: boolean
          min_selection: number
          max_selection: number
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: number
          name: string
          type: 'size' | 'addon' | 'option'
          is_required?: boolean
          min_selection?: number
          max_selection?: number
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: number
          name?: string
          type?: 'size' | 'addon' | 'option'
          is_required?: boolean
          min_selection?: number
          max_selection?: number
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      variant_options: {
        Row: {
          id: string
          variant_id: string
          name: string
          price_modifier: number
          is_default: boolean
          is_available: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          variant_id: string
          name: string
          price_modifier?: number
          is_default?: boolean
          is_available?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          variant_id?: string
          name?: string
          price_modifier?: number
          is_default?: boolean
          is_available?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
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
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type LoyaltyProgram = Tables<'loyalty_programs'>
export type UserLoyaltyProgress = Tables<'user_loyalty_progress'>
export type LoyaltyReward = Tables<'loyalty_rewards'>