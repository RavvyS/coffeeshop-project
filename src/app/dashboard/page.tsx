'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ShoppingCart, 
  Calendar, 
  MessageCircle, 
  Clock, 
  TrendingUp,
  Coffee,
  Star,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const quickStats = [
    { label: 'Orders This Month', value: '12', icon: ShoppingCart, color: 'text-coffee-600' },
    { label: 'Upcoming Reservations', value: '3', icon: Calendar, color: 'text-blue-600' },
    { label: 'Loyalty Points', value: '450', icon: Star, color: 'text-yellow-600' },
    { label: 'Favorite Items', value: '8', icon: Coffee, color: 'text-coffee-600' },
  ];

  const quickActions = [
    {
      title: 'Order Coffee',
      description: 'Browse our menu and place a new order',
      icon: Plus,
      href: '/menu',
      color: 'bg-coffee-500 hover:bg-coffee-600'
    },
    {
      title: 'Make Reservation',
      description: 'Book a table for your next visit',
      icon: Calendar,
      href: '/reservations',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Track Orders',
      description: 'View your order status in real-time',
      icon: Clock,
      href: '/dashboard/orders',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Send Feedback',
      description: 'Share your experience with us',
      icon: MessageCircle,
      href: '/dashboard/feedback',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
  ];

  const recentActivity = [
    {
      type: 'order',
      title: 'Order #ORD-20241201-1234 completed',
      time: '2 hours ago',
      icon: ShoppingCart,
      color: 'text-green-600'
    },
    {
      type: 'reservation',
      title: 'Reservation confirmed for Dec 15th',
      time: '1 day ago',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      type: 'feedback',
      title: 'Feedback submitted and reviewed',
      time: '3 days ago',
      icon: MessageCircle,
      color: 'text-purple-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0]}! ☕
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your Brew & Bean experience.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-white mb-4 ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-coffee-600">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Button variant="ghost" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full bg-white ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {recentActivity.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm">Your activity will appear here</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Order Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Order</h3>
            <div className="text-center py-6">
              <Coffee className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No active orders</p>
              <Link href="/menu">
                <Button size="sm">Place Order</Button>
              </Link>
            </div>
          </Card>

          {/* Loyalty Program */}
          <Card className="p-6 bg-gradient-to-br from-coffee-500 to-coffee-600 text-white">
            <div className="text-center">
              <Star className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="text-lg font-semibold mb-2">Loyalty Points</h3>
              <div className="text-3xl font-bold mb-2">450</div>
              <p className="text-coffee-100 text-sm mb-4">
                50 points away from your next reward!
              </p>
              <div className="w-full bg-coffee-400 rounded-full h-2 mb-4">
                <div className="bg-yellow-300 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <Button variant="secondary" size="sm">
                View Rewards
              </Button>
            </div>
          </Card>

          {/* Next Reservation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Reservation</h3>
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No upcoming reservations</p>
              <Link href="/reservations">
                <Button size="sm" variant="ghost">Book Table</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation Links */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore More</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/orders" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart className="h-5 w-5 text-coffee-500 mr-3" />
            <span className="font-medium text-gray-700">My Orders</span>
          </Link>
          <Link href="/dashboard/reservations" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-5 w-5 text-blue-500 mr-3" />
            <span className="font-medium text-gray-700">Reservations</span>
          </Link>
          <Link href="/dashboard/feedback" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="h-5 w-5 text-purple-500 mr-3" />
            <span className="font-medium text-gray-700">Feedback</span>
          </Link>
          <Link href="/menu" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Coffee className="h-5 w-5 text-coffee-500 mr-3" />
            <span className="font-medium text-gray-700">Menu</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}