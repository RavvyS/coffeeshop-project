'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCartStore } from '@/store/cartStore';
import { Coffee, Plus, Minus, ShoppingCart, Clock, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

// Sample menu data (you'll replace this with real data from Supabase)
const SAMPLE_MENU_ITEMS = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Rich, bold single shot of premium coffee',
    price: 3.00,
    category: 'coffee',
    image_url: null,
    available: true,
    preparation_time: 3,
    tags: ['classic', 'strong'],
    allergens: [],
  },
  {
    id: '2',
    name: 'Cappuccino',
    description: 'Perfect balance of espresso, steamed milk, and foam',
    price: 4.50,
    category: 'coffee',
    image_url: null,
    available: true,
    preparation_time: 5,
    tags: ['popular', 'creamy'],
    allergens: ['dairy'],
  },
  {
    id: '3',
    name: 'Latte',
    description: 'Smooth espresso with steamed milk and light foam',
    price: 5.00,
    category: 'coffee',
    image_url: null,
    available: true,
    preparation_time: 5,
    tags: ['popular', 'mild'],
    allergens: ['dairy'],
  },
  {
    id: '4',
    name: 'Americano',
    description: 'Espresso shots with hot water for a clean taste',
    price: 3.75,
    category: 'coffee',
    image_url: null,
    available: true,
    preparation_time: 3,
    tags: ['classic', 'black'],
    allergens: [],
  },
  {
    id: '5',
    name: 'Croissant',
    description: 'Buttery, flaky pastry baked fresh daily',
    price: 3.25,
    category: 'food',
    image_url: null,
    available: true,
    preparation_time: 2,
    tags: ['pastry', 'breakfast'],
    allergens: ['gluten', 'dairy'],
  },
  {
    id: '6',
    name: 'Blueberry Muffin',
    description: 'Moist muffin packed with fresh blueberries',
    price: 4.00,
    category: 'food',
    image_url: null,
    available: true,
    preparation_time: 2,
    tags: ['sweet', 'breakfast'],
    allergens: ['gluten', 'dairy', 'eggs'],
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: '🍽️' },
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'tea', name: 'Tea', icon: '🍵' },
  { id: 'food', name: 'Food', icon: '🥐' },
  { id: 'dessert', name: 'Desserts', icon: '🧁' },
  { id: 'beverage', name: 'Cold Drinks', icon: '🥤' },
];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { items: cartItems, addItem, getTotalItems, getTotalPrice } = useCartStore();

  // Filter menu items
  const filteredItems = SAMPLE_MENU_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      preparation_time: item.preparation_time,
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-coffee-900 mb-4">Our Menu</h1>
          <p className="text-xl text-coffee-700 max-w-2xl mx-auto">
            Discover our carefully crafted selection of premium coffee, delicious food, and treats.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-coffee-500 text-white'
                  : 'bg-white text-coffee-600 hover:bg-coffee-50 border border-coffee-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Cart Summary (if items in cart) */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-4 right-4 z-50">
            <Card className="bg-coffee-500 text-white p-4 shadow-lg">
              <div className="flex items-center space-x-4">
                <ShoppingCart className="h-6 w-6" />
                <div>
                  <div className="font-semibold">{getTotalItems()} items</div>
                  <div className="text-sm">{formatCurrency(getTotalPrice())}</div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.location.href = '/cart'}
                >
                  View Cart
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Item Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-coffee-100 to-cream-100 flex items-center justify-center">
                <Coffee className="h-16 w-16 text-coffee-400" />
              </div>
              
              <div className="p-6">
                {/* Item Header */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-lg font-bold text-coffee-600">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                {/* Tags and Info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                  <Badge variant="info" size="sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.preparation_time}m
                  </Badge>
                </div>
                
                {/* Allergens */}
                {item.allergens.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500">
                      Contains: {item.allergens.join(', ')}
                    </p>
                  </div>
                )}
                
                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="w-full"
                  disabled={!item.available}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Coffee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}