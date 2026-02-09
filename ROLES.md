# User Roles & Permissions

## Overview

The University Merch Store has three user roles with different permission levels:

1. **User** (Customer)
2. **Manager** 
3. **Admin** (Super Admin)

## Role Hierarchy

```
Admin (Highest)
  ↓
Manager (Medium)
  ↓
User (Lowest)
```

---

## 1. User (Customer) 👤

**Default role for all new registrations**

### Permissions:
- ✅ Browse products
- ✅ Search and filter products
- ✅ View product details
- ✅ Add products to cart
- ✅ Update cart quantities
- ✅ Remove items from cart
- ✅ Place orders
- ✅ View own order history
- ✅ View own order details
- ✅ Update own profile
- ❌ Cannot access admin panel
- ❌ Cannot manage products
- ❌ Cannot manage orders
- ❌ Cannot view other users' data

### Access:
- Home page
- Products page
- Product detail page
- Shopping cart
- Checkout page
- My orders page
- Profile page

---

## 2. Manager 👔

**Mid-level administrative role**

### Permissions:
**All User permissions, plus:**
- ✅ Access admin panel
- ✅ Create new products
- ✅ Edit existing products
- ✅ View all orders (from all customers)
- ✅ Update order status (Processing → Shipped → Delivered)
- ✅ Update payment status
- ❌ Cannot delete products (Admin only)
- ❌ Cannot manage user roles
- ❌ Cannot delete orders

### Use Cases:
- Store managers who need to add/update inventory
- Customer service reps who handle order fulfillment
- Staff who process shipments

### Access:
- All User pages
- Admin dashboard (limited)
- Product management (create/edit only)
- Order management (view/update only)

---

## 3. Admin (Super Admin) 👑

**Full system access**

### Permissions:
**All Manager permissions, plus:**
- ✅ Delete products
- ✅ Delete orders
- ✅ Manage user roles (promote/demote users)
- ✅ View system statistics
- ✅ Full CRUD on all resources

### Use Cases:
- System owner
- IT administrator
- Store owner

### Access:
- Complete access to all features
- Full admin dashboard
- User management
- Complete product CRUD
- Complete order CRUD

---

## Permission Matrix

| Feature | User | Manager | Admin |
|---------|------|---------|-------|
| Browse Products | ✅ | ✅ | ✅ |
| Purchase Products | ✅ | ✅ | ✅ |
| View Own Orders | ✅ | ✅ | ✅ |
| **Product Management** | | | |
| Create Product | ❌ | ✅ | ✅ |
| Edit Product | ❌ | ✅ | ✅ |
| Delete Product | ❌ | ❌ | ✅ |
| **Order Management** | | | |
| View All Orders | ❌ | ✅ | ✅ |
| Update Order Status | ❌ | ✅ | ✅ |
| Delete Orders | ❌ | ❌ | ✅ |
| **User Management** | | | |
| View Users | ❌ | ❌ | ✅ |
| Edit User Roles | ❌ | ❌ | ✅ |
| Delete Users | ❌ | ❌ | ✅ |

---

## How to Set User Roles

### Method 1: During Development (MongoDB Direct)

Connect to MongoDB and update a user's role:

```javascript
// Connect to MongoDB
mongosh

// Switch to database
use university-merch

// Make a user a Manager
db.users.updateOne(
  { email: "manager@example.com" },
  { $set: { role: "manager" } }
)

// Make a user an Admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)

// Demote back to User
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "user" } }
)
```

### Method 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `university-merch` → `users` collection
4. Find the user document
5. Edit the `role` field to `"user"`, `"manager"`, or `"admin"`
6. Save changes

### Method 3: Via API (Future Enhancement)

Create an admin endpoint to manage user roles:

```javascript
// Example endpoint (to be implemented)
PUT /api/admin/users/:userId/role
{
  "role": "manager"
}
```

---

## API Route Protection

Routes are protected using middleware:

```javascript
// Public routes (anyone can access)
GET /api/products

// Protected routes (authenticated users only)
GET /api/cart
POST /api/orders

// Manager/Admin routes
POST /api/products         // Manager or Admin
PUT /api/products/:id      // Manager or Admin
PUT /api/orders/:id/status // Manager or Admin

// Admin only routes
DELETE /api/products/:id   // Admin only
```

---

## Testing Different Roles

### Create Test Accounts:

**1. Regular User:**
```bash
# Register via UI or:
POST /api/auth/register
{
  "name": "John Customer",
  "email": "customer@test.com",
  "password": "password123"
}
# Role: "user" (default)
```

**2. Manager Account:**
```bash
# First register normally, then update in MongoDB:
db.users.updateOne(
  { email: "manager@test.com" },
  { $set: { role: "manager" } }
)
```

**3. Admin Account:**
```bash
# First register normally, then update in MongoDB:
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

---

## Security Notes

### 1. Default Role
All new registrations automatically get the `"user"` role. This prevents unauthorized admin access.

### 2. Role Validation
The User model enforces role values through enum validation:
```javascript
enum: ['user', 'manager', 'admin']
```

### 3. Route Protection
The `authorize()` middleware checks user roles before allowing access:
```javascript
// Only admin and manager can access
authorize('admin', 'manager')

// Only admin can access
authorize('admin')
```

### 4. JWT Token
User role is included in JWT payload and verified on every protected request.

---

## Future Enhancements

- [ ] Admin UI for role management
- [ ] Custom permissions per role
- [ ] Role-based analytics dashboard
- [ ] Activity logs per role
- [ ] Multi-level manager roles (Junior Manager, Senior Manager)
- [ ] Department-based access control
- [ ] Temporary role assignments with expiration

---

## Quick Reference

| Role | Create Products | Edit Products | Delete Products | View Orders | Update Orders |
|------|----------------|---------------|-----------------|-------------|---------------|
| User | ❌ | ❌ | ❌ | Own only | ❌ |
| Manager | ✅ | ✅ | ❌ | All | ✅ |
| Admin | ✅ | ✅ | ✅ | All | ✅ |

---

**Remember:** 
- Users can only see their own orders and data
- Managers can manage inventory and orders but cannot delete
- Admins have full system access
