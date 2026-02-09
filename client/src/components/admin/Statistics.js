import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

import {
  DollarSign,
  Package,
  ShoppingBag,
  Trophy,
  Crown,
  ClipboardList
} from 'lucide-react';

const Statistics = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: [],
    topCustomers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [ordersRes, productsRes] = await Promise.all([
        axios.get('/api/orders/admin/all', config),
        axios.get('/api/products')
      ]);

      const orders = ordersRes.data.orders;
      const products = productsRes.data.products;

      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );

      const recentOrders = orders.slice(0, 5);

      const productSales = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          const id = item.product?._id || item.product;
          if (!productSales[id]) {
            productSales[id] = { name: item.name, quantity: 0, revenue: 0 };
          }
          productSales[id].quantity += item.quantity;
          productSales[id].revenue += item.price * item.quantity;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const customerSpending = {};
      orders.forEach(order => {
        const userId = order.user?._id;
        const userName = order.user?.name || 'Unknown';
        if (!customerSpending[userId]) {
          customerSpending[userId] = { name: userName, totalSpent: 0, orderCount: 0 };
        }
        customerSpending[userId].totalSpent += order.totalPrice;
        customerSpending[userId].orderCount += 1;
      });

      const topCustomers = Object.values(customerSpending)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        recentOrders,
        topProducts,
        topCustomers
      });
    } catch (err) {
      console.error('Statistics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading statistics…</div>;

  return (
    <div>
      {/* KPI */}
      <div style={styles.kpiGrid}>
        <KpiCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
        />
        <KpiCard
          icon={Package}
          label="Total Orders"
          value={stats.totalOrders}
        />
        <KpiCard
          icon={ShoppingBag}
          label="Total Products"
          value={stats.totalProducts}
        />
      </div>

      {/* Top lists */}
      <div style={styles.grid}>
        <Card title="Top Selling Products" icon={Trophy}>
          {stats.topProducts.length ? (
            stats.topProducts.map((p, i) => (
              <ListItem
                key={i}
                rank={i + 1}
                title={p.name}
                subtitle={`${p.quantity} sold · $${p.revenue.toFixed(2)}`}
              />
            ))
          ) : (
            <p style={styles.noData}>No sales data</p>
          )}
        </Card>

        <Card title="Top Customers" icon={Crown}>
          {stats.topCustomers.length ? (
            stats.topCustomers.map((c, i) => (
              <ListItem
                key={i}
                rank={i + 1}
                title={c.name}
                subtitle={`${c.orderCount} orders · $${c.totalSpent.toFixed(2)}`}
              />
            ))
          ) : (
            <p style={styles.noData}>No customer data</p>
          )}
        </Card>
      </div>

      {/* Recent Orders */}
      <Card title="Recent Orders" icon={ClipboardList}>
        {stats.recentOrders.length ? (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div>Order</div>
              <div>Customer</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Date</div>
            </div>

            {stats.recentOrders.map(order => (
              <div key={order._id} style={styles.tableRow}>
                <div>#{order._id.slice(-8).toUpperCase()}</div>
                <div>{order.user?.name || 'N/A'}</div>
                <div>${order.totalPrice.toFixed(2)}</div>
                <div>
                  <span style={getStatusBadgeStyle(order.orderStatus)}>
                    {order.orderStatus}
                  </span>
                </div>
                <div>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noData}>No orders yet</p>
        )}
      </Card>
    </div>
  );
};

/* Reusable UI blocks */

const KpiCard = ({ icon: Icon, label, value }) => (
  <div style={styles.kpiCard}>
    <div style={styles.kpiIcon}>
      <Icon size={22} />
    </div>
    <div>
      <div style={styles.kpiValue}>{value}</div>
      <div style={styles.kpiLabel}>{label}</div>
    </div>
  </div>
);

const Card = ({ title, icon: Icon, children }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <Icon size={18} />
      <h3>{title}</h3>
    </div>
    {children}
  </div>
);

const ListItem = ({ rank, title, subtitle }) => (
  <div style={styles.listItem}>
    <div style={styles.rank}>#{rank}</div>
    <div>
      <div style={styles.itemName}>{title}</div>
      <div style={styles.itemSubtext}>{subtitle}</div>
    </div>
  </div>
);

/* Styles */

const styles = {
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  kpiCard: {
    background: '#fff',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
  },
  kpiIcon: {
    background: '#eff6ff',
    color: '#2563eb',
    padding: '0.75rem',
    borderRadius: '0.75rem'
  },
  kpiValue: {
    fontSize: '1.75rem',
    fontWeight: '700'
  },
  kpiLabel: {
    fontSize: '0.85rem',
    color: '#6b7280'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  card: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    marginBottom: '1rem'
  },
  listItem: {
    display: 'flex',
    gap: '1rem',
    padding: '0.75rem',
    background: '#f9fafb',
    borderRadius: '0.5rem',
    marginBottom: '0.75rem'
  },
  rank: {
    fontWeight: '700',
    color: '#2563eb',
    minWidth: '36px'
  },
  itemName: {
    fontWeight: '500'
  },
  itemSubtext: {
    fontSize: '0.85rem',
    color: '#6b7280'
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    fontSize: '0.85rem',
    color: '#6b7280',
    fontWeight: '600'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    fontSize: '0.85rem',
    padding: '0.75rem',
    borderBottom: '1px solid #e5e7eb'
  },
  noData: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '1.5rem'
  }
};

const getStatusBadgeStyle = status => {
  const base = {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500'
  };
  const colors = {
    Processing: { background: '#fef3c7', color: '#92400e' },
    Shipped: { background: '#dbeafe', color: '#1e40af' },
    Delivered: { background: '#d1fae5', color: '#065f46' },
    Cancelled: { background: '#fee2e2', color: '#991b1b' }
  };
  return { ...base, ...(colors[status] || colors.Processing) };
};

export default Statistics;