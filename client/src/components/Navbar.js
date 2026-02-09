import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

import {
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  User,
  LogOut,
  Shield
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdminOrManager, logout, user } =
    useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);

  const cartCount = getCartCount();

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Brand */}
        <Link to="/" style={styles.brand}>
          <ShoppingBag size={22} />
          <span>NewUU Merch Store</span>
        </Link>

        {/* Menu */}
        <div style={styles.menu}>
          <NavLink to="/products" icon={ShoppingBag} label="Products" />

          {isAuthenticated ? (
            <>
              <NavLink
                to="/cart"
                icon={ShoppingCart}
                label="Cart"
                badge={cartCount}
              />

              <NavLink to="/orders" icon={ClipboardList} label="Orders" />

              {isAdminOrManager && (
                <NavLink to="/admin" icon={Shield} label="Admin" />
              )}

              <NavLink to="/profile" icon={User} label={user?.name} />

              <button onClick={logout} style={styles.logoutBtn}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" label="Login" />
              <NavLink to="/register" label="Register" />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

/* Reusable Nav Link */
const NavLink = ({ to, icon: Icon, label, badge }) => (
  <Link to={to} style={styles.link}>
    {Icon && <Icon size={16} />}
    <span>{label}</span>
    {badge > 0 && <span style={styles.badge}>{badge}</span>}
  </Link>
);

/* Styles */
const styles = {
  nav: {
    backgroundColor: '#111827',
    borderBottom: '1px solid #1f2937'
  },

  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'white',
    textDecoration: 'none'
  },

  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem'
  },

  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: '#e5e7eb',
    textDecoration: 'none',
    fontSize: '0.95rem',
    position: 'relative',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    transition: 'background 0.2s'
  },

  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '0.7rem',
    padding: '0.1rem 0.45rem',
    borderRadius: '9999px'
  },

  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.75rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.85rem'
  }
};

export default Navbar;