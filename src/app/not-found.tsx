import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Coffee, Home } from 'lucide-react';

/**
 * 404 Not Found Page Component
 * Custom 404 page with coffee shop branding
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-coffee-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-soft p-8">
          <div className="flex justify-center mb-4">
            <Coffee className="h-16 w-16 text-coffee-500" />
          </div>
          
          <h1 className="text-6xl font-bold text-coffee-500 mb-2">404</h1>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-6">
            Looks like this page took a coffee break and never came back. Let's get you back to something delicious!
          </p>
          
          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Link href="/menu">
              <Button variant="ghost" className="w-full">
                <Coffee className="w-4 h-4 mr-2" />
                View Our Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}