import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await axios.get(`/api/products?${params.toString()}`);
      setProducts(res.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.sort) params.set('sort', newFilters.sort);
    setSearchParams(params);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <h1 style={styles.title}>Explore Products</h1>
      <p style={styles.subtitle}>
        Browse official university merchandise
      </p>

      {/* Filters */}
      <div style={styles.filtersCard}>
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search products"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={styles.searchInput}
          />

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={styles.select}
          >
            <option value="">All Categories</option>
            <option value="Apparel">Apparel</option>
            <option value="Accessories">Accessories</option>
            <option value="Drinkware">Drinkware</option>
            <option value="Stationery">Stationery</option>
            <option value="Tech">Tech</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            style={styles.select}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <p style={styles.loading}>Loading products...</p>
      ) : products.length > 0 ? (
        <>
          <p style={styles.count}>
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>

          <div style={styles.productsGrid}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <p style={styles.noProducts}>
          No products found. Try adjusting your filters.
        </p>
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: '2.5rem 1rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },

  title: {
    fontSize: '2.3rem',
    fontWeight: '800',
    marginBottom: '0.4rem'
  },

  subtitle: {
    color: '#6b7280',
    marginBottom: '2.2rem'
  },

  filtersCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
    marginBottom: '2.5rem'
  },

  filters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },

  searchInput: {
    width: '100%',
    padding: '0.7rem 0.8rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    outline: 'none'
  },

  select: {
    width: '100%',
    padding: '0.7rem 0.8rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
    backgroundColor: 'white'
  },

  count: {
    marginBottom: '1.2rem',
    color: '#6b7280',
    fontSize: '0.9rem'
  },

  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.75rem'
  },

  loading: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#2563eb',
    marginTop: '3rem'
  },

  noProducts: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#6b7280',
    marginTop: '3rem'
  }
};

export default Products;