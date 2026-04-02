import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { ShoppingCart, LogOut, X, Plus, Minus } from 'lucide-react';
import '../pages/CustomerKiosk.css';
import type { Order, OrderItem } from '../App';
import type { User } from '../App';

interface CustomerKioskProps {
  user: User;
  cart: OrderItem[];
  onAddToCart: (item: OrderItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onLogout: () => void;
  onCreateOrder: (order: Order) => void;
  orders: Order[];
}

// Food menu data
const MENU_ITEMS: OrderItem[] = [
  { id: '1', name: 'Big Mac', price: 7.99, quantity: 0, image: '🍔' },
  { id: '2', name: 'Chicken McNuggets', price: 5.99, quantity: 0, image: '🍗' },
  { id: '3', name: 'French Fries', price: 2.49, quantity: 0, image: '🍟' },
  { id: '4', name: 'Fried Chicken', price: 6.99, quantity: 0, image: '🍗' },
  { id: '5', name: 'Crispy Burger', price: 5.99, quantity: 0, image: '🍔' },
  { id: '6', name: 'Spicy Wings', price: 4.99, quantity: 0, image: '🍙' },
  { id: '7', name: 'Pizza Slice', price: 3.99, quantity: 0, image: '🍕' },
  { id: '8', name: 'Soft Drink', price: 1.99, quantity: 0, image: '🥤' },
  { id: '9', name: 'Ice Cream', price: 2.99, quantity: 0, image: '🍦' },
  { id: '10', name: 'Apple Pie', price: 2.49, quantity: 0, image: '🥧' },
  { id: '11', name: 'Caesar Salad', price: 4.99, quantity: 0, image: '🥗' },
  { id: '12', name: 'Fresh Juice', price: 2.49, quantity: 0, image: '🧃' },
];

export default function CustomerKiosk({
  user,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onLogout,
  onCreateOrder,
  orders
}: CustomerKioskProps) {
  const [view, setView] = useState<'menu' | 'cart' | 'confirmation'>('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const filteredMenu = MENU_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      total: cartTotal,
      status: 'pending',
      customerId: user.id!,
      timestamp: Date.now(),
      qrCode: `ORD-${Date.now()}`
    };

    onCreateOrder(order);
    setCurrentOrder(order);
    setView('confirmation');
  };

  const handleCompleteOrder = () => {
    setView('menu');
    setCurrentOrder(null);
    // Clear cart
    cart.forEach(item => onRemoveFromCart(item.id));
  };

  if (view === 'confirmation' && currentOrder) {
    return (
      <div className="kiosk-container">
        <div className="confirmation-page">
          <div className="confirmation-card">
            <h1>Order Confirmed!</h1>
            <div className="order-details">
              <h2>Order Number</h2>
              <div className="order-number">{currentOrder.id}</div>
              
              <h3>QR Code</h3>
              <div className="qr-container">
                <QRCode 
                  value={currentOrder.qrCode || currentOrder.id}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="order-items">
                <h3>Your order:</h3>
                {currentOrder.items.map(item => (
                  <div key={item.id} className="order-item-row">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="order-total">
                  <strong>Total: ${currentOrder.total.toFixed(2)}</strong>
                </div>
              </div>

              <p className="confirmation-text">
                Your order is being prepared. Please wait for your order number to be called.
              </p>
            </div>

            <button 
              onClick={handleCompleteOrder}
              className="btn-primary btn-lg"
            >
              Place Another Order
            </button>

            <button 
              onClick={onLogout}
              className="btn-ghost"
            >
              Exit & Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <div className="header-left">
          <span className="brand">🍔 Order System</span>
        </div>
        <div className="header-center">
          <h1>Welcome to Order Kiosk</h1>
        </div>
        <div className="header-right">
          {view === 'menu' && cartCount > 0 && (
            <button
              onClick={() => setView('cart')}
              className="cart-button"
            >
              <ShoppingCart size={24} />
              <span className="cart-badge">{cartCount}</span>
            </button>
          )}
          <button onClick={onLogout} className="btn-logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="kiosk-content">
        {view === 'menu' ? (
          <div className="menu-view">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="menu-grid">
              {filteredMenu.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="item-image">{item.image}</div>
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  
                  <div className="item-controls">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      defaultValue="1"
                      id={`qty-${item.id}`}
                    />
                    <button
                      onClick={() => {
                        const qty = parseInt((document.getElementById(`qty-${item.id}`) as HTMLInputElement).value);
                        onAddToCart({ ...item, quantity: qty || 1 });
                      }}
                      className="btn-primary"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="cart-view">
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button onClick={() => setView('menu')} className="btn-back">
                ← Back to Menu
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="item-info">
                        <span className="item-image">{item.image}</span>
                        <div>
                          <h4>{item.name}</h4>
                          <p>${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="item-controls">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="btn-qty"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="btn-qty"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="btn-remove"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (10%):</span>
                    <span>${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <strong>Total:</strong>
                    <strong>${(cartTotal * 1.1).toFixed(2)}</strong>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn-primary btn-lg btn-checkout"
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
