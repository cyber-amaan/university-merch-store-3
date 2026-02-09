import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API from '../api';

const OrderManagement = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
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
      
      const res = await API.get('/api/orders/admin/all', config);
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await API.put(
        `/api/orders/${orderId}/status`,
        { orderStatus, paymentStatus },
        config
      );
      setMessage({ type: 'success', text: 'Order status updated successfully!' });
      fetchOrders();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Update failed'
      });
    }
  };

  const generateEmailTemplate = (order, status) => {
    const templates = {
      Processing: `Subject: Your Order is Being Processed

Dear ${order.user?.name || 'Customer'},

Thank you for your order #${order._id.slice(-8).toUpperCase()}!

We're currently processing your order and will ship it soon.

Order Details:
${order.items.map(item => `- ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total: $${order.totalPrice.toFixed(2)}

Shipping Address:
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
${order.shippingAddress.country}

We'll send you another email when your order ships.

Best regards,
University Merch Store Team`,

      Shipped: `Subject: Your Order Has Been Shipped! 📦

Dear ${order.user?.name || 'Customer'},

Great news! Your order #${order._id.slice(-8).toUpperCase()} has been shipped.

Order Details:
${order.items.map(item => `- ${item.name} x${item.quantity}`).join('\n')}

Shipping Address:
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}

Estimated Delivery: 3-5 business days

Track your package: [Tracking Link Here]

Thank you for shopping with us!

Best regards,
University Merch Store Team`,

      Delivered: `Subject: Your Order Has Been Delivered! ✅

Dear ${order.user?.name || 'Customer'},

Your order #${order._id.slice(-8).toUpperCase()} has been delivered!

We hope you love your purchase. If you have any issues or questions, please don't hesitate to contact us.

Order Details:
${order.items.map(item => `- ${item.name} x${item.quantity}`).join('\n')}

Total: $${order.totalPrice.toFixed(2)}

Would you like to leave a review? We'd love to hear your feedback!

Thank you for choosing University Merch Store!

Best regards,
The Team`,

      Cancelled: `Subject: Order Cancellation Confirmation

Dear ${order.user?.name || 'Customer'},

This is to confirm that your order #${order._id.slice(-8).toUpperCase()} has been cancelled.

${order.paymentStatus === 'Paid' ? 'A refund will be processed within 5-7 business days to your original payment method.' : ''}

If you have any questions or concerns, please contact our customer support.

Order Details:
${order.items.map(item => `- ${item.name} x${item.quantity}`).join('\n')}

Thank you for your understanding.

Best regards,
University Merch Store Team`
    };

    return templates[status] || templates.Processing;
  };

  const handleSendEmail = (order, status) => {
    setSelectedOrder(order);
    setEmailTemplate(generateEmailTemplate(order, status));
    setShowEmailModal(true);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(emailTemplate);
    setMessage({ type: 'success', text: 'Email template copied to clipboard!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': '#f59e0b',
      'Shipped': '#3b82f6',
      'Delivered': '#10b981',
      'Cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'Pending': '#f59e0b',
      'Paid': '#10b981',
      'Failed': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return <div style={styles.loading}>Loading orders...</div>;
  }

  return (
    <div>
      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '1rem' }}>
          {message.text}
        </div>
      )}

      <h2 style={styles.title}>All Orders ({orders.length})</h2>

      {orders.length === 0 ? (
        <div style={styles.noOrders}>No orders yet</div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map(order => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <h3 style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <p style={styles.customerName}>Customer: {order.user?.name || 'Unknown'}</p>
                  <p style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={styles.orderTotal}>${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div style={styles.orderItems}>
                <strong>Items:</strong>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.orderItem}>
                    • {item.name} x{item.quantity}
                    {item.size && ` (Size: ${item.size})`}
                    {item.color && ` (Color: ${item.color})`}
                  </div>
                ))}
              </div>

              <div style={styles.orderAddress}>
                <strong>Shipping Address:</strong>
                <p>
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {' '}
                  {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
              </div>

              <div style={styles.statusSection}>
                <div style={styles.statusRow}>
                  <label style={styles.label}>Order Status:</label>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value, order.paymentStatus)}
                    style={{
                      ...styles.select,
                      backgroundColor: getStatusColor(order.orderStatus) + '20',
                      color: getStatusColor(order.orderStatus)
                    }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div style={styles.statusRow}>
                  <label style={styles.label}>Payment Status:</label>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => updateOrderStatus(order._id, order.orderStatus, e.target.value)}
                    style={{
                      ...styles.select,
                      backgroundColor: getPaymentStatusColor(order.paymentStatus) + '20',
                      color: getPaymentStatusColor(order.paymentStatus)
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div style={styles.emailButtons}>
                <button
                  onClick={() => handleSendEmail(order, 'Processing')}
                  className="btn btn-secondary"
                  style={styles.emailBtn}
                >
                  📧 Processing Email
                </button>
                <button
                  onClick={() => handleSendEmail(order, 'Shipped')}
                  className="btn btn-secondary"
                  style={styles.emailBtn}
                >
                  📧 Shipped Email
                </button>
                <button
                  onClick={() => handleSendEmail(order, 'Delivered')}
                  className="btn btn-secondary"
                  style={styles.emailBtn}
                >
                  📧 Delivered Email
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>Email Template</h2>
              <button onClick={() => setShowEmailModal(false)} style={styles.closeBtn}>✕</button>
            </div>
            <textarea
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              style={styles.emailTextarea}
              rows="20"
            />
            <div style={styles.modalActions}>
              <button onClick={copyEmailToClipboard} className="btn btn-primary">
                📋 Copy to Clipboard
              </button>
              <button onClick={() => setShowEmailModal(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
            <p style={styles.hint}>
              💡 Tip: Copy this template and send it via your email client to the customer
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.125rem',
    color: '#6b7280'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem'
  },
  noOrders: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280',
    fontSize: '1.125rem'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
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
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb'
  },
  orderId: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem'
  },
  customerName: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginBottom: '0.25rem'
  },
  orderDate: {
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  orderTotal: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#3b82f6'
  },
  orderItems: {
    marginBottom: '1rem',
    fontSize: '0.875rem'
  },
  orderItem: {
    marginLeft: '1rem',
    color: '#4b5563',
    marginTop: '0.25rem'
  },
  orderAddress: {
    marginBottom: '1rem',
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  statusSection: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  statusRow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151'
  },
  select: {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  emailButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  emailBtn: {
    fontSize: '0.875rem',
    padding: '0.5rem 1rem'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6b7280'
  },
  emailTextarea: {
    width: '100%',
    padding: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  },
  modalActions: {
    display: 'flex',
    gap: '1rem'
  },
  hint: {
    marginTop: '1rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    fontStyle: 'italic'
  }
};

export default OrderManagement;
