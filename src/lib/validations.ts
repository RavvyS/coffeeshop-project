import { z } from 'zod';

/**
 * Validation schemas using Zod
 * Consistent validation rules for forms throughout the app
 */

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Reservation schema
export const reservationSchema = z.object({
  guest_name: z.string().min(2, 'Name must be at least 2 characters'),
  guest_email: z.string().email('Please enter a valid email address'),
  guest_phone: z.string().optional(),
  reservation_date: z.string().min(1, 'Please select a date'),
  reservation_time: z.string().min(1, 'Please select a time'),
  guest_count: z.number().min(1, 'At least 1 guest required').max(12, 'Maximum 12 guests allowed'),
  special_requests: z.string().optional(),
});

// Feedback schema
export const feedbackSchema = z.object({
  type: z.enum(['complaint', 'suggestion', 'compliment', 'inquiry', 'other']),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  rating: z.number().min(1).max(5).optional(),
});

// Order schema
export const orderSchema = z.object({
  order_type: z.enum(['dine_in', 'takeaway', 'delivery']),
  special_instructions: z.string().optional(),
  items: z.array(z.object({
    menu_item_id: z.string().uuid(),
    quantity: z.number().min(1).max(10),
    notes: z.string().optional(),
  })).min(1, 'At least one item is required'),
});

// Type exports for use in components
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ReservationFormData = z.infer<typeof reservationSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
