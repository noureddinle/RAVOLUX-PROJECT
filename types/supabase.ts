// src/types/supabase.ts
export type UUID = string;
export type Timestamp = string;

// Address structure (used in orders and users)
export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string; // Changed from zip to match database JSONB
  country: string;
  company?: string;
}

export type UserRole = "user" | "admin";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"; // Aligned with database
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"; // Aligned with database

// Users Table
export interface UserForm {
  id: UUID;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  billing_address?: Address;
  shipping_address?: Address;
  email_notifications: boolean;
  marketing_emails: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
  orders?: Order[];
  carts?: Cart[];
  accessToken?: string;
}

export interface UserInsert {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  billing_address?: Address;
  shipping_address?: Address;
  email_notifications?: boolean;
  marketing_emails?: boolean;
}

export interface UserUpdate {
  name?: string;
  phone?: string;
  billing_address?: Address;
  shipping_address?: Address;
  email_notifications?: boolean;
  marketing_emails?: boolean;
}

// Products Table
export interface Product {
  id: UUID;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  description: string;
  specifications?: Record<string, string>;
  thumbnail_image?: string;
  images: string[];
  slug?: string;
  weight_kg?: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  rating?: number;
  brand?: string;
  is_new?: boolean;
  is_best_seller?: boolean;
  model: string;
  features?: string[];
  is_featured?: boolean;
  in_stock?: boolean;
  stock_count?: number;
}

export interface ProductInsert {
  name: string;
  sku: string;
  category: string;
  brand?: string;
  model: string;
  price: number;
  stock_quantity?: number;
  is_active?: boolean;
  is_new?: boolean;
  is_best_seller?: boolean;
  is_featured?: boolean;
  rating?: number;
  in_stock?: boolean;
  description: string;
  specifications?: Record<string, string>;
  features?: string[];
  thumbnail_image?: string;
  images?: string[];
  slug?: string;
  weight_kg?: number;
  stock_count?: number;
}

export interface ProductUpdate extends Partial<ProductInsert> {}

// Cart System
export interface Cart {
  id: UUID;
  user_id?: UUID;
  session_id?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  items?: CartItem[];
  user?: UserForm;
}

export interface CartInsert {
  user_id?: UUID;
  session_id?: string;
}

export interface CartItem {
  id: UUID;
  cart_id: UUID;
  product_id: UUID;
  quantity: number;
  price_at_time: number;
  name: string;
  price: number;
  image: string;
  created_at: Timestamp;
  cart?: Cart;
  product?: Product;
}

export interface CartItemInsert {
  cart_id: UUID;
  product_id: UUID;
  quantity: number;
  price_at_time: number;
}

export interface CartItemUpdate {
  quantity?: number;
}

// Orders System
export interface Order {
  id: UUID;
  order_number: string;
  user_id?: UUID;
  session_id?: string;
  status: OrderStatus;
  total_amount: number;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  billing_address: Address;
  shipping_address?: Address;
  shipping_cost: number;
  delivery_address: Address;
  payment_method: string; // Allow extensibility
  payment_status: PaymentStatus;
  discount?: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  shipped_at?: Timestamp;
  delivered_at?: Timestamp;
  items?: OrderItem[];
  user?: UserForm;
}

export interface OrderInsert {
  order_number?: string; // Optional, generated server-side
  user_id?: UUID;
  session_id?: string;
  status?: OrderStatus;
  total_amount: number;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  billing_address: Address;
  shipping_address?: Address;
  shipping_cost?: number;
  delivery_address: Address;
  payment_method: string;
  payment_status?: PaymentStatus;
  discount?: number;
}

export interface OrderUpdate {
  status?: OrderStatus;
  shipping_cost?: number;
  payment_status?: PaymentStatus;
  shipped_at?: Timestamp;
  delivered_at?: Timestamp;
  discount?: number;
}

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_id?: UUID;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: Timestamp;
  order?: Order;
  product?: Product;
}

export interface OrderItemInsert {
  order_id?: UUID;
  product_id?: UUID;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderItemUpdate {
  quantity?: number;
}

export interface OrderItemDelete {
  id: UUID;
}

// Newsletter Subscriptions
export interface NewsletterSubscription {
  id: UUID;
  email: string;
  is_active: boolean;
  subscribed_at: Timestamp;
  unsubscribed_at?: Timestamp;
}

export interface NewsletterSubscriptionInsert {
  email: string;
  is_active?: boolean;
}

export interface NewsletterSubscriptionUpdate {
  is_active?: boolean;
}

// Contact Messages
export interface ContactMessage {
  id: UUID;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: Timestamp;
}

export interface ContactMessageInsert {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactMessageUpdate {
  is_read?: boolean;
}

// Database Schema Type
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserForm;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
      carts: {
        Row: Cart;
        Insert: CartInsert;
        Update: never;
      };
      cart_items: {
        Row: CartItem;
        Insert: CartItemInsert;
        Update: CartItemUpdate;
      };
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: OrderUpdate;
      };
      order_items: {
        Row: OrderItem;
        Insert: OrderItemInsert;
        Update: never;
      };
      newsletter_subscriptions: {
        Row: NewsletterSubscription;
        Insert: NewsletterSubscriptionInsert;
        Update: NewsletterSubscriptionUpdate;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: ContactMessageInsert;
        Update: ContactMessageUpdate;
      };
    };
    Functions: {
      get_or_create_cart: {
        Args: { p_user_id: UUID; p_session_id: string };
        Returns: UUID;
      };
      merge_carts: {
        Args: { p_user_id: UUID; p_session_id: string };
        Returns: void;
      };
      subscribe_newsletter: {
        Args: { p_email: string };
        Returns: boolean;
      };
      unsubscribe_newsletter: {
        Args: { p_email: string };
        Returns: boolean;
      };
    };
  };
}

// Extended types with relations
export interface CartWithItems extends Cart {
  items: (CartItem & {
    product: Product;
  })[];
}

export interface OrderWithDetails extends Order {
  items: (OrderItem & {
    product?: Product;
  })[];
}

// Search/Filter types
export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search?: string;
  is_active?: boolean;
}

export interface ProductSortOptions {
  field: "name" | "price" | "created_at" | "stock_quantity";
  direction: "asc" | "desc";
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiSuccess {
  success: boolean;
  message: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}