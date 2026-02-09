import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import Statistics from '../components/admin/Statistics';

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users
} from 'lucide-react';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('statistics');

  const tabs = [
    { id: 'statistics', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Products', icon: ShoppingBag },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'users', name: 'Users', icon: Users, adminOnly: true }
  ];

  const filteredTabs = tabs.filter(tab => {
    if (tab.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>
          Welcome back, <b>{user?.name}</b> ({user?.role})
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {filteredTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                ...(isActive ? styles.activeTab : {})
              }}
            >
              <Icon
                size={18}
                style={{
                  color: isActive ? '#2563eb' : '#6b7280'
                }}
              />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'statistics' && <Statistics />}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'users' && user?.role === 'admin' && <UserManagement />}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6'
  },

  header: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderBottom: '1px solid #e5e7eb'
  },

  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.25rem'
  },

  subtitle: {
    color: '#6b7280',
    fontSize: '0.95rem'
  },

  tabBar: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb'
  },

  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    borderRadius: '0.75rem',
    border: '1px solid transparent',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#374151',
    transition: 'all 0.2s ease'
  },

  activeTab: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    color: '#2563eb',
    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.15)'
  },

  content: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  }
};

export default Admin;