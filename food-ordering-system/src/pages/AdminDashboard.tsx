import { useState } from 'react';
import { LogOut, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import '../pages/AdminDashboard.css';
import type { Order } from '../App';
import type { User } from '../App';

interface AdminDashboardProps {
  user: User;
  orders: Order[];
  onLogout: () => void;
  onAddCashier: () => void;
}

export default function AdminDashboard({
  user,
  orders,
  onLogout,
  onAddCashier
}: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'cashiers' | 'reports'>('dashboard');

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completedOrders = orders.filter(o => o.status === 'served').length;

  const ordersByStatus = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
  };

  // Top selling items
  const itemSales: { [key: string]: { name: string; quantity: number; revenue: number; image: string } } = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemSales[item.id]) {
        itemSales[item.id] = { name: item.name, quantity: 0, revenue: 0, image: item.image };
      }
      itemSales[item.id].quantity += item.quantity;
      itemSales[item.id].revenue += item.price * item.quantity;
    });
  });

  const topItems = Object.values(itemSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-left">
          <h1>📊 Admin Dashboard</h1>
          <p>Welcome, {user.name}</p>
        </div>
        <div className="header-right">
          <button onClick={onLogout} className="btn-logout">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${selectedTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setSelectedTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab ${selectedTab === 'cashiers' ? 'active' : ''}`}
          onClick={() => setSelectedTab('cashiers')}
        >
          Cashier Management
        </button>
        <button
          className={`tab ${selectedTab === 'reports' ? 'active' : ''}`}
          onClick={() => setSelectedTab('reports')}
        >
          Reports
        </button>
      </div>

      <div className="admin-content">
        {selectedTab === 'dashboard' && (
          <>
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card revenue">
                <div className="kpi-icon">💰</div>
                <div className="kpi-content">
                  <p className="kpi-label">Total Revenue</p>
                  <h2>${totalRevenue.toFixed(2)}</h2>
                  <small>From {totalOrders} orders</small>
                </div>
              </div>

              <div className="kpi-card orders">
                <div className="kpi-icon">📦</div>
                <div className="kpi-content">
                  <p className="kpi-label">Total Orders</p>
                  <h2>{totalOrders}</h2>
                  <small>{completedOrders} completed</small>
                </div>
              </div>

              <div className="kpi-card average">
                <div className="kpi-icon">📈</div>
                <div className="kpi-content">
                  <p className="kpi-label">Average Order Value</p>
                  <h2>${averageOrderValue.toFixed(2)}</h2>
                  <small>Per transaction</small>
                </div>
              </div>

              <div className="kpi-card completion">
                <div className="kpi-icon">✅</div>
                <div className="kpi-content">
                  <p className="kpi-label">Completion Rate</p>
                  <h2>{totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}%</h2>
                  <small>{completedOrders}/{totalOrders} done</small>
                </div>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="chart-row">
              <div className="chart-card">
                <h3>Order Status Distribution</h3>
                <div className="status-chart">
                  <div className="status-item">
                    <div className="status-bar pending" style={{ width: `${(ordersByStatus.pending / totalOrders * 100) || 0}%` }}>
                      {ordersByStatus.pending > 0 && <span>{ordersByStatus.pending}</span>}
                    </div>
                    <label>Pending ({ordersByStatus.pending})</label>
                  </div>
                  <div className="status-item">
                    <div className="status-bar preparing" style={{ width: `${(ordersByStatus.preparing / totalOrders * 100) || 0}%` }}>
                      {ordersByStatus.preparing > 0 && <span>{ordersByStatus.preparing}</span>}
                    </div>
                    <label>Preparing ({ordersByStatus.preparing})</label>
                  </div>
                  <div className="status-item">
                    <div className="status-bar ready" style={{ width: `${(ordersByStatus.ready / totalOrders * 100) || 0}%` }}>
                      {ordersByStatus.ready > 0 && <span>{ordersByStatus.ready}</span>}
                    </div>
                    <label>Ready ({ordersByStatus.ready})</label>
                  </div>
                  <div className="status-item">
                    <div className="status-bar served" style={{ width: `${(ordersByStatus.served / totalOrders * 100) || 0}%` }}>
                      {ordersByStatus.served > 0 && <span>{ordersByStatus.served}</span>}
                    </div>
                    <label>Served ({ordersByStatus.served})</label>
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <h3>Top Selling Items</h3>
                <div className="top-items">
                  {topItems.length === 0 ? (
                    <p className="empty-state">No sales data yet</p>
                  ) : (
                    topItems.map((item, idx) => (
                      <div key={item.name} className="item-rank">
                        <div className="rank-number">{idx + 1}</div>
                        <div className="item-info">
                          <span className="image">{item.image}</span>
                          <div>
                            <h4>{item.name}</h4>
                            <small>{item.quantity} sold • ${item.revenue.toFixed(2)}</small>
                          </div>
                        </div>
                        <div className="revenue">${item.revenue.toFixed(2)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'cashiers' && (
          <div className="cashier-section">
            <div className="section-header">
              <h2>Cashier Accounts</h2>
              <button onClick={onAddCashier} className="btn-primary">
                + Add New Cashier
              </button>
            </div>

            <div className="cashier-list">
              <div className="cashier-card">
                <div className="cashier-info">
                  <h3>Cashier 1</h3>
                  <p className="status">Active</p>
                </div>
                <div className="cashier-stats">
                  <div className="stat">
                    <small>Orders Processed</small>
                    <strong>42</strong>
                  </div>
                  <div className="stat">
                    <small>Revenue</small>
                    <strong>${totalRevenue.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="cashier-actions">
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete">Remove</button>
                </div>
              </div>

              <div className="empty-state">
                <p>No additional cashiers added yet</p>
                <small>Create new cashier accounts to expand your team</small>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'reports' && (
          <div className="reports-section">
            <div className="section-header">
              <h2>Sales Reports</h2>
            </div>

            <div className="report-cards">
              <div className="report-card">
                <h3>Today's Summary</h3>
                <div className="report-content">
                  <div className="report-row">
                    <span>Total Orders:</span>
                    <strong>{totalOrders}</strong>
                  </div>
                  <div className="report-row">
                    <span>Total Revenue:</span>
                    <strong>${totalRevenue.toFixed(2)}</strong>
                  </div>
                  <div className="report-row">
                    <span>Average Transaction:</span>
                    <strong>${averageOrderValue.toFixed(2)}</strong>
                  </div>
                  <div className="report-row">
                    <span>Completed Orders:</span>
                    <strong>{completedOrders}</strong>
                  </div>
                </div>
              </div>

              <div className="report-card">
                <h3>Quick Actions</h3>
                <div className="action-list">
                  <button className="action-btn">📊 Export Sales Report</button>
                  <button className="action-btn">📈 View Analytics</button>
                  <button className="action-btn">🧾 Generate Invoice</button>
                  <button className="action-btn">📥 Import Data</button>
                </div>
              </div>
            </div>

            <div className="orders-table">
              <h3>Recent Orders</h3>
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(-10).reverse().map(order => (
                    <tr key={order.id}>
                      <td className="order-id">{order.id}</td>
                      <td>{order.items.length} items</td>
                      <td className="amount">${order.total.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${order.status}`}>{order.status}</span>
                      </td>
                      <td>{new Date(order.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-row">No orders yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
