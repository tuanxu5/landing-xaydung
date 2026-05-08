/**
 * Cart utility functions using localStorage
 */

export interface CartItem {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  price: number;
  quantity: number;
  category?: string;
}

const CART_KEY = 'shopping_cart';

/**
 * Get all cart items
 */
export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
};

/**
 * Add item to cart
 */
export const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1): CartItem[] => {
  const cart = getCartItems();
  const existingItemIndex = cart.findIndex(i => i._id === item._id);

  if (existingItemIndex > -1) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({ ...item, quantity });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  
  // Dispatch custom event for cart update
  window.dispatchEvent(new Event('cartUpdated'));
  
  return cart;
};

/**
 * Update item quantity
 */
export const updateCartItemQuantity = (itemId: string, quantity: number): CartItem[] => {
  const cart = getCartItems();
  const itemIndex = cart.findIndex(i => i._id === itemId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
  
  return cart;
};

/**
 * Remove item from cart
 */
export const removeFromCart = (itemId: string): CartItem[] => {
  const cart = getCartItems().filter(item => item._id !== itemId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
  
  return cart;
};

/**
 * Clear entire cart
 */
export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
};

/**
 * Get cart total
 */
export const getCartTotal = (): number => {
  const cart = getCartItems();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Get cart item count
 */
export const getCartItemCount = (): number => {
  const cart = getCartItems();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
