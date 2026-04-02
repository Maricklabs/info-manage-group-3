import { useState, useEffect } from 'react';
import LogIn from './pages/LogIn';
import CustomerKiosk from './pages/CustomerKiosk';
import CashierPOS from './pages/CashierPOS';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

export type UserRole = 'customer' | 'cashier' | 'admin' | null;

interface User {
  id: string;
  role: UserRole;
  name?: string;
  email?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  customerId: string;
  cashierId?: string;
  timestamp: number;
  qrCode?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedOrders = localStorage.getItem('orders');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const handleLogin = (role: UserRole, credentials?: { username: string; password: string }) => {
    let newUser: User;

    if (role === 'customer') {
      newUser = {
        id: `customer_${Date.now()}`,
        role: 'customer',
        name: 'Guest Customer'
      };
    } else if (role === 'cashier') {
      // Simple credential check (in production, use PHP backend)
      if (credentials?.username === 'cashier1' && credentials?.password === 'cashier123') {
        newUser = {
          id: 'cashier_1',
          role: 'cashier',
          name: 'Cashier'
        };
      } else {
        alert('Invalid cashier credentials');
        return;
      }
    } else if (role === 'admin') {
      // Simple credential check (in production, use PHP backend)
      if (credentials?.username === 'admin' && credentials?.password === 'admin123') {
        newUser = {
          id: 'admin_1',
          role: 'admin',
          name: 'Administrator'
        };
      } else {
        alert('Invalid admin credentials');
        return;
      }
    } else {
      return;
    }

    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
  };

  const addToCart = (item: OrderItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prev =>
        prev.map(i => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
  };

  // Render based on user role
  if (!user) {
    return <LogIn onLogin={handleLogin} />;
  }

  if (user.role === 'customer') {
    return (
      <CustomerKiosk
        user={user}
        cart={cart}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
        onLogout={handleLogout}
        onCreateOrder={(order) => setOrders([...orders, order])}
        orders={orders}
      />
    );
  }

  if (user.role === 'cashier') {
    return (
      <CashierPOS
        user={user}
        orders={orders}
        onUpdateOrder={(updatedOrder) =>
          setOrders(orders.map(o => (o.id === updatedOrder.id ? updatedOrder : o)))
        }
        onLogout={handleLogout}
      />
    );
  }

  if (user.role === 'admin') {
    return (
      <AdminDashboard
        user={user}
        orders={orders}
        onLogout={handleLogout}
        onAddCashier={() => alert('Add cashier functionality')}
      />
    );
  }

  return null;
}

export default App;
