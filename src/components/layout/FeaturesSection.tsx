import { Card } from '@/components/ui/Card';
import { 
  Calendar, 
  ShoppingCart, 
  MessageCircle, 
  Clock,
  Coffee,
  Star
} from 'lucide-react';

/**
 * Features Section Component
 * Showcases main app features and benefits
 */
export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Reservations',
      description: 'Book your perfect coffee date or business meeting with our simple reservation system. Real-time availability and instant confirmation.',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: ShoppingCart,
      title: 'Online Ordering',
      description: 'Order ahead and skip the line with our virtual queue system. Track your order status in real-time and get notified when ready.',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: MessageCircle,
      title: 'Feedback & Support',
      description: 'Share your experience and get quick support. Your feedback helps us serve you better and improve continuously.',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Stay informed with live notifications about your orders, reservations, and special offers. Never miss a beat.',
      color: 'text-orange-600 bg-orange-100',
    },
    {
      icon: Coffee,
      title: 'Premium Quality',
      description: 'Ethically sourced beans, expertly roasted, and carefully crafted by our skilled baristas. Quality you can taste.',
      color: 'text-coffee-600 bg-coffee-100',
    },
    {
      icon: Star,
      title: 'Loyalty Rewards',
      description: 'Earn points with every visit and unlock exclusive rewards. The more you visit, the more you save.',
      color: 'text-yellow-600 bg-yellow-100',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-coffee-900 mb-4">
            Why Choose Brew & Bean?
          </h2>
          <p className="text-xl text-coffee-700 max-w-3xl mx-auto">
            We've designed every aspect of our service to give you the best coffee experience possible.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              hover
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}