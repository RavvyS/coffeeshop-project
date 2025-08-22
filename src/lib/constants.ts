/**
 * Application constants and configuration values
 * Centralized place for all static values used throughout the app
 */

// App Information
export const APP_NAME = 'Brew & Bean';
export const APP_DESCRIPTION = 'Premium coffee shop management system';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Business Hours
export const BUSINESS_HOURS = {
  monday: { open: '07:00', close: '20:00', closed: false },
  tuesday: { open: '07:00', close: '20:00', closed: false },
  wednesday: { open: '07:00', close: '20:00', closed: false },
  thursday: { open: '07:00', close: '20:00', closed: false },
  friday: { open: '07:00', close: '21:00', closed: false },
  saturday: { open: '08:00', close: '21:00', closed: false },
  sunday: { open: '08:00', close: '19:00', closed: false },
};

// Reservation Configuration
export const RESERVATION_CONFIG = {
  maxGuestsPerReservation: 12,
  minAdvanceBookingHours: 2,
  maxAdvanceBookingDays: 30,
  slotDurationMinutes: 30,
  bufferTimeMinutes: 15,
  defaultDurationHours: 2,
};

// Order Configuration
export const ORDER_CONFIG = {
  maxItemsPerOrder: 20,
  maxQuantityPerItem: 10,
  estimatedPrepTimeMinutes: {
    coffee: 5,
    tea: 3,
    food: 15,
    dessert: 8,
    beverage: 3,
  },
  taxRate: 0.08, // 8% tax
  serviceFee: 0.02, // 2% service fee
};

// Menu Categories
export const MENU_CATEGORIES = [
  { id: 'coffee', name: 'Coffee', icon: '☕', order: 1 },
  { id: 'tea', name: 'Tea', icon: '🍵', order: 2 },
  { id: 'food', name: 'Food', icon: '🥐', order: 3 },
  { id: 'dessert', name: 'Desserts', icon: '🧁', order: 4 },
  { id: 'beverage', name: 'Cold Beverages', icon: '🥤', order: 5 },
] as const;

// Status Options
export const RESERVATION_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'confirmed', label: 'Confirmed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
  { value: 'completed', label: 'Completed', color: 'info' },
  { value: 'no_show', label: 'No Show', color: 'error' },
] as const;

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'confirmed', label: 'Confirmed', color: 'info' },
  { value: 'preparing', label: 'Preparing', color: 'warning' },
  { value: 'ready', label: 'Ready', color: 'success' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
] as const;

export const FEEDBACK_TYPES = [
  { value: 'complaint', label: 'Complaint', icon: '😞' },
  { value: 'suggestion', label: 'Suggestion', icon: '💡' },
  { value: 'compliment', label: 'Compliment', icon: '😊' },
  { value: 'inquiry', label: 'Inquiry', icon: '❓' },
  { value: 'other', label: 'Other', icon: '📝' },
] as const;

// Pagination
export const PAGINATION_LIMITS = {
  reservations: 10,
  orders: 15,
  feedback: 10,
  menuItems: 20,
} as const;

// File Upload
export const FILE_UPLOAD_CONFIG = {
  maxSizeMB: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  dimensions: {
    menuItem: { width: 400, height: 300 },
    avatar: { width: 150, height: 150 },
  },
};

// Email Templates
export const EMAIL_TEMPLATES = {
  reservationConfirmation: 'reservation_confirmation',
  reservationUpdate: 'reservation_update',
  reservationCancellation: 'reservation_cancellation',
  orderConfirmation: 'order_confirmation',
  orderReady: 'order_ready',
  feedbackReceived: 'feedback_received',
  welcomeEmail: 'welcome_email',
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/brewandbean',
  facebook: 'https://facebook.com/brewandbean',
  twitter: 'https://twitter.com/brewandbean',
  linkedin: 'https://linkedin.com/company/brewandbean',
} as const;

// Contact Information
export const CONTACT_INFO = {
  phone: '+1 (555) 123-4567',
  email: 'hello@brewandbean.com',
  address: {
    street: '123 Coffee Street',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'USA',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: 'bb_theme',
  cart: 'bb_cart',
  recentOrders: 'bb_recent_orders',
  preferences: 'bb_preferences',
} as const;

