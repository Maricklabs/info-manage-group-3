import { useState } from 'react';
import { LogIn as LogInIcon } from 'lucide-react';
import '../pages/LogIn.css';
import type { UserRole } from '../App';

interface LogInProps {
  onLogin: (role: UserRole, credentials?: { username: string; password: string }) => void;
}

export default function LogIn({ onLogin }: LogInProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'customer') {
      onLogin('customer');
    } else {
      setSelectedRole(role);
    }
  };

  const handleLogin = () => {
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }
    onLogin(selectedRole, { username, password });
  };

  if (selectedRole) {
    return (
      <div className="login-container">
        <div className="login-card credentials">
          <button className="btn-back" onClick={() => { setSelectedRole(null); setUsername(''); setPassword(''); }}>
            ← Back
          </button>
          <h1>{selectedRole === 'cashier' ? 'Cashier' : 'Admin'} Login</h1>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-primary btn-lg" style={{ width: '100%' }}>
              Login
            </button>
          </form>
          <div className="credentials-hint">
            <p><strong>Demo {selectedRole === 'cashier' ? 'Cashier' : 'Admin'} Credentials:</strong></p>
            <p>Username: {selectedRole === 'cashier' ? 'cashier1' : 'admin'}</p>
            <p>Password: {selectedRole === 'cashier' ? 'cashier123' : 'admin123'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-overlay"></div>
      <div className="login-content">
        <div className="login-header">
          <div className="brand-logo">
            <span className="logo-icon">🍔</span>
          </div>
          <h1>Order System</h1>
          <p>Choose your role to continue</p>
        </div>

        <div className="role-grid">
          <button
            onClick={() => handleRoleSelect('customer')}
            className="role-card customer"
          >
            <div className="role-icon">👤</div>
            <h2>Customer</h2>
            <p>Order Food</p>
            <span className="role-badge">Start Now</span>
          </button>

          <button
            onClick={() => handleRoleSelect('cashier')}
            className="role-card cashier"
          >
            <div className="role-icon">💳</div>
            <h2>Cashier</h2>
            <p>Process Orders</p>
            <span className="role-badge">Login</span>
          </button>

          <button
            onClick={() => handleRoleSelect('admin')}
            className="role-card admin"
          >
            <div className="role-icon">📊</div>
            <h2>Admin</h2>
            <p>Dashboard</p>
            <span className="role-badge">Login</span>
          </button>
        </div>

        <div className="login-footer">
          <p>Your orders are safer with us. No account needed for orders.</p>
        </div>
      </div>
    </div>
  );
}
