'use client';

import { useEffect, useState } from 'react';
import { useOrderQueue } from '@/hooks/useOrderQueue';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Clock, Users, TrendingUp, Coffee, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, formatTime } from '@/lib/utils';

/**
 * Live Order Tracking Component
 * Shows real-time order status with queue position and estimated wait time
 */
export function LiveOrderTracking() {
  const { 
    userOrders, 
    queueStats, 
    getCurrentUserOrder, 
    getEstimatedWaitForNewOrder,
    loading 
  } = useOrderQueue();

  const [currentTime, setCurrentTime] = useState(new Date());
  const currentOrder = getCurrentUserOrder();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Queue Statistics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Queue Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-coffee-600">{queueStats.pendingOrders}</div>
            <div className="text-sm text-gray-600">Pending Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{queueStats.preparingOrders}</div>
            <div className="text-sm text-gray-600">Being Prepared</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{queueStats.avgPrepTime}m</div>
            <div className="text-sm text-gray-600">Avg Prep Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{getEstimatedWaitForNewOrder()}m</div>
            <div className="text-sm text-gray-600">Est. Wait Time</div>
          </div>
        </div>
      </Card>

      {/* Current Order Status */}
      {currentOrder && (
        <Card className="border-l-4 border-l-coffee-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{currentOrder.order_number}
              </h3>
              <p className="text-sm text-gray-600">
                {formatCurrency(currentOrder.total_amount)} • {currentOrder.order_type.replace('_', ' ')}
              </p>
            </div>
            <StatusBadge status={currentOrder.status} />
          </div>

          {/* Order Progress */}
          <OrderProgressBar status={currentOrder.status} />

          {/* Queue Information */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Position: {currentOrder.queue_position || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Est. Wait: {currentOrder.estimated_wait_time || 0}m
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Updated: {formatTime(new Date().toTimeString().slice(0, 5))}
              </span>
            </div>
          </div>

          {/* Estimated Ready Time */}
          {currentOrder.estimated_ready_time && (
            <div className="mt-4 p-3 bg-coffee-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Coffee className="h-4 w-4 text-coffee-600" />
                <span className="text-sm font-medium text-coffee-800">
                  Estimated Ready: {formatTime(new Date(currentOrder.estimated_ready_time).toTimeString().slice(0, 5))}
                </span>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Recent Orders</h3>
        <div className="space-y-3">
          {userOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Coffee className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No orders yet. Place your first order!</p>
            </div>
          ) : (
            userOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">#{order.order_number}</div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(order.total_amount)} • {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

/**
 * Status Badge Component
 */
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    preparing: { color: 'bg-orange-100 text-orange-800', icon: Coffee },
    ready: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    completed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
    cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {status.replace('_', ' ').toUpperCase()}
    </div>
  );
}

/**
 * Order Progress Bar Component
 */
function OrderProgressBar({ status }: { status: string }) {
  const steps = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex items-center ${
              index <= currentStepIndex ? 'text-coffee-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                index <= currentStepIndex
                  ? 'bg-coffee-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="ml-2 text-xs font-medium capitalize hidden sm:inline">
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-coffee-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}