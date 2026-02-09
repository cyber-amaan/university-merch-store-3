import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const UserManagement = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load users. Endpoint may not be implemented yet.'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'User role updated successfully!' });
      fetchUsers();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Update failed'
      });
    }
  };

  const getRoleBadgeStyle = (role) => {
    const colors = {
      'user': { backgroundColor: '#e5e7eb', color: '#374151' },
      'manager': { backgroundColor: '#dbeafe', color: '#1e40af' },
      'admin': { backgroundColor: '#fef3c7', color: '#92400e' }
    };
    return {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500',
      ...(colors[role] || colors.user)
    };
  };

  // Filter by name, email, or phone
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  return (
    <div>
      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '1rem' }}>
          {message.text}
        </div>
      )}

      <div style={styles.header}>
        <h2 style={styles.title}>User Management ({users.length} users)</h2>
        <input
          type="text"
          placeholder="Search name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={styles.searchInput}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div style={styles.noUsers}>
          {searchTerm ? 'No users found matching your search' : 'No users yet'}
        </div>
      ) : (
        <div style={styles.usersTable}>
          <div style={styles.tableHeader}>
            <div style={{ flex: 2 }}>Name</div>
            <div style={{ flex: 2 }}>Email</div>
            <div style={{ flex: 1.5 }}>Phone</div>
            <div style={{ flex: 1 }}>Role</div>
            <div style={{ flex: 1 }}>Joined</div>
            <div style={{ flex: 1 }}>Actions</div>
          </div>

          {filteredUsers.map(user => (
            <div key={user._id} style={styles.tableRow}>
              <div style={{ flex: 2, fontWeight: '500' }}>{user.name}</div>
              <div style={{ flex: 2, color: '#6b7280' }}>{user.email}</div>
              <div style={{ flex: 1.5 }}>
                {user.phone || <span style={{ color: '#9ca3af' }}>—</span>}
              </div>
              <div style={{ flex: 1 }}>
                <span style={getRoleBadgeStyle(user.role)}>
                  {user.role}
                </span>
              </div>
              <div style={{ flex: 1, fontSize: '0.875rem', color: '#6b7280' }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div style={{ flex: 1 }}>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                  className="form-select"
                  style={styles.roleSelect}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role Descriptions */}
      <div style={styles.rolesInfo}>
        <h3 style={styles.rolesTitle}>Role Descriptions</h3>
        <div style={styles.roleCards}>
          <div style={styles.roleCard}>
            <div style={styles.roleCardHeader}>
              <span style={getRoleBadgeStyle('user')}>User</span>
            </div>
            <ul style={styles.roleList}>
              <li>Browse and purchase products</li>
              <li>Manage their own cart and orders</li>
              <li>View their order history</li>
            </ul>
          </div>

          <div style={styles.roleCard}>
            <div style={styles.roleCardHeader}>
              <span style={getRoleBadgeStyle('manager')}>Manager</span>
            </div>
            <ul style={styles.roleList}>
              <li>All User permissions</li>
              <li>Create and edit products</li>
              <li>View all orders</li>
              <li>Update order status</li>
              <li>Cannot delete products or manage users</li>
            </ul>
          </div>

          <div style={styles.roleCard}>
            <div style={styles.roleCardHeader}>
              <span style={getRoleBadgeStyle('admin')}>Admin</span>
            </div>
            <ul style={styles.roleList}>
              <li>All Manager permissions</li>
              <li>Delete products</li>
              <li>Manage user roles</li>
              <li>Full system access</li>
            </ul>
          </div>
        </div>
      </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  searchInput: {
    maxWidth: '320px',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db'
  },
  noUsers: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280',
    fontSize: '1.125rem'
  },
  usersTable: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: '2rem'
  },
  tableHeader: {
    display: 'flex',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    fontWeight: '600',
    fontSize: '0.875rem',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb'
  },
  tableRow: {
    display: 'flex',
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    alignItems: 'center',
    fontSize: '0.875rem'
  },
  roleSelect: {
    fontSize: '0.875rem',
    padding: '0.25rem 0.5rem'
  },
  rolesInfo: {
    marginTop: '3rem'
  },
  rolesTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  roleCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  roleCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  roleCardHeader: {
    marginBottom: '1rem'
  },
  roleList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: '0.875rem',
    color: '#4b5563'
  }
};

export default UserManagement;