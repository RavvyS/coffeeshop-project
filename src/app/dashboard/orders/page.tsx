import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LiveOrderTracking } from '@/components/orders/LiveOrderTracking';
import { EnhancedHeader } from '@/components/layout/EnhancedHeader';

/**
 * Live Order Tracking Page
 * Example of Week 2 integration with email and real-time features
 */
export default function LiveOrderTrackingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <EnhancedHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Order Tracking</h1>
            <p className="text-gray-600">
              Track your orders in real-time with live updates and notifications.
            </p>
          </div>
          
          <LiveOrderTracking />
        </main>
      </div>
    </ProtectedRoute>
  );
}
