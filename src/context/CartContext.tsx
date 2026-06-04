'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imagePath: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; imagePath: string }, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Context provider that manages the global shopping cart state.
 * Hydrates state from localStorage and syncs changes to localStorage asynchronously.
 * Prevents hydration mismatches by returning default values until fully mounted.
 * 
 * @param props - React component props
 * @param props.children - React child nodes to be wrapped
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage after mount (client side only)
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem('bakery_cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    const timeoutId = setTimeout(loadCart, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  // Save cart to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('bakery_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartItems, isHydrated]);

  const addToCart = (product: { id: string; name: string; price: number; imagePath: string }, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    setIsCartOpen(true); // Open mini-cart drawer when an item is added
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Prevent SSR/CSR mismatch in initial load values
  const cartCount = isHydrated ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
  const cartTotal = isHydrated ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems: isHydrated ? cartItems : [],
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom hook to access the global shopping cart state and operations.
 * Must be used within a CartProvider.
 * 
 * @returns The global cart context value including items, counts, and methods
 * @throws Error if used outside of a CartProvider
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
