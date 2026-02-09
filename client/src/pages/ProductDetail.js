import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data.product);
      
      if (res.data.product.sizes && res.data.product.sizes.length > 0) {
        setSelectedSize(res.data.product.sizes[0]);
      }
      if (res.data.product.colors && res.data.product.colors.length > 0) {
        setSelectedColor(res.data.product.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setMessage({ type: 'error', text: 'Failed to load product' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product._id, quantity, selectedSize, selectedColor);
    if (result.success) {
      setMessage({ type: 'success', text: 'Product added to cart!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  if (loading) {
    return <div className="container" style={styles.loading}>Loading...</div>;
  }

  if (!product) {
    return <div className="container" style={styles.error}>Product not found</div>;
  }

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/500x500?text=No+Image';

  return (
    <div className="container" style={styles.container}>
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div style={styles.grid}>
        {/* Product Image */}
        <div style={styles.imageContainer}>
          <img 
            src={imageUrl} 
            alt={product.name}
            style={styles.image}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
            }}
          />
        </div>

        {/* Product Info */}
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.category}>{product.category}</p>
          <p style={styles.price}>${product.price.toFixed(2)}</p>
          
          <div style={styles.stockInfo}>
            {product.stock > 0 ? (
              <span style={styles.inStock}>✓ In Stock ({product.stock} available)</span>
            ) : (
              <span style={styles.outOfStock}>✗ Out of Stock</span>
            )}
          </div>

          <p style={styles.description}>{product.description}</p>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={styles.optionGroup}>
              <label style={styles.label}>Size:</label>
              <div style={styles.options}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      ...styles.optionBtn,
                      ...(selectedSize === size ? styles.optionBtnActive : {})
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div style={styles.optionGroup}>
              <label style={styles.label}>Color:</label>
              <div style={styles.options}>
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      ...styles.optionBtn,
                      ...(selectedColor === color ? styles.optionBtnActive : {})
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={styles.quantityGroup}>
            <label style={styles.label}>Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="form-input"
              style={styles.quantityInput}
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn btn-primary"
            style={styles.addToCartBtn}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
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
  loading: {
    textAlign: 'center',
    fontSize: '1.125rem',
    padding: '3rem'
  },
  error: {
    textAlign: 'center',
    fontSize: '1.125rem',
    color: '#ef4444',
    padding: '3rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem'
  },
  imageContainer: {
    width: '100%',
    height: '500px',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.5rem',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  name: {
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  category: {
    fontSize: '1rem',
    color: '#6b7280'
  },
  price: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#3b82f6'
  },
  stockInfo: {
    marginBottom: '1rem'
  },
  inStock: {
    color: '#10b981',
    fontWeight: '500'
  },
  outOfStock: {
    color: '#ef4444',
    fontWeight: '500'
  },
  description: {
    fontSize: '1rem',
    lineHeight: '1.75',
    color: '#4b5563'
  },
  optionGroup: {
    marginTop: '1rem'
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  options: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  optionBtn: {
    padding: '0.5rem 1rem',
    border: '2px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  optionBtnActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    color: '#3b82f6'
  },
  quantityGroup: {
    marginTop: '1rem'
  },
  quantityInput: {
    width: '100px'
  },
  addToCartBtn: {
    marginTop: '1rem',
    width: '100%',
    fontSize: '1.125rem'
  }
};

export default ProductDetail;
