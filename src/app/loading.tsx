import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Global Loading Component
 * Displays while pages are loading (Next.js App Router feature)
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-coffee-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-coffee-600 font-medium">
          Brewing something amazing...
        </p>
      </div>
    </div>
  );
}