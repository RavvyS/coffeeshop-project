'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

/**
 * Custom hook for fetching menu items
 * Provides menu data with filtering and search capabilities
 */
export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('category')
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      setMenuItems(data || []);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  // Filter menu items by category
  const getItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  // Search menu items
  const searchItems = (query: string) => {
    const searchTerm = query.toLowerCase();
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  };

  // Get menu categories with item counts
  const getCategories = () => {
    const categories = menuItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
    }));
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    menuItems,
    loading,
    error,
    getItemsByCategory,
    searchItems,
    getCategories,
    refetch: fetchMenuItems,
  };
}