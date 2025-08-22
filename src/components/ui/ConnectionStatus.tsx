'use client';

import { useState, useEffect } from 'react';
import { realtimeManager } from '@/lib/realtime';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

/**
 * Connection Status Component
 * Shows real-time connection status with visual indicators
 */
export function ConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState(realtimeManager.getConnectionStatus());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleConnectionChange = () => {
      setConnectionStatus(realtimeManager.getConnectionStatus());
    };

    realtimeManager.addEventListener('connection', handleConnectionChange);

    // Check status periodically
    const interval = setInterval(handleConnectionChange, 5000);

    return () => {
      realtimeManager.removeEventListener('connection', handleConnectionChange);
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = () => {
    if (!connectionStatus.isOnline) return 'text-red-500';
    if (connectionStatus.reconnectAttempts > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (!connectionStatus.isOnline) return <WifiOff className="h-4 w-4" />;
    if (connectionStatus.reconnectAttempts > 0) return <AlertCircle className="h-4 w-4" />;
    return <Wifi className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!connectionStatus.isOnline) return 'Offline';
    if (connectionStatus.reconnectAttempts > 0) return 'Reconnecting...';
    return 'Connected';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center space-x-2 px-2 py-1 rounded text-sm ${getStatusColor()} hover:bg-gray-100 transition-colors`}
      >
        {getStatusIcon()}
        <span className="hidden sm:inline">{getStatusText()}</span>
      </button>

      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
          <h4 className="font-medium text-gray-900 mb-2">Connection Status</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={getStatusColor()}>{getStatusText()}</span>
            </div>
            <div className="flex justify-between">
              <span>Channels:</span>
              <span>{connectionStatus.channelCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Reconnect Attempts:</span>
              <span>{connectionStatus.reconnectAttempts}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}