import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CreditCard, 
  ShoppingCart,
  Calendar,
  Coffee,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const FAQ_CATEGORIES = [
  {
    id: 'orders',
    name: 'Orders & Delivery',
    icon: ShoppingCart,
    questions: [
      {
        q: 'How do I place an order?',
        a: 'You can place orders through our website by browsing the menu, adding items to your cart, and checking out. You can choose dine-in, takeaway, or delivery options.'
      },
      {
        q: 'How long does it take to prepare my order?',
        a: 'Most orders take 10-15 minutes to prepare. You\'ll receive real-time updates on your order status through our live tracking system.'
      },
      {
        q: 'Can I modify my order after placing it?',
        a: 'Orders can be modified within 5 minutes of placing them. After that, please call us directly at (555) 123-4567 to discuss changes.'
      },
      {
        q: 'Do you offer delivery?',
        a: 'Yes! We offer delivery within a 5-mile radius of our location. Delivery fee is $2.99 with free delivery on orders over $25.'
      }
    ]
  },
  {
    id: 'reservations',
    name: 'Reservations',
    icon: Calendar,
    questions: [
      {
        q: 'How far in advance can I make a reservation?',
        a: 'You can make reservations up to 30 days in advance. We recommend booking at least 24 hours ahead for weekend evenings.'
      },
      {
        q: 'Can I cancel or modify my reservation?',
        a: 'Yes, you can cancel or modify reservations up to 2 hours before your scheduled time through your dashboard or by calling us.'
      },
      {
        q: 'What\'s your policy for no-shows?',
        a: 'We hold tables for 15 minutes past the reservation time. Repeated no-shows may affect your ability to make future reservations.'
      },
      {
        q: 'Do you accommodate large groups?',
        a: 'We can accommodate groups up to 12 people through our online system. For larger groups, please call us directly to discuss arrangements.'
      }
    ]
  },
  {
    id: 'menu',
    name: 'Menu & Dietary',
    icon: Coffee,
    questions: [
      {
        q: 'Do you have vegan options?',
        a: 'Yes! We offer plant-based milk alternatives (oat, almond, soy) and several vegan food options. Look for the "vegan" tag on menu items.'
      },
      {
        q: 'Can you accommodate food allergies?',
        a: 'We take allergies seriously. All menu items list common allergens. Please inform our staff of any allergies when ordering.'
      },
      {
        q: 'Do you have gluten-free options?',
        a: 'We offer several gluten-free pastries and can prepare drinks without any gluten-containing additives. Items are clearly marked on our menu.'
      },
      {
        q: 'Where do you source your coffee beans?',
        a: 'We work directly with sustainable farms in Ethiopia, Colombia, and Guatemala. All our beans are ethically sourced and freshly roasted weekly.'
      }
    ]
  },
  {
    id: 'payment',
    name: 'Payment & Pricing',
    icon: CreditCard,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards, debit cards, Apple Pay, Google Pay, and cash for in-store purchases.'
      },
      {
        q: 'Do you have a loyalty program?',
        a: 'Yes! Earn points with every purchase. 100 points = $5 reward. You automatically earn points when you create an account.'
      },
      {
        q: 'Are there any additional fees?',
        a: 'Delivery orders have a $2.99 fee (free over $25). All prices include tax. No hidden fees or service charges.'
      },
      {
        q: 'Do you offer discounts?',
        a: 'We offer student discounts (10% with valid ID), loyalty member specials, and occasional seasonal promotions.'
      }
    ]
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter FAQs based on search
  const filteredFAQs = FAQ_CATEGORIES.map(category => ({
    ...category,
    questions: category.questions.filter(
      qa => 
        qa.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qa.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    !searchQuery || category.questions.length > 0
  );

  const displayCategories = selectedCategory 
    ? filteredFAQs.filter(cat => cat.id === selectedCategory)
    : filteredFAQs;

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-coffee-50 to-cream-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-900 mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl text-coffee-700 mb-8">
            Find quick answers to common questions or get in touch with our team
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Phone className="h-8 w-8 text-coffee-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Mon-Fri 7AM-8PM<br/>Sat-Sun 8AM-9PM</p>
            <a href="tel:+15551234567" className="text-coffee-600 hover:text-coffee-800 font-medium">
              (555) 123-4567
            </a>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Mail className="h-8 w-8 text-coffee-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">We respond within<br/>24 hours</p>
            <a href="mailto:help@brewbean.com" className="text-coffee-600 hover:text-coffee-800 font-medium">
              help@brewbean.com
            </a>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageCircle className="h-8 w-8 text-coffee-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Send Feedback</h3>
            <p className="text-gray-600 mb-4">Share your thoughts<br/>with our team</p>
            <Link href="/dashboard/feedback" className="text-coffee-600 hover:text-coffee-800 font-medium">
              Submit Feedback
            </Link>
          </Card>
        </div>

        {/* Category Filter */}
        {!searchQuery && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant={!selectedCategory ? 'primary' : 'ghost'}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All Topics
            </Button>
            {FAQ_CATEGORIES.map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'ghost'}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        )}

        {/* FAQ Sections */}
        <div className="space-y-8">
          {displayCategories.map(category => {
            const Icon = category.icon;
            return (
              <div key={category.id}>
                <div className="flex items-center mb-6">
                  <Icon className="h-6 w-6 text-coffee-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                </div>
                
                <div className="space-y-4">
                  {category.questions.map((qa, index) => (
                    <Card key={index} className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {qa.q}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{qa.a}</p>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {searchQuery && displayCategories.every(cat => cat.questions.length === 0) && (
          <Card className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any help articles matching "{searchQuery}"
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Try:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery('order')}>
                  order
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery('reservation')}>
                  reservation
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery('payment')}>
                  payment
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Still Need Help */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-coffee-500 to-coffee-600 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="mb-6 text-coffee-100">
            Can't find what you're looking for? Our friendly team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="secondary">
                <Mail className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
            </Link>
            <a href="tel:+15551234567">
              <Button variant="secondary">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </a>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}