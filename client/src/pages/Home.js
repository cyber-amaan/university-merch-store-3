import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

import {
  Shirt,
  Backpack,
  Coffee,
  BookOpen,
  Laptop,
  Gift,
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await axios.get('/api/products?sort=newest');
      setFeaturedProducts(res.data.products.slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            New Uzbekistan University <span style={styles.heroAccent}>Merch Store</span>
          </h1>
          <p style={styles.heroText}>
            Premium university apparel, accessories, and essentials — designed for students.
          </p>

          <Link to="/products" style={styles.heroBtn}>
            Shop Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>

        {loading ? (
          <p style={styles.loading}>Loading products…</p>
        ) : featuredProducts.length > 0 ? (
          <div style={styles.productsGrid}>
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p style={styles.noProducts}>No products available right now.</p>
        )}
      </section>

      {/* Categories */}
      <section style={styles.categoriesSection}>
        <h2 style={styles.sectionTitle}>Shop by Category</h2>

        <div style={styles.categoriesGrid}>
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                style={styles.categoryCard}
              >
                <div style={styles.categoryIcon}>
                  <Icon size={28} />
                </div>
                <h3 style={styles.categoryName}>{category.name}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
<footer style={styles.footer}>
  <div style={styles.footerContainer}>
    {/* Brand */}
    <div>
      <h3 style={styles.footerTitle}>University Merch</h3>
      <p style={styles.footerText}>
        Official merchandise store for New Uzbekistan University students.
      </p>
    </div>

    {/* Support */}
    <div>
      <h4 style={styles.footerHeading}>Support</h4>
      <div style={styles.footerItem}>
        <Mail size={16} />
        <span>support@nuu.uz</span>
      </div>
      <div style={styles.footerItem}>
        <Phone size={16} />
        <span>+998 90 123 45 67</span>
      </div>
      <div style={styles.footerItem}>
        <MapPin size={16} />
        <span>Tashkent, Uzbekistan</span>
      </div>
    </div>

    {/* Links */}
    <div>
      <h4 style={styles.footerHeading}>Quick Links</h4>
      <Link to="/products" style={styles.footerLink}>Products</Link>
      <Link to="/orders" style={styles.footerLink}>Orders</Link>
      <Link to="/profile" style={styles.footerLink}>My Account</Link>
    </div>
  </div>

  <div style={styles.footerBottom}>
    © {new Date().getFullYear()} NewUU Merch by CyberAmaan. All rights reserved.
  </div>
</footer>
    </div>
  );
};

const categories = [
  { name: 'Apparel', icon: Shirt },
  { name: 'Accessories', icon: Backpack },
  { name: 'Drinkware', icon: Coffee },
  { name: 'Stationery', icon: BookOpen },
  { name: 'Tech', icon: Laptop },
  { name: 'Other', icon: Gift }
];


/* Styles */

const styles = {
  hero: {
    position: 'relative',
    background:
      'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    color: 'white',
    padding: '5rem 1.5rem',
    textAlign: 'center',
    overflow: 'hidden'
  },

  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at top, rgba(255,255,255,0.15), transparent 60%)'
  },

  heroContent: {
    position: 'relative',
    maxWidth: '900px',
    margin: '0 auto'
  },

  heroTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '1rem'
  },

  heroAccent: {
    color: '#bfdbfe'
  },

  heroText: {
    fontSize: '1.25rem',
    color: '#e0e7ff',
    marginBottom: '2.5rem'
  },

  heroBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'white',
    color: '#1e40af',
    fontWeight: '600',
    fontSize: '1.1rem',
    padding: '0.9rem 1.75rem',
    borderRadius: '9999px',
    textDecoration: 'none',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },

  section: {
    padding: '4rem 2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },

  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '2.5rem'
  },

  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.75rem'
  },

  loading: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#6b7280'
  },

  noProducts: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#6b7280'
  },

  categoriesSection: {
    backgroundColor: '#f9fafb',
    padding: '4rem 2rem'
  },

  categoriesGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.5rem'
  },

  categoryCard: {
    backgroundColor: 'white',
    padding: '2rem 1.5rem',
    borderRadius: '0.75rem',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#111827',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },

  categoryIcon: {
    width: '56px',
    height: '56px',
    margin: '0 auto 1rem',
    borderRadius: '0.75rem',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  categoryName: {
    fontSize: '1.1rem',
    fontWeight: '600'
  },

  footer: {
  backgroundColor: '#111827',
  color: '#e5e7eb',
  marginTop: '4rem'
},

footerContainer: {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '3rem 2rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '2rem'
},

footerTitle: {
  fontSize: '1.25rem',
  fontWeight: '700',
  marginBottom: '0.75rem',
  color: 'white'
},

footerText: {
  fontSize: '0.9rem',
  color: '#9ca3af',
  lineHeight: 1.6
},

footerHeading: {
  fontSize: '1rem',
  fontWeight: '600',
  marginBottom: '0.75rem',
  color: 'white'
},

footerItem: {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.9rem',
  marginBottom: '0.5rem'
},

footerLink: {
  display: 'block',
  color: '#9ca3af',
  fontSize: '0.9rem',
  marginBottom: '0.4rem',
  textDecoration: 'none'
},

footerBottom: {
  borderTop: '1px solid #1f2937',
  textAlign: 'center',
  padding: '1rem',
  fontSize: '0.85rem',
  color: '#9ca3af'
}



};

export default Home;