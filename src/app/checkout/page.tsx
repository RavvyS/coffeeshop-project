'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/components/auth/AuthProvider';
import { useOrders } from '@/hooks/useOrders';
import { 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Clock, 
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Coffee
} from 'lucide-react';
import { formatCurrency, formatTime } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface CheckoutFormData {
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  specialInstructions: string;
  paymentMethod: 'card' | 'cash';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, clearCart, getTotalItems, getTotalPrice, getEstimatedPrepTime } = useCartStore();
  const { createOrder } = useOrders();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    orderType: 'takeaway',
    customerName: user?.user_metadata?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    specialInstructions: '',
    paymentMethod: 'card',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu');
    }
  }, [items.length, router]);

  // Calculate totals
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = formData.orderType === 'delivery' ? (subtotal >= 25 ? 0 : 2.99) : 0;
  const serviceFee = subtotal * 0.02; // 2% service fee
  const total = subtotal + tax + deliveryFee + serviceFee;

  // Estimated ready time
  const estimatedReadyTime = new Date();
  estimatedReadyTime.setMinutes(estimatedReadyTime.getMinutes() + getEstimatedPrepTime() + (formData.orderType === 'delivery' ? 20 : 0));

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }

    if (formData.orderType === 'delivery' && !formData.deliveryAddress?.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber?.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Card number is required';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (formData.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }

      if (!formData.cardholderName?.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    if (!user) {
      toast.error('Please sign in to place an order');
      router.push('/auth/login');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderData = {
        items: items.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          notes: item.notes,
        })),
        order_type: formData.orderType,
        special_instructions: formData.specialInstructions,
      };

      const { data: order, error } = await createOrder(orderData);

      if (error) {
        throw new Error(error);
      }

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push(`/order-success?order=${order?.order_number}`);

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete your order</p>
          </div>
          <Link href="/cart">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Type */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'dine_in', label: 'Dine In', icon: '🍽️', description: 'Enjoy in our cafe' },
                    { value: 'takeaway', label: 'Takeaway', icon: '🥪', description: 'Pick up when ready' },
                    { value: 'delivery', label: 'Delivery', icon: '🚚', description: 'We\'ll bring it to you' }
                  ].map((option) => (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="orderType"
                        value={option.value}
                        checked={formData.orderType === option.value}
                        onChange={(e) => handleInputChange('orderType', e.target.value as any)}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg transition-colors text-center ${
                        formData.orderType === option.value
                          ? 'border-coffee-500 bg-coffee-50'
                          : 'border-gray-200 hover:border-coffee-300'
                      }`}>
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>

              {/* Customer Information */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    error={errors.customerName}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    error={errors.customerEmail}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    error={errors.customerPhone}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </Card>

              {/* Delivery Address */}
              {formData.orderType === 'delivery' && (
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
                  <Input
                    label="Street Address"
                    value={formData.deliveryAddress || ''}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    error={errors.deliveryAddress}
                    placeholder="123 Main St, Seattle, WA 98101"
                    required
                  />
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">Delivery Info</span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Delivery available within 5 miles of our location. Free delivery on orders over $25.
                    </p>
                  </div>
                </Card>
              )}

              {/* Special Instructions */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Special Instructions</h2>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Any special requests, allergies, or delivery notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                />
              </Card>

              {/* Payment Method */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                
                {/* Payment Type Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value as any)}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg transition-colors ${
                      formData.paymentMethod === 'card'
                        ? 'border-coffee-500 bg-coffee-50'
                        : 'border-gray-200 hover:border-coffee-300'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-coffee-600" />
                        <span className="font-medium">Credit/Debit Card</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value as any)}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg transition-colors ${
                      formData.paymentMethod === 'cash'
                        ? 'border-coffee-500 bg-coffee-50'
                        : 'border-gray-200 hover:border-coffee-300'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <span className="text-coffee-600 text-xl">💵</span>
                        <span className="font-medium">Pay at {formData.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Card Details */}
                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <Input
                      label="Card Number"
                      value={formData.cardNumber || ''}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        value={formData.expiryDate || ''}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          handleInputChange('expiryDate', value);
                        }}
                        error={errors.expiryDate}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                      <Input
                        label="CVV"
                        value={formData.cvv || ''}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        error={errors.cvv}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                    <Input
                      label="Cardholder Name"
                      value={formData.cardholderName || ''}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      error={errors.cardholderName}
                      placeholder="Name on card"
                      required
                    />
                  </div>
                )}
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-gray-500 italic">Note: {item.notes}</p>
                        )}
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>{formatCurrency(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </Card>

              {/* Estimated Time */}
              <Card>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-coffee-500" />
                  <div>
                    <p className="font-medium">Estimated {formData.orderType === 'delivery' ? 'Delivery' : 'Ready'} Time</p>
                    <p className="text-coffee-600">{formatTime(estimatedReadyTime.toTimeString().slice(0, 5))}</p>
                  </div>
                </div>
              </Card>

              {/* Place Order Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isProcessing}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order • ${formatCurrency(total)}`}
              </Button>

              {/* Security Notice */}
              <div className="text-center text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Secure checkout</span>
                </div>
                <p>Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
}