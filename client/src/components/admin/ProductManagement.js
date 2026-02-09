import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ProductManagement = () => {
  const { token, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Apparel',
    sizes: [],
    colors: [],
    stock: '',
    images: [],
    featured: false
  });

  const categories = ['Apparel', 'Accessories', 'Drinkware', 'Stationery', 'Tech', 'Other'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const colorOptions = ['Navy', 'White', 'Gray', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Purple'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleMultiSelect = (name, value) => {
    const current = formData[name];
    if (current.includes(value)) {
      setFormData({
        ...formData,
        [name]: current.filter(item => item !== value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: [...current, value]
      });
    }
  };

  const handleImageInput = (e) => {
    const urls = e.target.value.split('\n').filter(url => url.trim());
    setFormData({ ...formData, images: urls });
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

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, productData, config);
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        await axios.post('/api/products', productData, config);
        setMessage({ type: 'success', text: 'Product created successfully!' });
      }

      resetForm();
      fetchProducts();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Operation failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      sizes: product.sizes || [],
      colors: product.colors || [],
      stock: product.stock,
      images: product.images || [],
      featured: product.featured || false
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`/api/products/${productId}`, config);
      setMessage({ type: 'success', text: 'Product deleted successfully!' });
      fetchProducts();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Delete failed'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Apparel',
      sizes: [],
      colors: [],
      stock: '',
      images: [],
      featured: false
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div>
      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '1rem' }}>
          {message.text}
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          style={styles.addBtn}
        >
          + Add New Product
        </button>
      )}

      {showForm && (
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={resetForm} style={styles.closeBtn}>✕</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                rows="3"
                required
              />
            </div>

            <div style={styles.row}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Sizes</label>
              <div style={styles.checkboxGroup}>
                {sizeOptions.map(size => (
                  <label key={size} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleMultiSelect('sizes', size)}
                    />
                    <span style={{ marginLeft: '0.5rem' }}>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Colors</label>
              <div style={styles.checkboxGroup}>
                {colorOptions.map(color => (
                  <label key={color} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.colors.includes(color)}
                      onChange={() => handleMultiSelect('colors', color)}
                    />
                    <span style={{ marginLeft: '0.5rem' }}>{color}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URLs (one per line)</label>
              <textarea
                value={formData.images.join('\n')}
                onChange={handleImageInput}
                className="form-input"
                rows="3"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              />
              <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Use: https://via.placeholder.com/300?text=YourProduct
              </small>
            </div>

            <div className="form-group">
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <span style={{ marginLeft: '0.5rem' }}>Featured Product</span>
              </label>
            </div>

            <div style={styles.formActions}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid */}
      <div style={styles.productsSection}>
        <h2 style={styles.sectionTitle}>All Products ({products.length})</h2>
        
        <div style={styles.productsGrid}>
          {products.map(product => (
            <div key={product._id} style={styles.productCard}>
              <div style={styles.productImage}>
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  style={styles.image}
                />
              </div>
              
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.productCategory}>{product.category}</p>
                <p style={styles.productPrice}>${product.price.toFixed(2)}</p>
                <p style={styles.productStock}>Stock: {product.stock}</p>
                {product.featured && (
                  <span style={styles.featuredBadge}>Featured</span>
                )}
              </div>

              <div style={styles.productActions}>
                <button onClick={() => handleEdit(product)} className="btn btn-secondary" style={styles.editBtn}>
                  Edit
                </button>
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(product._id)} className="btn btn-danger" style={styles.deleteBtn}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p style={styles.noProducts}>No products yet. Add your first product!</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  addBtn: {
    marginBottom: '2rem'
  },
  formCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6b7280'
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  productsSection: {
    marginTop: '2rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  productImage: {
    width: '100%',
    height: '200px',
    backgroundColor: '#f3f4f6'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  productInfo: {
    padding: '1rem'
  },
  productName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  productCategory: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  productPrice: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: '0.25rem'
  },
  productStock: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  featuredBadge: {
    display: 'inline-block',
    marginTop: '0.5rem',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  productActions: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  editBtn: {
    flex: 1
  },
  deleteBtn: {
    flex: 1
  },
  noProducts: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1.125rem',
    padding: '2rem'
  }
};

export default ProductManagement;
