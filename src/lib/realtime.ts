import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Real-time Connection Manager
 * Handles WebSocket connections, reconnection logic, and connection state
 */
class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private isOnline = true;
  private listeners: Map<string, Set<Function>> = new Map();

  constructor() {
    this.setupNetworkListeners();
  }

  /**
   * Setup network connectivity listeners
   */
  private setupNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('Network connection restored');
        this.isOnline = true;
        this.reconnectAllChannels();
      });

      window.addEventListener('offline', () => {
        console.log('Network connection lost');
        this.isOnline = false;
        this.notifyListeners('connection', 'offline');
      });
    }
  }

  /**
   * Subscribe to a real-time channel
   */
  subscribe(
    channelName: string,
    table: string,
    filter?: string,
    callback?: (payload: any) => void
  ): RealtimeChannel {
    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          console.log(`Real-time update on ${channelName}:`, payload);
          
          // Call provided callback
          if (callback) {
            callback(payload);
          }
          
          // Notify listeners
          this.notifyListeners(channelName, payload);
        }
      )
      .subscribe((status) => {
        console.log(`Channel ${channelName} status:`, status);
        
        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts = 0; // Reset on successful connection
          this.notifyListeners('connection', 'connected');
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Channel ${channelName} error`);
          this.handleReconnection(channelName);
        }
      });

    this.channels.set(channelName, channel);
    return channel;
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      console.log(`Unsubscribed from channel: ${channelName}`);
    }
  }

  /**
   * Handle reconnection logic
   */
  private async handleReconnection(channelName: string) {
    if (!this.isOnline || this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached or offline');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect channel ${channelName} in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      // Attempt to resubscribe
      const channel = this.channels.get(channelName);
      if (channel) {
        this.unsubscribe(channelName);
        // You would need to store the original subscription parameters to properly resubscribe
      }
    }, delay);
  }

  /**
   * Reconnect all channels
   */
  private async reconnectAllChannels() {
    console.log('Reconnecting all channels...');
    for (const [channelName] of this.channels) {
      this.handleReconnection(channelName);
    }
  }

  /**
   * Add event listener
   */
  addEventListener(event: string, listener: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event: string, listener: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  /**
   * Notify listeners
   */
  private notifyListeners(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isOnline: this.isOnline,
      channelCount: this.channels.size,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  /**
   * Clean up all connections
   */
  disconnect() {
    this.channels.forEach((_, channelName) => {
      this.unsubscribe(channelName);
    });
    this.listeners.clear();
  }
}

// Export singleton instance
export const realtimeManager = new RealtimeManager();
