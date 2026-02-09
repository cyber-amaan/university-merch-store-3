import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Uzbekistan',
    paymentMethod: 'Cash on Delivery'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod
      };

      const res = await axios.post('/api/orders', orderData, config);
      
      setMessage({ type: 'success', text: 'Order placed successfully!' });
      
      setTimeout(() => {
        navigate(`/orders/${res.data.order._id}`);
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to place order'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div style={styles.grid}>
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.sectionTitle}>Shipping Address</h2>
            
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div style={styles.row}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <h2 style={styles.sectionTitle}>Payment Method</h2>
            
            <div className="form-group">
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          
          <div style={styles.items}>
            {cart.items.map(item => (
              <div key={item._id} style={styles.summaryItem}>
                <div style={styles.itemInfo}>
                  <span style={styles.itemName}>{item.product.name}</span>
                  <span style={styles.itemQuantity}>x{item.quantity}</span>
                </div>
                <span style={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div style={styles.summaryTotal}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    marginTop: '1.5rem'
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  submitBtn: {
    width: '100%',
    marginTop: '1.5rem'
  },
  summary: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: 'fit-content'
  },
  summaryTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  items: {
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '1rem',
    marginBottom: '1rem'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  itemName: {
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  itemQuantity: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  itemPrice: {
    fontWeight: '500'
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

export default Checkout;
