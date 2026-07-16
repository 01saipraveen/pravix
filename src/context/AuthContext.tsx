import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  avatar?: string;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  estimatedDelivery: string;
}

interface AuthContextType {
  user: User | null;
  addresses: Address[];
  orders: Order[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  addOrder: (items: OrderItem[], subtotal: number, tax: number, shipping: number, total: number, shippingAddress: Address, paymentMethod: string) => Order;
  updateProfile: (username: string, email: string, avatar: string) => void;
  sendOtp: (email: string) => Promise<{ success: boolean; error: string | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('auth_addresses');
    return saved ? JSON.parse(saved) : [
      {
        id: 'addr1',
        fullName: 'John Doe',
        street: '128 Innovation Way, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94107',
        country: 'United States',
        phone: '+1 (555) 019-2834',
      }
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('auth_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ORD-8291A',
        date: '2026-06-15',
        items: [
          {
            id: '2',
            name: 'AeroBuds Studio Max',
            price: 349,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          }
        ],
        subtotal: 349,
        tax: 27.92,
        shipping: 15,
        total: 391.92,
        shippingAddress: {
          id: 'addr1',
          fullName: 'John Doe',
          street: '128 Innovation Way, Suite 400',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94107',
          country: 'United States',
          phone: '+1 (555) 019-2834',
        },
        paymentMethod: 'Stripe',
        status: 'Delivered',
        estimatedDelivery: '2026-06-18',
      }
    ];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('auth_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('auth_orders', JSON.stringify(orders));
  }, [orders]);

  // Load and listen to Supabase Auth state changes if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || '';
        const isAdmin = email.toLowerCase().startsWith('admin') || email.toLowerCase() === 'pravixp5@gmail.com';
        setUser({
          id: session.user.id,
          username: session.user.user_metadata?.username || email.split('@')[0],
          email: email,
          isAdmin: isAdmin,
          avatar: session.user.user_metadata?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        });
      }
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const isAdmin = email.toLowerCase().startsWith('admin') || email.toLowerCase() === 'pravixp5@gmail.com';
        setUser({
          id: session.user.id,
          username: session.user.user_metadata?.username || email.split('@')[0],
          email: email,
          isAdmin: isAdmin,
          avatar: session.user.user_metadata?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulated authentication API latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Admin backdoor credentials or fallback simulated user login
    const isAdmin = 
      email.toLowerCase().startsWith('admin') || 
      (email.toLowerCase() === 'pravixp5@gmail.com' && password === 'admin');

    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      username: email.toLowerCase() === 'pravixp5@gmail.com' ? 'Pravix' : (isAdmin ? 'SysAdmin Core' : email.split('@')[0]),
      email: email,
      isAdmin: isAdmin,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
    };
    setUser(newUser);
    return true;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const isAdmin = 
      email.toLowerCase().startsWith('admin') || 
      (email.toLowerCase() === 'pravixp5@gmail.com' && password === 'admin');

    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      username: username,
      email: email,
      isAdmin: isAdmin,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    };
    setUser(newUser);
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (email) { /* Simulated dispatch logic */ }
    return true;
  };

  const sendOtp = async (email: string): Promise<{ success: boolean; error: string | null }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        }
      });
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } else {
      // Local fallback simulation
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem(`mock_otp_${email.toLowerCase()}`, code);
      return { success: true, error: null };
    }
  };

  const verifyOtp = async (email: string, token: string): Promise<{ success: boolean; error: string | null }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      if (error) {
        // Try magiclink type just in case
        const { error: retryError } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'magiclink',
        });
        if (retryError) return { success: false, error: retryError.message };
      }
      return { success: true, error: null };
    } else {
      // Local fallback validation
      const savedCode = localStorage.getItem(`mock_otp_${email.toLowerCase()}`);
      if (savedCode && savedCode === token) {
        localStorage.removeItem(`mock_otp_${email.toLowerCase()}`);
        
        const isAdmin = email.toLowerCase().startsWith('admin') || email.toLowerCase() === 'pravixp5@gmail.com';
        const newUser: User = {
          id: Math.random().toString(36).substring(7),
          username: email.toLowerCase() === 'pravixp5@gmail.com' ? 'Pravix' : (isAdmin ? 'SysAdmin Core' : email.split('@')[0]),
          email: email,
          isAdmin: isAdmin,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        };
        setUser(newUser);
        return { success: true, error: null };
      }
      return { success: false, error: 'Incorrect verification code. Please check code parameters.' };
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Math.random().toString(36).substring(7),
    };
    setAddresses((prev) => [...prev, newAddress]);
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const addOrder = (
    items: OrderItem[],
    subtotal: number,
    tax: number,
    shipping: number,
    total: number,
    shippingAddress: Address,
    paymentMethod: string
  ): Order => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      date: new Date().toISOString().split('T')[0],
      items,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      paymentMethod,
      status: 'Processing',
      estimatedDelivery: deliveryDate.toISOString().split('T')[0],
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateProfile = (username: string, email: string, avatar: string) => {
    if (user) {
      setUser({
        ...user,
        username,
        email,
        avatar,
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      addresses,
      orders,
      login,
      register,
      logout,
      forgotPassword,
      addAddress,
      removeAddress,
      addOrder,
      updateProfile,
      sendOtp,
      verifyOtp,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
