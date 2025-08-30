'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Plus,
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Eye,
  EyeOff,
  Coffee,
  Upload,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Tag
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'tea' | 'food' | 'dessert' | 'beverage';
  image_url?: string;
  available: boolean;
  preparation_time: number;
  allergens: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface MenuFormData {
  name: string;
  description: string;
  price: string;
  category: MenuItem['category'];
  preparation_time: string;
  allergens: string[];
  tags: string[];
  available: boolean;
}

const CATEGORIES = [
  { value: 'coffee', label: 'Coffee', icon: '☕' },
  { value: 'tea', label: 'Tea', icon: '🍵' },
  { value: 'food', label: 'Food', icon: '🥐' },
  { value: 'dessert', label: 'Desserts', icon: '🧁' },
  { value: 'beverage', label: 'Cold Drinks', icon: '🥤' },
];

const COMMON_ALLERGENS = [
  'dairy', 'eggs', 'gluten', 'nuts', 'soy', 'shellfish', 'fish', 'sesame'
];

const COMMON_TAGS = [
  'popular', 'new', 'seasonal', 'vegan', 'organic', 'decaf', 'strong', 'mild', 'sweet', 'bitter'
];

export default function AdminMenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    preparation_time: '',
    allergens: [],
    tags: [],
    available: true,
  });
  const [formErrors, setFormErrors] = useState<Partial<MenuFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category')
        .order('name');

      if (error) throw error;
      setMenuItems(data || []);
      setFilteredItems(data || []);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  // Filter items
  useEffect(() => {
    let filtered = menuItems;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(item => 
        availabilityFilter === 'available' ? item.available : !item.available
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, searchQuery, categoryFilter, availabilityFilter]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'coffee',
      preparation_time: '',
      allergens: [],
      tags: [],
      available: true,
    });
    setFormErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<MenuFormData> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }
    if (!formData.preparation_time || isNaN(Number(formData.preparation_time)) || Number(formData.preparation_time) <= 0) {
      errors.preparation_time = 'Valid preparation time is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        preparation_time: Number(formData.preparation_time),
        allergens: formData.allergens,
        tags: formData.tags,
        available: formData.available,
      };

      let result;
      if (editingItem) {
        // Update existing item
        result = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id)
          .select()
          .single();
      } else {
        // Create new item
        result = await supabase
          .from('menu_items')
          .insert(itemData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Update local state
      if (editingItem) {
        setMenuItems(prev => prev.map(item => 
          item.id === editingItem.id ? result.data : item
        ));
        toast.success('Menu item updated successfully');
        setEditingItem(null);
      } else {
        setMenuItems(prev => [...prev, result.data]);
        toast.success('Menu item created successfully');
        setShowAddModal(false);
      }

      resetForm();
    } catch (err) {
      console.error('Error saving menu item:', err);
      toast.error('Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingItem) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', deletingItem.id);

      if (error) throw error;

      setMenuItems(prev => prev.filter(item => item.id !== deletingItem.id));
      toast.success('Menu item deleted successfully');
      setDeletingItem(null);
    } catch (err) {
      console.error('Error deleting menu item:', err);
      toast.error('Failed to delete menu item');
    }
  };

  // Toggle availability
  const toggleAvailability = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ available: !item.available })
        .eq('id', item.id);

      if (error) throw error;

      setMenuItems(prev => prev.map(menuItem => 
        menuItem.id === item.id ? { ...menuItem, available: !menuItem.available } : menuItem
      ));

      toast.success(`${item.name} ${!item.available ? 'enabled' : 'disabled'}`);
    } catch (err) {
      console.error('Error toggling availability:', err);
      toast.error('Failed to update item availability');
    }
  };

  // Handle edit
  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      preparation_time: item.preparation_time.toString(),
      allergens: item.allergens,
      tags: item.tags,
      available: item.available,
    });
    setEditingItem(item);
  };

  // Handle tag/allergen toggle
  const toggleArrayItem = (array: string[], item: string, field: 'allergens' | 'tags') => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your coffee shop menu items
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {CATEGORIES.map(category => {
          const count = menuItems.filter(item => item.category === category.value).length;
          return (
            <Card key={category.value} className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <p className="text-sm text-gray-600">{category.label}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500"
          >
            <option value="all">All Items</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </Card>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {/* Item Image */}
            <div className="h-48 bg-gradient-to-br from-coffee-100 to-cream-100 flex items-center justify-center">
              <Coffee className="h-16 w-16 text-coffee-400" />
            </div>
            
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  {item.available ? (
                    <Badge variant="success" size="sm">Available</Badge>
                  ) : (
                    <Badge variant="error" size="sm">Unavailable</Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-coffee-600">{formatCurrency(item.price)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Prep Time:</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.preparation_time}m
                  </span>
                </div>
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="secondary" size="sm">
                        +{item.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {item.allergens.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500">
                    Contains: {item.allergens.join(', ')}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAvailability(item)}
                    className={item.available ? 'text-orange-600' : 'text-green-600'}
                  >
                    {item.available ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingItem(item)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Coffee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No menu items found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
            resetForm();
          }}
          title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                error={formErrors.name}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              error={formErrors.description}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price ($)"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                error={formErrors.price}
                required
              />
              <Input
                label="Preparation Time (minutes)"
                type="number"
                min="1"
                value={formData.preparation_time}
                onChange={(e) => setFormData(prev => ({ ...prev, preparation_time: e.target.value }))}
                error={formErrors.preparation_time}
                required
              />
            </div>

            {/* Allergens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allergens</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ALLERGENS.map((allergen) => (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleArrayItem(formData.allergens, allergen, 'allergens')}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      formData.allergens.includes(allergen)
                        ? 'bg-red-100 border-red-300 text-red-800'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {allergen}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleArrayItem(formData.tags, tag, 'tags')}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      formData.tags.includes(tag)
                        ? 'bg-coffee-100 border-coffee-300 text-coffee-800'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                className="h-4 w-4 text-coffee-500 focus:ring-coffee-500 border-gray-300 rounded"
              />
              <label htmlFor="available" className="text-sm font-medium text-gray-700">
                Available for orders
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                <Save className="h-4 w-4 mr-2" />
                {editingItem ? 'Update Item' : 'Create Item'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingItem(null)}
          title="Delete Menu Item"
          size="sm"
        >
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete "{deletingItem.name}"?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The menu item will be permanently removed from your menu.
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => setDeletingItem(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
              >
                Delete Item
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}