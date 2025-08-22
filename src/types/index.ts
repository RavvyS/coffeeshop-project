/**
 * Central type definitions for the Coffee Shop application
 * All TypeScript interfaces and types are defined here for consistency
 */

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'staff';
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Authentication Types
export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    avatar_url?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

// Reservation Types
export interface Reservation {
  id: string;
  user_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  reservation_date: string; // ISO date string
  reservation_time: string; // HH:MM format
  guest_count: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  created_at: string;
  updated_at: string;
  // Relationships
  user?: User;
}

export interface CreateReservationData {
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  special_requests?: string;
}

// Menu & Order Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'tea' | 'food' | 'dessert' | 'beverage';
  image_url?: string;
  available: boolean;
  preparation_time: number; // in minutes
  allergens?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  notes?: string;
  // Relationships
  menu_item?: MenuItem;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string; // Human-readable order number
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  estimated_ready_time?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  // Relationships
  user?: User;
  order_items?: OrderItem[];
}

export interface CreateOrderData {
  items: Array<{
    menu_item_id: string;
    quantity: number;
    notes?: string;
  }>;
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  special_instructions?: string;
}

// Feedback Types
export interface Feedback {
  id: string;
  user_id: string;
  type: 'complaint' | 'suggestion' | 'compliment' | 'inquiry' | 'other';
  subject: string;
  message: string;
  rating?: number; // 1-5 stars
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  admin_response?: string;
  created_at: string;
  updated_at: string;
  // Relationships
  user?: User;
}

export interface CreateFeedbackData {
  type: Feedback['type'];
  subject: string;
  message: string;
  rating?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

// Store Types (for Zustand)
export interface AuthStore {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: string;
  autoClose?: boolean;
}