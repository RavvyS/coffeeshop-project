'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { realtimeManager } from '@/lib/realtime';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type MenuItem = Database['public']['Tables']['menu_items']['Row'];

interface QueueOrder extends Order {
  order_items: (OrderItem & { menu_item: MenuItem })[];
  queue_position?: number;
  estimated_wait_time?: number;
}

interface QueueStats {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  avgPrepTime: number;
  currentWaitTime: number;
}

/**
 * Live Order Queue Hook
 * Provides real-time order queue with position tracking and wait times
 */
export function useOrderQueue() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<QueueOrder[]>([]);
  const [userOrders, setUserOrders] = useState<QueueOrder[]>([]);
  const [queueStats, setQueueStats] = useState<QueueStats>({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    avgPrepTime: 0,
    currentWaitTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calculate queue position and wait time for each order
   */
  const calculateQueueMetrics = (ordersList: QueueOrder[]) => {
    const activeOrders = ordersList.filter(order => 
      ['pending', 'confirmed', 'preparing'].includes(order.status)
    );

    // Sort by created_at for queue position
    const sortedOrders = [...activeOrders].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Calculate queue positions and wait times
    const ordersWithQueue = sortedOrders.map((order, index) => {
      const queuePosition = index + 1;
      
      // Estimate wait time based on position and average prep time
      const baseWaitTime = 15; // Base wait time in minutes
      const additionalWaitTime = index * 8; // 8 minutes per order ahead
      const estimatedWaitTime = baseWaitTime + additionalWaitTime;

      return {
        ...order,
        queue_position: queuePosition,
        estimated_wait_time: estimatedWaitTime,
      };
    });

    // Add completed orders without queue metrics
    const completedOrders = ordersList.filter(order => 
      !['pending', 'confirmed', 'preparing'].includes(order.status)
    );

    return [...ordersWithQueue, ...completedOrders];
  };

  /**
   * Calculate overall queue statistics
   */
  const calculateQueueStats = (ordersList: QueueOrder[]): QueueStats => {
    const pendingOrders = ordersList.filter(o => o.status === 'pending').length;
    const preparingOrders = ordersList.filter(o => o.status === 'preparing').length;
    const totalActiveOrders = ordersList.filter(o => 
      ['pending', 'confirmed', 'preparing'].includes(o.status)
    ).length;

    // Calculate average prep time from recent completed orders
    const recentCompleted = ordersList
      .filter(o => o.status === 'completed')
      .slice(0, 10); // Last 10 completed orders

    const avgPrepTime = recentCompleted.length > 0
      ? recentCompleted.reduce((sum, order) => {
          const created = new Date(order.created_at).getTime();
          const updated = new Date(order.updated_at).getTime();
          return sum + ((updated - created) / (1000 * 60)); // Convert to minutes
        }, 0) / recentCompleted.length
      : 15; // Default 15 minutes

    const currentWaitTime = totalActiveOrders * 8; // Rough estimate

    return {
      totalOrders: ordersList.length,
      pendingOrders,
      preparingOrders,
      avgPrepTime: Math.round(avgPrepTime),
      currentWaitTime,
    };
  };

  /**
   * Fetch all orders for queue calculation
   */
  const fetchOrders = async () => {
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
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      const ordersWithQueue = calculateQueueMetrics(data as QueueOrder[] || []);
      setOrders(ordersWithQueue);

      // Filter user orders if logged in
      if (user) {
        const userOrdersList = ordersWithQueue.filter(order => order.user_id === user.id);
        setUserOrders(userOrdersList);
      }

      // Calculate queue statistics
      const stats = calculateQueueStats(ordersWithQueue);
      setQueueStats(stats);

    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle real-time order updates
   */
  const handleOrderUpdate = (payload: any) => {
    console.log('Order queue update:', payload);

    setOrders(prevOrders => {
      let updatedOrders;

      switch (payload.eventType) {
        case 'INSERT':
          updatedOrders = [...prevOrders, payload.new as QueueOrder];
          break;
        case 'UPDATE':
          updatedOrders = prevOrders.map(order =>
            order.id === payload.new.id 
              ? { ...order, ...payload.new } as QueueOrder
              : order
          );
          break;
        case 'DELETE':
          updatedOrders = prevOrders.filter(order => order.id !== payload.old.id);
          break;
        default:
          return prevOrders;
      }

      // Recalculate queue metrics
      const ordersWithQueue = calculateQueueMetrics(updatedOrders);
      
      // Update user orders if user is logged in
      if (user) {
        const userOrdersList = ordersWithQueue.filter(order => order.user_id === user.id);
        setUserOrders(userOrdersList);
      }

      // Update queue statistics
      const stats = calculateQueueStats(ordersWithQueue);
      setQueueStats(stats);

      return ordersWithQueue;
    });
  };

  /**
   * Get user's current order in queue
   */
  const getCurrentUserOrder = () => {
    return userOrders.find(order => 
      ['pending', 'confirmed', 'preparing'].includes(order.status)
    );
  };

  /**
   * Get estimated wait time for new orders
   */
  const getEstimatedWaitForNewOrder = () => {
    const activeOrders = orders.filter(order => 
      ['pending', 'confirmed', 'preparing'].includes(order.status)
    );
    return Math.max(15, activeOrders.length * 8); // Minimum 15 minutes
  };

  // Set up real-time subscription
  useEffect(() => {
    const handleRealtimeUpdate = (payload: any) => {
      handleOrderUpdate(payload);
    };

    // Subscribe to order changes
    realtimeManager.subscribe(
      'order_queue',
      'orders',
      undefined,
      handleRealtimeUpdate
    );

    return () => {
      realtimeManager.unsubscribe('order_queue');
    };
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    userOrders,
    queueStats,
    loading,
    error,
    getCurrentUserOrder,
    getEstimatedWaitForNewOrder,
    refetch: fetchOrders,
  };
}