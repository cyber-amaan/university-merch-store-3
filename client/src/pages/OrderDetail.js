import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await axios.get(`/api/orders/${id}`, config);
      setOrder(res.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status) => {
    const statuses = ['Processing', 'Shipped', 'Delivered'];
    return statuses.indexOf(status) + 1;
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

  const getEstimatedDelivery = (order) => {
    if (order.orderStatus === 'Delivered') {
      return new Date(order.deliveredAt).toLocaleDateString();
    }
    if (order.orderStatus === 'Shipped') {
      const shipDate = new Date(order.updatedAt || order.createdAt);
      shipDate.setDate(shipDate.getDate() + 5); // 5 days from ship date
      return shipDate.toLocaleDateString();
    }
    if (order.orderStatus === 'Processing') {
      const processDate = new Date(order.createdAt);
      processDate.setDate(processDate.getDate() + 7); // 7 days from order date
      return processDate.toLocaleDateString();
    }
    return 'N/A';
  };

  if (loading) {
    return <div className="container" style={styles.loading}>Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container" style={styles.error}>
        <h2>Order not found</h2>
        <button onClick={() => navigate('/orders')} className="btn btn-primary">
          Back to Orders
        </button>
      </div>
    );
  }

  const statusProgress = getStatusProgress(order.orderStatus);

  return (
    <div className="container" style={styles.container}>
      <button onClick={() => navigate('/orders')} style={styles.backBtn}>
        ← Back to Orders
      </button>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p style={styles.date}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div style={{
          ...styles.statusBadge,
          backgroundColor: getStatusColor(order.orderStatus)
        }}>
          {order.orderStatus}
        </div>
      </div>

      {/* Order Status Tracker */}
      {order.orderStatus !== 'Cancelled' && (
        <div style={styles.tracker}>
          <h3 style={styles.trackerTitle}>Order Status</h3>
          <div style={styles.timeline}>
            {['Processing', 'Shipped', 'Delivered'].map((status, index) => {
              const isComplete = index < statusProgress;
              const isCurrent = index === statusProgress - 1;
              
              return (
                <div key={status} style={styles.timelineStep}>
                  <div style={styles.timelineStepTop}>
                    <div style={{
                      ...styles.timelineCircle,
                      ...(isComplete ? styles.timelineCircleComplete : {}),
                      ...(isCurrent ? styles.timelineCircleCurrent : {})
                    }}>
                      {isComplete ? '✓' : index + 1}
                    </div>
                    {index < 2 && (
                      <div style={{
                        ...styles.timelineLine,
                        ...(isComplete ? styles.timelineLineComplete : {})
                      }} />
                    )}
                  </div>
                  <div style={styles.timelineLabel}>{status}</div>
                </div>
              );
            })}
          </div>
          <p style={styles.deliveryEstimate}>
            {order.orderStatus === 'Delivered' ? (
              <span>✅ Delivered on {getEstimatedDelivery(order)}</span>
            ) : (
              <span>📦 Estimated delivery: {getEstimatedDelivery(order)}</span>
            )}
          </p>
        </div>
      )}

      {order.orderStatus === 'Cancelled' && (
        <div style={styles.cancelledBanner}>
          <h3>❌ This order has been cancelled</h3>
          <p>If you have any questions, please contact customer support.</p>
        </div>
      )}

      {/* Order Items */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Order Items</h3>
        <div style={styles.items}>
          {order.items.map((item, index) => (
            <div key={index} style={styles.item}>
              <div style={styles.itemInfo}>
                <h4 style={styles.itemName}>{item.name}</h4>
                <p style={styles.itemDetails}>
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && ' | '}
                  {item.color && `Color: ${item.color}`}
                </p>
                <p style={styles.itemQuantity}>Quantity: {item.quantity}</p>
              </div>
              <div style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.grid}>
        {/* Shipping Address */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Shipping Address</h3>
          <div style={styles.address}>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Payment Information</h3>
          <div style={styles.payment}>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span style={{
                ...styles.paymentStatus,
                color: order.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b'
              }}>
                {order.paymentStatus}
              </span>
            </p>
            {order.paidAt && (
              <p><strong>Paid on:</strong> {new Date(order.paidAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div style={styles.summary}>
        <h3 style={styles.sectionTitle}>Order Summary</h3>
        <div style={styles.summaryRow}>
          <span>Items Total</span>
          <span>${order.itemsPrice.toFixed(2)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Shipping</span>
          <span>${order.shippingPrice.toFixed(2)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Tax</span>
          <span>${order.taxPrice.toFixed(2)}</span>
        </div>
        <div style={styles.summaryTotal}>
          <span>Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '2rem',
    paddingBottom: '2rem',
    maxWidth: '900px'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.125rem'
  },
  error: {
    textAlign: 'center',
    padding: '3rem'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '1.5rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  date: {
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    color: 'white',
    fontWeight: '500'
  },
  tracker: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  trackerTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '2rem'
  },
  timeline: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  timelineStep: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  timelineStepTop: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '0.5rem'
  },
  timelineCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
    zIndex: 1
  },
  timelineCircleComplete: {
    backgroundColor: '#10b981',
    color: 'white'
  },
  timelineCircleCurrent: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  timelineLine: {
    flex: 1,
    height: '4px',
    backgroundColor: '#e5e7eb',
    marginLeft: '-20px'
  },
  timelineLineComplete: {
    backgroundColor: '#10b981'
  },
  timelineLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: '0.5rem'
  },
  deliveryEstimate: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#4b5563',
    marginTop: '1rem',
    fontWeight: '500'
  },
  cancelledBanner: {
    backgroundColor: '#fee2e2',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#991b1b'
  },
  section: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.375rem'
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.25rem'
  },
  itemDetails: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.25rem'
  },
  itemQuantity: {
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  itemPrice: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#3b82f6'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  address: {
    fontSize: '0.875rem',
    color: '#4b5563',
    lineHeight: '1.5'
  },
  payment: {
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  paymentStatus: {
    fontWeight: '600'
  },
  summary: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #e5e7eb'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderTop: '2px solid #111827',
    marginTop: '0.5rem'
  }
};

export default OrderDetail;
