import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div style={styles.card}>
      <Link to={`/products/${product._id}`} style={styles.link}>
        <div style={styles.imageContainer}>
          <img 
            src={imageUrl} 
            alt={product.name}
            style={styles.image}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        </div>
        
        <div style={styles.content}>
          <h3 style={styles.name}>{product.name}</h3>
          <p style={styles.category}>{product.category}</p>
          <div style={styles.footer}>
            <span style={styles.price}>${product.price.toFixed(2)}</span>
            {product.stock > 0 ? (
              <span style={styles.inStock}>In Stock</span>
            ) : (
              <span style={styles.outOfStock}>Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  link: {
    textDecoration: 'none',
    color: 'inherit'
  },
  imageContainer: {
    width: '100%',
    height: '250px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  content: {
    padding: '1rem'
  },
  name: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#111827'
  },
  category: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.75rem'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#3b82f6'
  },
  inStock: {
    fontSize: '0.875rem',
    color: '#10b981',
    fontWeight: '500'
  },
  outOfStock: {
    fontSize: '0.875rem',
    color: '#ef4444',
    fontWeight: '500'
  }
};

export default ProductCard;
