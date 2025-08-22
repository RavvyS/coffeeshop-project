'use client';

import { useState } from 'react';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { 
  Bell, 
  BellRing, 
  Coffee, 
  Calendar, 
  MessageCircle, 
  Settings,
  X,
  Check,
  CheckCheck,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Notification Center Component
 * Shows live notifications with management capabilities
 */
export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useRealTimeNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const getIcon = (type: string) => {
    const icons = {
      order: Coffee,
      reservation: Calendar,
      feedback: MessageCircle,
      system: Settings,
    };
    return icons[type as keyof typeof icons] || Bell;
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || notification.type === filter
  );

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="relative p-2"
        >
          {isConnected && unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-coffee-600" />
          ) : (
            <Bell className="h-5 w-5 text-gray-600" />
          )}
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>

        {/* Connection Status Indicator */}
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
          title={isConnected ? 'Connected' : 'Disconnected'}
        />
      </div>

      {/* Notification Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Notifications"
        size="lg"
      >
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Live updates active' : 'Connection lost'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadNotifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 border-b">
            {['all', 'order', 'reservation', 'feedback', 'system'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  filter === filterType
                    ? 'border-coffee-500 text-coffee-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType !== 'all' && (
                  <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {notifications.filter(n => n.type === filterType).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications yet.</p>
                <p className="text-sm">You'll see live updates here when they arrive!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all ${
                      notification.read
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white border-coffee-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'order' ? 'bg-coffee-100 text-coffee-600' :
                        notification.type === 'reservation' ? 'bg-blue-100 text-blue-600' :
                        notification.type === 'feedback' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`text-sm font-medium ${
                              notification.read ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </p>
                            <p className={`text-sm mt-1 ${
                              notification.read ? 'text-gray-500' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs p-1"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-coffee-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}