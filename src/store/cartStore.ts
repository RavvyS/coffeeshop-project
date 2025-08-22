import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  preparation_time: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getEstimatedPrepTime: () => number;
}

/**
 * Cart Store using Zustand
 * Manages shopping cart state with persistence
 * Provides cart operations and calculations
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Add item to cart or increment quantity if exists
       */
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(cartItem => cartItem.id === item.id);
          
          if (existingItem) {
            // Increment quantity of existing item
            return {
              items: state.items.map(cartItem =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + quantity }
                  : cartItem
              ),
            };
          } else {
            // Add new item to cart
            return {
              items: [...state.items, { ...item, quantity }],
            };
          }
        });
      },

      /**
       * Remove item from cart completely
       */
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId),
        }));
      },

      /**
       * Update quantity of specific item
       */
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      /**
       * Update notes for specific item
       */
      updateNotes: (itemId, notes) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, notes } : item
          ),
        }));
      },

      /**
       * Clear all items from cart
       */
      clearCart: () => {
        set({ items: [] });
      },

      /**
       * Get total number of items in cart
       */
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Get total price of all items in cart
       */
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      /**
       * Get estimated preparation time for cart
       */
      getEstimatedPrepTime: () => {
        const { items } = get();
        const baseTime = 5; // Base preparation time
        const itemTime = items.reduce((total, item) => {
          return total + (item.preparation_time * item.quantity);
        }, 0);
        
        return Math.max(baseTime, Math.ceil(itemTime * 1.2)); // Add 20% buffer
      },
    }),
    {
      name: 'brew-bean-cart', // localStorage key
      // Only persist items, not computed values
      partialize: (state) => ({ items: state.items }),
    }
  )
);