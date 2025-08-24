import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EnhancedHeader } from '@/components/layout/EnhancedHeader';
import { Footer } from '@/components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <EnhancedHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}