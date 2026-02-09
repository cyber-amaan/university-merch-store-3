import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await axios.get('/api/orders', config);
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return '#f59e0b';
      case 'Shipped': return '#3b82f6';
      case 'Delivered': return '#10b981';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return <div className="container" style={styles.loading}>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={styles.emptyContainer}>
        <h1 style={styles.emptyTitle}>No orders yet</h1>
        <p style={styles.emptyText}>Start shopping to see your orders here!</p>
        <Link to="/products">
          <button className="btn btn-primary">Shop Now</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>

      <div style={styles.orders}>
        {orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <p style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                <p style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div style={styles.statusBadge(getStatusColor(order.orderStatus))}>
                {order.orderStatus}
              </div>
            </div>

            <div style={styles.orderItems}>
              {order.items.map((item, index) => (
                <div key={index} style={styles.orderItem}>
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={styles.orderFooter}>
              <div>
                <p style={styles.totalLabel}>Total</p>
                <p style={styles.totalAmount}>${order.totalPrice.toFixed(2)}</p>
              </div>
              <Link to={`/orders/${order._id}`}>
                <button className="btn btn-secondary">View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.125rem',
    padding: '3rem'
  },
  emptyContainer: {
    paddingTop: '4rem',
    paddingBottom: '4rem',
    textAlign: 'center'
  },
  emptyTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  emptyText: {
    fontSize: '1.125rem',
    color: '#6b7280',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem'
  },
  orders: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  orderCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb'
  },
  orderId: {
    fontSize: '1.125rem',
    fontWeight: '600'
  },
  orderDate: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem'
  },
  statusBadge: (color) => ({
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
    backgroundColor: color
  }),
  orderItems: {
    marginBottom: '1rem'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  totalLabel: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  totalAmount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827'
  }
};

export default Orders;
