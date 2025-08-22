'use client';

import { useState, useEffect } from 'react';
import { realtimeManager } from '@/lib/realtime';
import { useAuth } from '@/components/auth/AuthProvider';
import toast from 'react-hot-toast';

interface LiveNotification {
  id: string;
  type: 'order' | 'reservation' | 'feedback' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

/**
 * Real-time Notifications Hook
 * Provides live notifications for orders, reservations, and system updates
 */
export function useRealTimeNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  /**
   * Add a new notification
   */
  const addNotification = (notification: Omit<LiveNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: LiveNotification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast.success(notification.title);

    return newNotification.id;
  };

  /**
   * Mark notification as read
   */
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );

    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  /**
   * Clear all notifications
   */
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  /**
   * Handle order status notifications
   */
  const handleOrderNotification = (payload: any) => {
    if (payload.eventType === 'UPDATE' && payload.new.user_id === user?.id) {
      const oldStatus = payload.old.status;
      const newStatus = payload.new.status;
      
      if (oldStatus !== newStatus) {
        const statusMessages = {
          confirmed: {
            title: 'Order Confirmed! ✅',
            message: `Order ${payload.new.order_number} is confirmed and being prepared.`,
          },
          preparing: {
            title: 'Order Being Prepared! 👨‍🍳',
            message: `Order ${payload.new.order_number} is now being prepared.`,
          },
          ready: {
            title: 'Order Ready! 🎉',
            message: `Order ${payload.new.order_number} is ready for pickup!`,
          },
          completed: {
            title: 'Order Completed! ✨',
            message: `Thank you! Order ${payload.new.order_number} has been completed.`,
          },
          cancelled: {
            title: 'Order Cancelled ❌',
            message: `Order ${payload.new.order_number} has been cancelled.`,
          },
        };

        const statusInfo = statusMessages[newStatus as keyof typeof statusMessages];
        if (statusInfo) {
          addNotification({
            type: 'order',
            title: statusInfo.title,
            message: statusInfo.message,
            data: payload.new,
          });
        }
      }
    }
  };

  /**
   * Handle reservation notifications
   */
  const handleReservationNotification = (payload: any) => {
    if (payload.eventType === 'UPDATE' && payload.new.user_id === user?.id) {
      const oldStatus = payload.old.status;
      const newStatus = payload.new.status;
      
      if (oldStatus !== newStatus) {
        const statusMessages = {
          confirmed: {
            title: 'Reservation Confirmed! ✅',
            message: `Your reservation for ${payload.new.guest_count} guests has been confirmed.`,
          },
          cancelled: {
            title: 'Reservation Cancelled ❌',
            message: `Your reservation has been cancelled.`,
          },
        };

        const statusInfo = statusMessages[newStatus as keyof typeof statusMessages];
        if (statusInfo) {
          addNotification({
            type: 'reservation',
            title: statusInfo.title,
            message: statusInfo.message,
            data: payload.new,
          });
        }
      }
    }
  };

  /**
   * Handle feedback notifications
   */
  const handleFeedbackNotification = (payload: any) => {
    if (payload.eventType === 'UPDATE' && payload.new.user_id === user?.id) {
      // Check if admin responded
      if (payload.new.admin_response && !payload.old.admin_response) {
        addNotification({
          type: 'feedback',
          title: 'Admin Response Received! 💬',
          message: `We've responded to your feedback: "${payload.new.subject}"`,
          data: payload.new,
        });
      }
    }
  };

  /**
   * Handle connection status changes
   */
  const handleConnectionChange = (status: string) => {
    if (status === 'connected' && !isConnected) {
      setIsConnected(true);
      addNotification({
        type: 'system',
        title: 'Connection Restored! 🔄',
        message: 'Real-time updates are now active.',
      });
    } else if (status === 'offline') {
      setIsConnected(false);
      addNotification({
        type: 'system',
        title: 'Connection Lost ⚠️',
        message: 'Some features may not work properly.',
      });
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to order updates
    realtimeManager.subscribe(
      'user_order_notifications',
      'orders',
      `user_id=eq.${user.id}`,
      handleOrderNotification
    );

    // Subscribe to reservation updates
    realtimeManager.subscribe(
      'user_reservation_notifications',
      'reservations',
      `user_id=eq.${user.id}`,
      handleReservationNotification
    );

    // Subscribe to feedback updates
    realtimeManager.subscribe(
      'user_feedback_notifications',
      'feedback',
      `user_id=eq.${user.id}`,
      handleFeedbackNotification
    );

    // Listen for connection changes
    realtimeManager.addEventListener('connection', handleConnectionChange);

    return () => {
      realtimeManager.unsubscribe('user_order_notifications');
      realtimeManager.unsubscribe('user_reservation_notifications');
      realtimeManager.unsubscribe('user_feedback_notifications');
      realtimeManager.removeEventListener('connection', handleConnectionChange);
    };
  }, [user]);

  // Send welcome notification for new users
  useEffect(() => {
    if (user && notifications.length === 0) {
      setTimeout(() => {
        addNotification({
          type: 'system',
          title: 'Welcome to Brew & Bean! ☕',
          message: 'You\'ll receive live updates about your orders and reservations here.',
        });
      }, 1000);
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    isConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
