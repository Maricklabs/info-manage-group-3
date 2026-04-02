import { useState } from 'react';
import { LogOut, Search, Printer, CheckCircle } from 'lucide-react';
import '../pages/CashierPOS.css';
import type { Order } from '../App';
import type { User } from '../App';

interface CashierPOSProps {
  user: User;
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  onLogout: () => void;
}

export default function CashierPOS({
  user,
  orders,
  onUpdateOrder,
  onLogout
}: CashierPOSProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerId.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (order: Order, newStatus: Order['status']) => {
    onUpdateOrder({ ...order, status: newStatus });
  };

  const handlePrint = () => {
    if (selectedOrder) {
      window.print();
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FEF3C7';
      case 'preparing': return '#FED7AA';
      case 'ready': return '#D1FAE5';
      case 'served': return '#DBEAFE';
      default: return '#F3F4F6';
    }
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;
  const totalOrders = orders.length;

  return (
    <div className="pos-container">
      <div className="pos-header">
        <div className="header-left">
          <h1>💳 Cashier POS System</h1>
          <p>Welcome, {user.name}</p>
        </div>
        <div className="header-right">
          <button onClick={onLogout} className="btn-logout">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="pos-stats">
        <div className="stat-card">
          <div className="stat-number">{pendingCount}</div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-number">{readyCount}</div>
          <div className="stat-label">Ready for Pickup</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
      </div>

      <div className="pos-content">
        <div className="search-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by Order # or Customer ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {['all', 'pending', 'preparing', 'ready'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="pos-layout">
          <div className="order-list">
            <h2>Orders Queue</h2>
            {filteredOrders.length === 0 ? (
              <div className="empty-orders">
                <p>No orders found</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className={`order-card ${order.status} ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="order-header">
                    <span className="order-id">{order.id}</span>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusBadgeColor(order.status) }}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="order-info">
                    <p><small>Items: {order.items.reduce((sum, i) => sum + i.quantity, 0)}</small></p>
                    <p><small>${order.total.toFixed(2)}</small></p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="order-details">
            {selectedOrder ? (
              <>
                <div className="details-header">
                  <h2>Order Details</h2>
                  <button onClick={() => setSelectedOrder(null)} className="btn-close">✕</button>
                </div>

                <div className="order-info-detailed">
                  <div className="info-row">
                    <span className="label">Order Number:</span>
                    <span className="value">{selectedOrder.id}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span className="status-badge" style={{ backgroundColor: getStatusBadgeColor(selectedOrder.status) }}>
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="order-items-detail">
                  <h3>Items</h3>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="item-row">
                      <span>{item.image} {item.name}</span>
                      <span>x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="total-row">
                    <strong>Total:</strong>
                    <strong>${selectedOrder.total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="action-buttons">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder, 'preparing')}
                      className="btn-action preparing"
                    >
                      Start Preparing
                    </button>
                  )}
                  {selectedOrder.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder, 'ready')}
                      className="btn-action ready"
                    >
                      <CheckCircle size={18} />
                      Order Ready
                    </button>
                  )}
                  {selectedOrder.status === 'ready' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder, 'served')}
                      className="btn-action served"
                    >
                      Mark as Served
                    </button>
                  )}
                  <button
                    onClick={handlePrint}
                    className="btn-action print"
                  >
                    <Printer size={18} />
                    Print Receipt
                  </button>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p>Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
