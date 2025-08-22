'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { emailService } from '@/lib/email';
import { generateOrderNumber } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type MenuItem = Database['public']['Tables']['menu_items']['Row'];

interface OrderWithItems extends Order {
  order_items: (OrderItem & { menu_item: MenuItem })[];
  user?: { name: string; email: string };
}

interface CreateOrderData {
  items: Array<{
    menu_item_id: string;
    quantity: number;
    notes?: string;
  }>;
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  special_instructions?: string;
}

/**
 * Enhanced Orders Hook with Email Integration
 * Includes automatic email notifications for order creation and status updates
 */
export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's orders with items and menu details
  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setOrders(data as OrderWithItems[] || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Create a new order with email notification
  const createOrder = async (orderData: CreateOrderData) => {
    if (!user) {
      throw new Error('User must be logged in to create orders');
    }

    try {
      // First, get menu items to calculate total
      const menuItemIds = orderData.items.map(item => item.menu_item_id);
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .in('id', menuItemIds);

      if (menuError) {
        throw menuError;
      }

      // Calculate total amount
      const totalAmount = orderData.items.reduce((total, item) => {
        const menuItem = menuItems?.find(m => m.id === item.menu_item_id);
        return total + (menuItem?.price || 0) * item.quantity;
      }, 0);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: generateOrderNumber(),
          total_amount: totalAmount,
          order_type: orderData.order_type,
          special_instructions: orderData.special_instructions,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = orderData.items.map(item => {
        const menuItem = menuItems?.find(m => m.id === item.menu_item_id);
        return {
          order_id: order.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: menuItem?.price || 0,
          notes: item.notes,
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Fetch the complete order with items for email
      const { data: completeOrder } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items (*)
          )
        `)
        .eq('id', order.id)
        .single();

      // Add user info for email
      const orderWithUser = {
        ...completeOrder,
        user: {
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Customer',
          email: user.email || '',
        }
      };

      // Send confirmation email to customer
      try {
        await emailService.sendOrderConfirmation(orderWithUser);
        toast.success('Order placed! Confirmation email sent.');
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        toast.success('Order placed! (Email notification failed)');
      }

      // Send admin notification
      try {
        await emailService.sendAdminNotification('order', orderWithUser);
      } catch (adminEmailError) {
        console.error('Failed to send admin notification:', adminEmailError);
      }

      // Refresh orders to get the latest data
      await fetchOrders();

      return { data: order, error: null };
    } catch (err) {
      console.error('Error creating order:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  // Handle order status updates (for real-time updates)
  const handleOrderStatusUpdate = async (orderId: string, oldStatus: string, newStatus: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const orderWithUser = {
        ...order,
        user: {
          name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'Customer',
          email: user?.email || '',
        }
      };

      // Send status update email
      await emailService.sendOrderStatusUpdate(orderWithUser, oldStatus, newStatus);
      
      // Show appropriate toast based on status
      const statusMessages = {
        confirmed: 'Order confirmed! You\'ll receive updates as it\'s prepared.',
        preparing: 'Your order is being prepared!',
        ready: 'Order ready for pickup! 🎉',
        completed: 'Thank you for your order!',
        cancelled: 'Order has been cancelled.',
      };

      const message = statusMessages[newStatus as keyof typeof statusMessages];
      if (message) {
        toast.success(message);
      }
    } catch (emailError) {
      console.error('Failed to send order status update email:', emailError);
    }
  };

  // Set up real-time subscription for order updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('user_orders')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Order update:', payload);
          
          // Update the specific order in state
          setOrders(prev =>
            prev.map(order =>
              order.id === payload.new.id 
                ? { ...order, ...payload.new } as OrderWithItems
                : order
            )
          );

          // Send email notification for status changes
          if (payload.new.status !== payload.old.status) {
            handleOrderStatusUpdate(payload.new.id, payload.old.status, payload.new.status);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, orders]);

  // Fetch orders when user changes
  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    error,
    createOrder,
    refetch: fetchOrders,
  };
}
