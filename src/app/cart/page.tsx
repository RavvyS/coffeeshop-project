'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/components/auth/AuthProvider';
import { ShoppingCart, ArrowLeft, Clock, Coffee } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { user } = useAuth();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalItems, 
    getTotalPrice,
    getEstimatedPrepTime 
  } = useCartStore();
  
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('takeaway');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const tax = getTotalPrice() * 0.08; // 8% tax
  const serviceFee = getTotalPrice() * 0.02; // 2% service fee
  const finalTotal = getTotalPrice() + tax + serviceFee;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      window.location.href = '/auth/login';
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    
    try {
      // TODO: Implement order creation with useOrders hook
      // const orderData = {
      //   items: items.map(item => ({
      //     menu_item_id: item.id,
      //     quantity: item.quantity,
      //     notes: item.notes,
      //   })),
      //   order_type: orderType,
      //   special_instructions: specialInstructions,
      // };
      // await createOrder(orderData);
      
      // For now, just show success and redirect
      toast.success('Order placed successfully!');
      clearCart();
      window.location.href = '/dashboard/orders';
    } catch (error) {
      console.error('Order failed:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. 
              Browse our delicious menu to get started!
            </p>
            <Link href="/menu">
              <Button size="lg">
                <Coffee className="h-5 w-5 mr-2" />
                Browse Menu
              </Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-600">{getTotalItems()} items • Estimated prep time: {getEstimatedPrepTime()} minutes</p>
          </div>
          <Link href="/menu">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {formatCurrency(item.price)} each • 
                      <Clock className="h-3 w-3 inline mx-1" />
                      {item.preparation_time}m prep
                    </p>
                    {item.notes && (
                      <p className="text-sm text-gray-500 mt-2">
                        <strong>Note:</strong> {item.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <Button variant="ghost" onClick={handleClearCart} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Type */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Type</h3>
              <div className="space-y-2">
                {[
                  { value: 'dine_in', label: 'Dine In', description: 'Enjoy in our cafe' },
                  { value: 'takeaway', label: 'Takeaway', description: 'Pick up when ready' },
                  { value: 'delivery', label: 'Delivery', description: 'We\'ll bring it to you' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="orderType"
                      value={option.value}
                      checked={orderType === option.value}
                      onChange={(e) => setOrderType(e.target.value as any)}
                      className="text-coffee-500 focus:ring-coffee-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* Special Instructions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests or dietary requirements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                rows={3}
              />
            </Card>

            {/* Order Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee (2%)</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                loading={isProcessing}
                className="w-full mt-6"
                size="lg"
              >
                {user ? 'Place Order' : 'Sign In to Order'}
              </Button>
              
              {!user && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  You'll need to sign in to complete your order
                </p>
              )}
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}