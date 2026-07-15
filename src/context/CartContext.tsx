import React, { createContext, useContext, useState, useEffect } from 'react';
import { coupons } from '../data/database';
import type { Product, Coupon } from '../data/database';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  savedForLater: CartItem[];
  wishlist: Product[];
  recentlyViewed: string[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeFromSavedForLater: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  addToRecentlyViewed: (productId: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  getCartTotals: () => {
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('saved_for_later');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('applied_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('saved_for_later', JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('applied_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('applied_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
          : item
      )
    );
  };

  const saveForLater = (productId: string) => {
    const itemToSave = cart.find((item) => item.product.id === productId);
    if (itemToSave) {
      removeFromCart(productId);
      setSavedForLater((prev) => {
        if (prev.some((item) => item.product.id === productId)) return prev;
        return [...prev, itemToSave];
      });
    }
  };

  const moveToCart = (productId: string) => {
    const itemToMove = savedForLater.find((item) => item.product.id === productId);
    if (itemToMove) {
      setSavedForLater((prev) => prev.filter((item) => item.product.id !== productId));
      addToCart(itemToMove.product, itemToMove.quantity);
    }
  };

  const removeFromSavedForLater = (productId: string) => {
    setSavedForLater((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 5); // Store last 5 items
    });
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code.' };
    }

    const { subtotal } = getCartTotals();
    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return { success: false, message: `Minimum spend of $${coupon.minSpend} required.` };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon applied: ${coupon.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const getCartTotals = () => {
    const subtotal = cart.reduce((acc, item) => {
      const price = item.product.flashSaleDiscount
        ? item.product.price * (1 - item.product.flashSaleDiscount / 100)
        : item.product.price;
      return acc + price * item.quantity;
    }, 0);

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = subtotal * (appliedCoupon.value / 100);
      } else {
        discount = Math.min(appliedCoupon.value, subtotal);
      }
    }

    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.08; // 8% sales tax
    
    // Free shipping above $500 or if subtotal is 0
    const shipping = subtotal === 0 || discountedSubtotal > 500 ? 0 : 15;
    
    const total = discountedSubtotal + tax + shipping;

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total,
    };
  };

  return (
    <CartContext.Provider value={{
      cart,
      savedForLater,
      wishlist,
      recentlyViewed,
      appliedCoupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      saveForLater,
      moveToCart,
      removeFromSavedForLater,
      toggleWishlist,
      addToRecentlyViewed,
      applyCoupon,
      removeCoupon,
      clearCart,
      getCartTotals,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
