import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, getCartTotal } = useContext(CartContext);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(itemId, newQuantity);
  };

  const handleRemove = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeFromCart(itemId);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container" style={styles.emptyContainer}>
        <h1 style={styles.emptyTitle}>Your cart is empty</h1>
        <p style={styles.emptyText}>Add some products to get started!</p>
        <Link to="/products">
          <button className="btn btn-primary">Shop Now</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>

      <div style={styles.grid}>
        {/* Cart Items */}
        <div style={styles.itemsContainer}>
          {cart.items.map(item => (
            <div key={item._id} style={styles.cartItem}>
              <div style={styles.itemImage}>
                <img
                  src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                  alt={item.product?.name || 'Product'}
                  style={styles.image}
                />
              </div>

              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.product?.name}</h3>
                <p style={styles.itemDetails}>
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && ' | '}
                  {item.color && `Color: ${item.color}`}
                </p>
                <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
              </div>

              <div style={styles.itemActions}>
                <div style={styles.quantityControl}>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    style={styles.quantityBtn}
                  >
                    -
                  </button>
                  <span style={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    style={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item._id)}
                  className="btn btn-danger"
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>

              <div style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span>{getCartTotal() > 100 ? 'FREE' : '$10.00'}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Tax (8%)</span>
            <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
          </div>

          <div style={styles.summaryTotal}>
            <span>Total</span>
            <span>
              ${(
                getCartTotal() + 
                (getCartTotal() > 100 ? 0 : 10) + 
                (getCartTotal() * 0.08)
              ).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="btn btn-primary"
            style={styles.checkoutBtn}
          >
            Proceed to Checkout
          </button>

          <Link to="/products">
            <button className="btn btn-secondary" style={styles.continueBtn}>
              Continue Shopping
            </button>
          </Link>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  itemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr auto auto',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    alignItems: 'center'
  },
  itemImage: {
    width: '100px',
    height: '100px',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.375rem',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  itemName: {
    fontSize: '1.125rem',
    fontWeight: '600'
  },
  itemDetails: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  itemPrice: {
    fontSize: '1rem',
    color: '#3b82f6',
    fontWeight: '500'
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'center'
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  quantityBtn: {
    width: '30px',
    height: '30px',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  quantity: {
    fontSize: '1rem',
    fontWeight: '500',
    minWidth: '30px',
    textAlign: 'center'
  },
  removeBtn: {
    fontSize: '0.875rem',
    padding: '0.5rem 1rem'
  },
  itemTotal: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#111827'
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
  },
  checkoutBtn: {
    width: '100%',
    marginTop: '1.5rem'
  },
  continueBtn: {
    width: '100%',
    marginTop: '0.5rem'
  }
};

export default Cart;
