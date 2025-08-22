import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Coffee, Calendar, ShoppingCart } from 'lucide-react';

/**
 * Hero Section Component
 * Main landing section with call-to-action
 */
export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-coffee-100" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-coffee-900 mb-6">
            Welcome to{' '}
            <span className="gradient-coffee bg-clip-text text-transparent">
              Brew & Bean
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-coffee-700 mb-8 max-w-3xl mx-auto">
            Experience the finest coffee, delicious food, and exceptional service. 
            Reserve your table, order ahead, and join our coffee community.
          </p>
          
          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/menu">
              <Button size="lg" className="w-full sm:w-auto">
                <Coffee className="h-5 w-5 mr-2" />
                View Menu
              </Button>
            </Link>
            
            <Link href="/reservations">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Calendar className="h-5 w-5 mr-2" />
                Make Reservation
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-coffee-600">10k+</div>
              <div className="text-coffee-700">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coffee-600">50+</div>
              <div className="text-coffee-700">Coffee Varieties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coffee-600">5★</div>
              <div className="text-coffee-700">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}