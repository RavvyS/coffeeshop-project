'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Download,
  Share2,
  Coffee,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  estimated_ready_time?: string;
  special_instructions?: string;
  created_at: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  notes?: string;
  menu_item: {
    name: string;
    category: string;
  };
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    } else {
      setError('No order number provided');
      setLoading(false);
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items (
              name,
              category
            )
          )
        `)
        .eq('order_number', orderNumber)
        .single();

      if (error) throw error;

      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const getOrderTypeDisplay = (orderType: string) => {
    const types = {
      dine_in: { label: 'Dine In', icon: '🍽️' },
      takeaway: { label: 'Takeaway', icon: '🥪' },
      delivery: { label: 'Delivery', icon: '🚚' },
    };
    return types[orderType as keyof typeof types] || { label: orderType, icon: '📋' };
  };

  const shareOrder = async () => {
    const shareData = {
      title: `Order #${order?.order_number} - Brew & Bean`,
      text: `My coffee order from Brew & Bean is confirmed!`,
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

  const downloadReceipt = () => {
    // In a real app, this would generate a PDF receipt
    toast.info('Receipt download feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Card className="p-8">
            <div className="text-red-500 mb-4">
              <Coffee className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'We couldn\'t find the order you\'re looking for.'}
            </p>
            <div className="space-y-3">
              <Link href="/menu">
                <Button className="w-full">Browse Menu</Button>
              </Link>
              <Link href="/dashboard/orders">
                <Button variant="ghost" className="w-full">View Order History</Button>
              </Link>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const orderTypeInfo = getOrderTypeDisplay(order.order_type);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">Thank you for choosing Brew & Bean</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Order #{order.order_number}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <Badge variant="success">{order.status.toUpperCase()}</Badge>
                    <div className="flex items-center text-coffee-600">
                      <span className="text-xl mr-2">{orderTypeInfo.icon}</span>
                      <span className="font-medium">{orderTypeInfo.label}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={shareOrder}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={downloadReceipt}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Your Items</h3>
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.menu_item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.quantity}x • {formatCurrency(item.unit_price)} each
                      </p>
                      {item.notes && (
                        <p className="text-sm text-coffee-600 italic mt-1">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Instructions */}
              {order.special_instructions && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">Special Instructions</h4>
                  <p className="text-yellow-700">{order.special_instructions}</p>
                </div>
              )}
            </Card>

            {/* What's Next */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-coffee-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-600">
                      We've received your order and sent a confirmation email
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Preparation</p>
                    <p className="text-sm text-gray-600">
                      Our baristas are preparing your order with care
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.order_type === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.order_type === 'delivery' 
                        ? 'Your order is on its way to you'
                        : 'We\'ll notify you when your order is ready'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-semibold text-xl text-coffee-600">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Ordered:</span>
                  <span className="text-sm font-medium">
                    {formatDate(order.created_at)} at {formatTime(new Date(order.created_at).toTimeString().slice(0, 5))}
                  </span>
                </div>
                
                {order.estimated_ready_time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Est. {order.order_type === 'delivery' ? 'Delivery' : 'Ready'}:
                    </span>
                    <span className="text-sm font-medium text-coffee-600">
                      {formatTime(new Date(order.estimated_ready_time).toTimeString().slice(0, 5))}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Live Tracking */}
            <Card className="bg-coffee-500 text-white">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-3 text-cream-200" />
                <h3 className="font-semibold mb-2">Live Order Tracking</h3>
                <p className="text-coffee-100 text-sm mb-4">
                  Get real-time updates on your order status
                </p>
                <Link href="/dashboard/orders">
                  <Button variant="secondary" size="sm" className="w-full">
                    Track Your Order
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Contact Info */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-coffee-500" />
                  <div>
                    <p className="text-sm font-medium">Call us</p>
                    <p className="text-sm text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-coffee-500" />
                  <div>
                    <p className="text-sm font-medium">Email us</p>
                    <p className="text-sm text-gray-600">hello@brewbean.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-coffee-500" />
                  <div>
                    <p className="text-sm font-medium">Visit us</p>
                    <p className="text-sm text-gray-600">
                      123 Coffee Street<br />
                      Seattle, WA 98101
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link href="/menu">
                <Button variant="ghost" className="w-full justify-start">
                  <Coffee className="h-4 w-4 mr-2" />
                  Order Again
                </Button>
              </Link>
              
              <Link href="/dashboard/feedback">
                <Button variant="ghost" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Feedback
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <Card className="mt-8 bg-blue-50">
          <div className="flex items-start space-x-4">
            <CheckCircle className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Order Confirmation Sent</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Confirmation email has been sent to your registered email</p>
                <p>• You'll receive updates as your order progresses</p>
                <p>• Order can be tracked in real-time from your dashboard</p>
                <p>• Questions? Call us at (555) 123-4567</p>
              </div>
            </div>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}