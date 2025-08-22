'use client';

import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  ShoppingCart, 
  Calendar, 
  MessageCircle, 
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Clock,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDistanceToNow } from '@/lib/utils';

/**
 * Live Admin Dashboard Component
 * Real-time admin statistics and activity monitoring
 */
export function LiveAdminDashboard() {
  const {
    stats,
    recentActivity,
    loading,
    error,
    updateOrderStatus,
    updateReservationStatus,
    updateFeedbackStatus,
    refetch,
  } = useAdminDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load dashboard: {error}</p>
        <Button onClick={refetch}>Try Again</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Live Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live updates active</span>
          </div>
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Orders Stats */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.orders.total}</p>
            </div>
            <div className="p-3 bg-coffee-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-coffee-600" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="text-yellow-600">Pending: {stats.orders.pending}</div>
            <div className="text-orange-600">Preparing: {stats.orders.preparing}</div>
            <div className="text-green-600">Ready: {stats.orders.ready}</div>
            <div className="text-gray-600">Completed: {stats.orders.completed}</div>
          </div>
        </Card>

        {/* Revenue Stats */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.orders.todayRevenue)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Live revenue tracking</span>
          </div>
        </Card>

        {/* Reservations Stats */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reservations.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="text-yellow-600">Pending: {stats.reservations.pending}</div>
            <div className="text-green-600">Confirmed: {stats.reservations.confirmed}</div>
            <div className="text-blue-600 col-span-2">Today: {stats.reservations.todayCount}</div>
          </div>
        </Card>

        {/* Feedback Stats */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{stats.feedback.total}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="text-red-600">Open: {stats.feedback.open}</div>
            <div className="flex items-center text-yellow-600">
              <Star className="h-3 w-3 mr-1" />
              {stats.feedback.avgRating}/5
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Real-time updates</span>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">Activity will appear here in real-time</p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className={`p-2 rounded-full ${
                  activity.type === 'order' ? 'bg-coffee-100 text-coffee-600' :
                  activity.type === 'reservation' ? 'bg-blue-100 text-blue-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.type === 'order' && <ShoppingCart className="h-4 w-4" />}
                  {activity.type === 'reservation' && <Calendar className="h-4 w-4" />}
                  {activity.type === 'feedback' && <MessageCircle className="h-4 w-4" />}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  activity.status === 'confirmed' || activity.status === 'ready' ? 'bg-green-100 text-green-800' :
                  activity.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => window.location.href = '/admin/orders'}
            className="justify-start"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Manage Orders
          </Button>
          <Button
            onClick={() => window.location.href = '/admin/reservations'}
            variant="secondary"
            className="justify-start"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Manage Reservations
          </Button>
          <Button
            onClick={() => window.location.href = '/admin/feedback'}
            variant="ghost"
            className="justify-start"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            View Feedback
          </Button>
        </div>
      </Card>
    </div>
  );
}