'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  ArrowLeft,
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Share2,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Coffee,
  User,
  Calendar,
  DollarSign,
  MessageCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { formatCurrency, formatDate, formatTime, getRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  estimated_ready_time?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  notes?: string;
  menu_item: {
    name: string;
    description: string;
    category: string;
    preparation_time: number;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      setupRealtimeSubscription();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items (
              name,
              description,
              category,
              preparation_time
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      // Check if user owns this order
      if (user && data.user_id !== user.id) {
        setError('You don\'t have permission to view this order');
        return;
      }

      setOrder(data);
      
      // Fetch status history (mock data - in real app this would be from audit table)
      const mockHistory = [
        {
          status: 'pending',
          timestamp: data.created_at,
          message: 'Order placed successfully'
        },
        ...(data.status !== 'pending' ? [{
          status: data.status,
          timestamp: data.updated_at,
          message: getStatusMessage(data.status)
        }] : [])
      ];
      setStatusHistory(mockHistory);

    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Order not found or access denied');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('order_detail')
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order updated:', payload);
          setOrder(prev => prev ? { ...prev, ...payload.new } as Order : null);
          
          // Show toast notification for status changes
          if (payload.old.status !== payload.new.status) {
            const statusMessage = getStatusMessage(payload.new.status);
            toast.success(statusMessage);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const getStatusMessage = (status: string): string => {
    const messages = {
      pending: 'Order is being processed',
      confirmed: 'Order confirmed! We\'re preparing your items.',
      preparing: 'Your order is being prepared by our baristas',
      ready: 'Order is ready for pickup/delivery! 🎉',
      completed: 'Order completed. Thank you for choosing us!',
      cancelled: 'Order has been cancelled'
    };
    return messages[status as keyof typeof messages] || 'Status updated';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'warning',
      ready: 'success',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getOrderTypeInfo = (orderType: string) => {
    const types = {
      dine_in: { label: 'Dine In', icon: '🍽️', description: 'Enjoy in our cafe' },
      takeaway: { label: 'Takeaway', icon: '🥪', description: 'Pick up when ready' },
      delivery: { label: 'Delivery', icon: '🚚', description: 'We\'ll bring it to you' },
    };
    return types[orderType as keyof typeof types] || { label: orderType, icon: '📋', description: '' };
  };

  const calculateEstimatedTime = () => {
    if (!order || order.status === 'completed' || order.status === 'cancelled') return null;
    
    if (order.estimated_ready_time) {
      return new Date(order.estimated_ready_time);
    }

    // Calculate based on preparation times
    const totalPrepTime = order.order_items.reduce((total, item) => {
      return total + (item.menu_item.preparation_time * item.quantity);
    }, 0);

    const estimatedTime = new Date(order.created_at);
    estimatedTime.setMinutes(estimatedTime.getMinutes() + Math.max(15, totalPrepTime));
    
    return estimatedTime;
  };

  const shareOrder = async () => {
    const shareData = {
      title: `Order #${order?.order_number} - Brew & Bean`,
      text: `Check out my order from Brew & Bean`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Order link copied to clipboard!');
      }
    } catch (err) {
      toast.error('Failed to share order');
    }
  };

  const reorderItems = () => {
    // In a real app, this would add items to cart
    toast.info('Reorder feature coming soon!');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/dashboard/orders">
            <Button>Back to Orders</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const orderTypeInfo = getOrderTypeInfo(order.order_type);
  const estimatedTime = calculateEstimatedTime();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.order_number}
            </h1>
            <p className="text-gray-600">
              Placed {getRelativeTime(order.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={shareOrder}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchOrderDetails}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant={getStatusColor(order.status) as any} className="text-sm px-3 py-1">
                    {order.status.toUpperCase()}
                  </Badge>
                  <div className="flex items-center space-x-2 text-coffee-600">
                    <span className="text-xl">{orderTypeInfo.icon}</span>
                    <span className="font-medium">{orderTypeInfo.label}</span>
                  </div>
                </div>
                <p className="text-gray-600">{getStatusMessage(order.status)}</p>
              </div>
              
              {estimatedTime && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Est. {order.order_type === 'delivery' ? 'Delivery' : 'Ready'}
                  </p>
                  <p className="font-semibold text-coffee-600">
                    {formatTime(estimatedTime.toTimeString().slice(0, 5))}
                  </p>
                </div>
              )}
            </div>

            {/* Status Progress */}
            <div className="space-y-3">