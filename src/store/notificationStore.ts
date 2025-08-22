import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: string;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

/**
 * Notification Store using Zustand
 * Manages application-wide notifications
 */
export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  /**
   * Add a new notification
   */
  addNotification: (notification) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date().toISOString(),
      autoClose: notification.autoClose ?? true,
      duration: notification.duration ?? 5000,
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove notification if autoClose is enabled
    if (newNotification.autoClose) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }
  },

  /**
   * Remove specific notification
   */
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  /**
   * Clear all notifications
   */
  clearNotifications: () => {
    set({ notifications: [] });
  },
}));

// Helper functions for common notification types
export const notifications = {
  success: (title: string, message?: string) => 
    useNotificationStore.getState().addNotification({ type: 'success', title, message }),
  
  error: (title: string, message?: string) => 
    useNotificationStore.getState().addNotification({ type: 'error', title, message }),
  
  warning: (title: string, message?: string) => 
    useNotificationStore.getState().addNotification({ type: 'warning', title, message }),
  
  info: (title: string, message?: string) => 
    useNotificationStore.getState().addNotification({ type: 'info', title, message }),
};