'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { realtimeManager } from '@/lib/realtime';
import type { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];
type Reservation = Database['public']['Tables']['reservations']['Row'];
type Feedback = Database['public']['Tables']['feedback']['Row'];

interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    preparing: number;
    ready: number;
    completed: number;
    todayRevenue: number;
  };
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
    todayCount: number;
  };
  feedback: {
    total: number;
    open: number;
    avgRating: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'order' | 'reservation' | 'feedback';
  message: string;
  timestamp: string;
  status: string;
}

/**
 * Live Admin Dashboard Hook
 * Provides real-time admin statistics and activity feed
 */
export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    orders: { total: 0, pending: 0, preparing: 0, ready: 0, completed: 0, todayRevenue: 0 },
    reservations: { total: 0, pending: 0, confirmed: 0, todayCount: 0 },
    feedback: { total: 0, open: 0, avgRating: 0 },
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calculate dashboard statistics
   */
  const calculateStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) throw ordersError;

      // Fetch reservations
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('*');

      if (reservationsError) throw reservationsError;

      // Fetch feedback
      const { data: feedback, error: feedbackError } = await supabase
        .from('feedback')
        .select('*');

      if (feedbackError) throw feedbackError;

      // Calculate order stats
      const orderStats = {
        total: orders?.length || 0,
        pending: orders?.filter(o => o.status === 'pending').length || 0,
        preparing: orders?.filter(o => o.status === 'preparing').length || 0,
        ready: orders?.filter(o => o.status === 'ready').length || 0,
        completed: orders?.filter(o => o.status === 'completed').length || 0,
        todayRevenue: orders?.filter(o => 
          o.created_at.startsWith(today) && o.status === 'completed'
        ).reduce((sum, order) => sum + order.total_amount, 0) || 0,
      };

      // Calculate reservation stats
      const reservationStats = {
        total: reservations?.length || 0,
        pending: reservations?.filter(r => r.status === 'pending').length || 0,
        confirmed: reservations?.filter(r => r.status === 'confirmed').length || 0,
        todayCount: reservations?.filter(r => r.reservation_date === today).length || 0,
      };

      // Calculate feedback stats
      const feedbackWithRatings = feedback?.filter(f => f.rating !== null) || [];
      const avgRating = feedbackWithRatings.length > 0
        ? feedbackWithRatings.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackWithRatings.length
        : 0;

      const feedbackStats = {
        total: feedback?.length || 0,
        open: feedback?.filter(f => f.status === 'open').length || 0,
        avgRating: Math.round(avgRating * 10) / 10,
      };

      setStats({
        orders: orderStats,
        reservations: reservationStats,
        feedback: feedbackStats,
      });

    } catch (err) {
      console.error('Error calculating stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate statistics');
    }
  };

  /**
   * Add activity to recent feed
   */
  const addActivity = (activity: Omit<RecentActivity, 'id'>) => {
    const newActivity: RecentActivity = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setRecentActivity(prev => [newActivity, ...prev.slice(0, 19)]); // Keep last 20
  };

  /**
   * Handle real-time order updates
   */
  const handleOrderUpdate = (payload: any) => {
    console.log('Admin dashboard - order update:', payload);

    // Update stats
    calculateStats();

    // Add to activity feed
    if (payload.eventType === 'INSERT') {
      addActivity({
        type: 'order',
        message: `New order #${payload.new.order_number} received`,
        timestamp: payload.new.created_at,
        status: payload.new.status,
      });
    } else if (payload.eventType === 'UPDATE') {
      if (payload.old.status !== payload.new.status) {
        addActivity({
          type: 'order',
          message: `Order #${payload.new.order_number} status: ${payload.new.status}`,
          timestamp: payload.new.updated_at,
          status: payload.new.status,
        });
      }
    }
  };

  /**
   * Handle real-time reservation updates
   */
  const handleReservationUpdate = (payload: any) => {
    console.log('Admin dashboard - reservation update:', payload);

    // Update stats
    calculateStats();

    // Add to activity feed
    if (payload.eventType === 'INSERT') {
      addActivity({
        type: 'reservation',
        message: `New reservation for ${payload.new.guest_name} (${payload.new.guest_count} guests)`,
        timestamp: payload.new.created_at,
        status: payload.new.status,
      });
    } else if (payload.eventType === 'UPDATE') {
      if (payload.old.status !== payload.new.status) {
        addActivity({
          type: 'reservation',
          message: `Reservation for ${payload.new.guest_name} status: ${payload.new.status}`,
          timestamp: payload.new.updated_at,
          status: payload.new.status,
        });
      }
    }
  };

  /**
   * Handle real-time feedback updates
   */
  const handleFeedbackUpdate = (payload: any) => {
    console.log('Admin dashboard - feedback update:', payload);

    // Update stats
    calculateStats();

    // Add to activity feed
    if (payload.eventType === 'INSERT') {
      const rating = payload.new.rating ? ` (${payload.new.rating}★)` : '';
      addActivity({
        type: 'feedback',
        message: `New ${payload.new.type}: ${payload.new.subject}${rating}`,
        timestamp: payload.new.created_at,
        status: payload.new.status,
      });
    }
  };

  /**
   * Update order status
   */
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      // Stats will be updated via real-time subscription
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  };

  /**
   * Update reservation status
   */
  const updateReservationStatus = async (reservationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId);

      if (error) throw error;

      // Stats will be updated via real-time subscription
    } catch (err) {
      console.error('Error updating reservation status:', err);
      throw err;
    }
  };

  /**
   * Update feedback status
   */
  const updateFeedbackStatus = async (feedbackId: string, status: string, adminResponse?: string) => {
    try {
      const updates: any = { status };
      if (adminResponse) {
        updates.admin_response = adminResponse;
      }

      const { error } = await supabase
        .from('feedback')
        .update(updates)
        .eq('id', feedbackId);

      if (error) throw error;

      // Stats will be updated via real-time subscription
    } catch (err) {
      console.error('Error updating feedback status:', err);
      throw err;
    }
  };

  // Set up real-time subscriptions for admin dashboard
  useEffect(() => {
    // Subscribe to all order changes
    realtimeManager.subscribe(
      'admin_orders',
      'orders',
      undefined,
      handleOrderUpdate
    );

    // Subscribe to all reservation changes
    realtimeManager.subscribe(
      'admin_reservations',
      'reservations',
      undefined,
      handleReservationUpdate
    );

    // Subscribe to all feedback changes
    realtimeManager.subscribe(
      'admin_feedback',
      'feedback',
      undefined,
      handleFeedbackUpdate
    );

    return () => {
      realtimeManager.unsubscribe('admin_orders');
      realtimeManager.unsubscribe('admin_reservations');
      realtimeManager.unsubscribe('admin_feedback');
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await calculateStats();
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  return {
    stats,
    recentActivity,
    loading,
    error,
    updateOrderStatus,
    updateReservationStatus,
    updateFeedbackStatus,
    refetch: calculateStats,
  };
}