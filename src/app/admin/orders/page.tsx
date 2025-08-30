'use client';

import { useState, useEffect } from 'react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  User, 
  Phone, 
  Mail,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Calendar
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
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
  order_items?: OrderItem[];
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  notes?: string;
  menu_item: {
    name: string;
    category: string;
  };
}

export default function AdminOrdersPage() {
  const { updateOrderStatus } = useAdminDashboard();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Fetch orders with related data
  const fetchOrders = async () => {
    try {
      setLoading(true);
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
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user data for each order
      const ordersWithUsers = await Promise.all(
        (data || []).map(async (order) => {
          const { data: userData } = await supabase.auth.admin.getUserById(order.user_id);
          return {
            ...order,
            user: {
              name: userData?.user?.user_metadata?.name || 'Unknown User',
              email: userData?.user?.email || 'No email',
              phone: userData?.user?.user_metadata?.phone,
            }
          };
        })
      );

      setOrders(ordersWithUsers);
      setFilteredOrders(ordersWithUsers);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Order type filter
    if (orderTypeFilter !== 'all') {
      filtered = filtered.filter(order => order.order_type === orderTypeFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, orderTypeFilter]);

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Get status color
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

  // Get next possible statuses
  const getNextStatuses = (currentStatus: string) => {
    const statusFlow = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['completed'],
      completed: [],
      cancelled: [],
    };
    return statusFlow[currentStatus as keyof typeof statusFlow] || [];
  };

  useEffect(() => {
    fetchOrders();

    // Set up real-time subscription
    const subscription = supabase
      .channel('admin_orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and track customer orders in real-time
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={fetchOrders}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-blue-600' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'text-yellow-600' },
          { label: 'Preparing', value: orders.filter(o => o.status === 'preparing').length, color: 'text-orange-600' },
          { label: 'Ready', value: orders.filter(o => o.status === 'ready').length, color: 'text-green-600' },
        ].map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={orderTypeFilter}
            onChange={(e) => setOrderTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500"
          >
            <option value="all">All Types</option>
            <option value="dine_in">Dine In</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
      </Card>

      {/* Orders List */}
      <Card>
        <div className="divide-y divide-gray-200">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Order Header */}
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{order.order_number}
                      </h3>
                      <Badge variant={getStatusColor(order.status) as any}>
                        {order.status.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary">
                        {order.order_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(order.created_at)} at {formatTime(new Date(order.created_at).toTimeString().slice(0, 5))}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{order.user?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{order.user?.email}</span>
                      </div>
                      {order.user?.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{order.user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-semibold">{formatCurrency(order.total_amount)}</span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Items:</p>
                      <div className="text-sm text-gray-800">
                        {order.order_items?.slice(0, 3).map((item, index) => (
                          <span key={item.id}>
                            {item.quantity}x {item.menu_item.name}
                            {index < Math.min(2, (order.order_items?.length || 1) - 1) ? ', ' : ''}
                          </span>
                        ))}
                        {(order.order_items?.length || 0) > 3 && (
                          <span className="text-gray-500"> +{(order.order_items?.length || 0) - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {order.special_instructions && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Special Instructions:</p>
                        <p className="text-sm text-gray-800 italic">{order.special_instructions}</p>
                      </div>
                    )}

                    {/* Estimated Ready Time */}
                    {order.estimated_ready_time && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Ready by: {formatTime(new Date(order.estimated_ready_time).toTimeString().slice(0, 5))}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {/* Quick Status Actions */}
                    {getNextStatuses(order.status).map((nextStatus) => (
                      <Button
                        key={nextStatus}
                        size="sm"
                        variant={nextStatus === 'cancelled' ? 'danger' : 'primary'}
                        onClick={() => handleStatusUpdate(order.id, nextStatus)}
                        loading={updatingOrderId === order.id}
                        disabled={updatingOrderId === order.id}
                      >
                        {nextStatus === 'confirmed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {nextStatus === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                        {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.order_number}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={getStatusColor(selectedOrder.status) as any}>
                  {selectedOrder.status.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Type</p>
                <p className="font-medium">{selectedOrder.order_type.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium text-lg">{formatCurrency(selectedOrder.total_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Time</p>
                <p className="font-medium">{formatDate(selectedOrder.created_at)} at {formatTime(new Date(selectedOrder.created_at).toTimeString().slice(0, 5))}</p>
              </div>
            </div>

            {/* Customer Details */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{selectedOrder.user?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{selectedOrder.user?.email}</span>
                </div>
                {selectedOrder.user?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{selectedOrder.user.phone}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.menu_item.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} • {formatCurrency(item.unit_price)} each
                      </p>
                      {item.notes && (
                        <p className="text-sm text-gray-500 italic">Note: {item.notes}</p>
                      )}
                    </div>
                    <div className="font-medium">
                      {formatCurrency(item.unit_price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            {selectedOrder.special_instructions && (
              <div>
                <h3 className="font-semibold mb-2">Special Instructions</h3>
                <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">
                  {selectedOrder.special_instructions}
                </p>
              </div>
            )}

            {/* Status Update Actions */}
            <div>
              <h3 className="font-semibold mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {getNextStatuses(selectedOrder.status).map((nextStatus) => (
                  <Button
                    key={nextStatus}
                    variant={nextStatus === 'cancelled' ? 'danger' : 'primary'}
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.id, nextStatus);
                      setSelectedOrder(null);
                    }}
                    loading={updatingOrderId === selectedOrder.id}
                  >
                    Update to {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-semibold mb-3">Order Timeline</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Order placed</span>
                  <span className="text-gray-500">{formatDate(selectedOrder.created_at)} at {formatTime(new Date(selectedOrder.created_at).toTimeString().slice(0, 5))}</span>
                </div>
                {selectedOrder.updated_at !== selectedOrder.created_at && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Last updated</span>
                    <span className="text-gray-500">{formatDate(selectedOrder.updated_at)} at {formatTime(new Date(selectedOrder.updated_at).toTimeString().slice(0, 5))}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}