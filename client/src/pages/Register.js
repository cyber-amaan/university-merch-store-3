import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match' });
    }

    if (formData.password.length < 6) {
      return setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });

    if (result.success) {
      navigate('/');
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join us and get started in seconds</p>

        {message.text && (
          <div style={{
            ...styles.alert,
            ...(message.type === 'error' ? styles.alertError : styles.alertSuccess)
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/** Name */}
          <div style={styles.inputGroup}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Full Name</label>
          </div>

          {/** Email */}
          <div style={styles.inputGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Email Address</label>
          </div>

          {/** Phone */}
          <div style={styles.inputGroup}>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder=" "
            />
            <label style={styles.label}>Phone Number</label>
          </div>

          {/** Password */}
          <div style={styles.inputGroup}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Password</label>
          </div>

          {/** Confirm Password */}
          <div style={styles.inputGroup}>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Confirm Password</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },

  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '1.25rem',
    padding: '2.5rem',
    boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(10px)'
  },

  title: {
    fontSize: '2rem',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '0.25rem'
  },

  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '2rem'
  },

  inputGroup: {
    position: 'relative',
    marginBottom: '1.4rem'
  },

  input: {
    width: '100%',
    padding: '0.9rem 0.75rem',
    borderRadius: '0.6rem',
    border: '1px solid #d1d5db',
    outline: 'none',
    fontSize: '0.95rem',
    backgroundColor: 'transparent'
  },

  label: {
    position: 'absolute',
    top: '-0.55rem',
    left: '0.65rem',
    backgroundColor: 'white',
    padding: '0 0.35rem',
    fontSize: '0.75rem',
    color: '#6b7280'
  },

  button: {
    width: '100%',
    padding: '0.85rem',
    borderRadius: '0.75rem',
    border: 'none',
    background: 'linear-gradient(135deg, #7b9de5ff, #4f46e5)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },

  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },

  alert: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1.25rem',
    fontSize: '0.85rem',
    textAlign: 'center'
  },

  alertError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },

  alertSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },

  footer: {
    marginTop: '1.8rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#6b7280'
  },

  link: {
    color: '#2563eb',
    fontWeight: '600',
    textDecoration: 'none'
  }
};

export default Register;