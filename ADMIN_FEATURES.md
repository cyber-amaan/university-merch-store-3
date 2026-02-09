# Admin Panel Features Documentation

## Overview

The University Merch Store now includes a comprehensive admin dashboard with advanced management capabilities for products, orders, users, and analytics.

## Accessing the Admin Panel

1. **Navigate to**: `/admin` (or click "Admin" in the navbar when logged in as Admin/Manager)
2. **Required Role**: Admin or Manager
3. **URL**: `http://localhost:3000/admin`

---

## Dashboard Tabs

### 1. 📊 Dashboard (Statistics)

**Purpose**: Real-time business analytics and insights

**Features**:
- **KPI Cards**:
  - Total Revenue ($)
  - Total Orders Count
  - Total Products Count
  
- **Top Selling Products**:
  - Ranked list (#1-#5)
  - Shows units sold
  - Shows revenue generated
  
- **Top Customers**:
  - Ranked by total spending
  - Shows number of orders
  - Shows total amount spent
  
- **Recent Orders Table**:
  - Last 5 orders
  - Order ID, Customer Name, Amount, Status, Date
  - Quick overview of recent activity

**Access**: Admin, Manager

---

### 2. 🛍️ Products Management

**Purpose**: Complete CRUD operations for product catalog

**Features**:
- **Add New Product**:
  - Product name, description
  - Price and stock quantity
  - Category selection (Apparel, Accessories, Drinkware, Stationery, Tech, Other)
  - Multiple sizes (checkboxes)
  - Multiple colors (checkboxes)
  - Multiple image URLs
  - Featured product toggle
  
- **Edit Product**:
  - Update any field
  - Same form as Add Product
  
- **Delete Product** (Admin Only):
  - Confirmation dialog
  - Permanently removes product
  
- **Product Grid View**:
  - Visual card-based layout
  - Shows image, name, category, price, stock
  - Featured badge indicator
  - Quick edit/delete actions

**Access**: 
- Add/Edit: Admin, Manager
- Delete: Admin only

---

### 3. 📦 Orders Management

**Purpose**: Manage customer orders, update status, send email notifications

**Features**:

#### Order List
- All customer orders in reverse chronological order
- Each order shows:
  - Order ID
  - Customer name
  - Order date/time
  - Total amount
  - Items ordered (with size/color)
  - Shipping address
  
#### Order Status Management
- **Order Status Dropdown**:
  - Processing (default)
  - Shipped
  - Delivered
  - Cancelled
  - Color-coded for visual clarity
  - Real-time update
  
- **Payment Status Dropdown**:
  - Pending
  - Paid
  - Failed
  - Updates instantly

#### Email Templates
Pre-written professional email templates for each status:

**📧 Processing Email**:
- Order confirmation
- Items list
- Shipping address
- Processing message

**📧 Shipped Email**:
- Shipment confirmation
- Delivery estimate (3-5 business days)
- Tracking placeholder
- Items list

**📧 Delivered Email**:
- Delivery confirmation
- Thank you message
- Review request
- Customer support info

**📧 Cancelled Email**:
- Cancellation confirmation
- Refund information (if applicable)
- Customer support contact

**How Email System Works**:
1. Click email button (Processing/Shipped/Delivered)
2. Pre-filled template opens in modal
3. Edit template as needed
4. Click "Copy to Clipboard"
5. Paste into your email client (Gmail, Outlook, etc.)
6. Send to customer

**Note**: Email sending is manual. Future versions may include automated SMTP integration.

**Access**: Admin, Manager

---

### 4. 👥 User Management (Admin Only)

**Purpose**: Manage user accounts and roles

**Features**:

#### User List
- Searchable table
- Shows:
  - User name
  - Email
  - Current role
  - Join date
  
#### Role Management
- **Change User Roles**:
  - Dropdown for each user
  - Options: User, Manager, Admin
  - Updates instantly
  - Cannot change own role (security)
  
#### Role Descriptions
Built-in reference cards showing:
- **User**: Browse, purchase, view own orders
- **Manager**: + Create/edit products, manage orders
- **Admin**: + Delete products, manage users, full access

**Search Functionality**:
- Search by name or email
- Real-time filtering

**Access**: Admin only

---

## User-Facing Features

### Order Tracking Page

**URL**: `/orders/:id`

**Features**:
- **Visual Status Tracker**:
  - Progress bar: Processing → Shipped → Delivered
  - Current step highlighted
  - Completed steps marked with checkmarks
  
- **Estimated Delivery**:
  - Processing: 7 days from order
  - Shipped: 5 days from ship date
  - Delivered: Shows actual delivery date
  
- **Order Details**:
  - All items with quantities, sizes, colors
  - Shipping address
  - Payment status
  - Order summary with pricing breakdown
  
- **Cancelled Orders**:
  - Clear cancellation banner
  - Support contact information

**Access**: Order owner only

---

## Permission Matrix

| Feature | User | Manager | Admin |
|---------|------|---------|-------|
| **Dashboard** | | | |
| View Statistics | ❌ | ✅ | ✅ |
| **Products** | | | |
| Create Product | ❌ | ✅ | ✅ |
| Edit Product | ❌ | ✅ | ✅ |
| Delete Product | ❌ | ❌ | ✅ |
| **Orders** | | | |
| View All Orders | ❌ | ✅ | ✅ |
| Update Order Status | ❌ | ✅ | ✅ |
| Send Email Templates | ❌ | ✅ | ✅ |
| **Users** | | | |
| View All Users | ❌ | ❌ | ✅ |
| Change User Roles | ❌ | ❌ | ✅ |
| **Own Orders** | | | |
| View Own Orders | ✅ | ✅ | ✅ |
| Track Order Status | ✅ | ✅ | ✅ |

---

## API Endpoints (New)

### Admin Endpoints
```
GET    /api/admin/users           # Get all users (Admin only)
PUT    /api/admin/users/:id/role  # Update user role (Admin only)
DELETE /api/admin/users/:id       # Delete user (Admin only)
```

### Order Management
```
GET    /api/orders/admin/all      # Get all orders (Admin/Manager)
PUT    /api/orders/:id/status     # Update order status (Admin/Manager)
```

---

## Statistics Calculations

### Total Revenue
Sum of all `order.totalPrice` for all orders

### Top Products
Ranked by total revenue generated:
```
Revenue = Σ(item.price × item.quantity) across all orders
```

### Top Customers
Ranked by total spending:
```
Total Spent = Σ(order.totalPrice) for each user
```

---

## Security Features

1. **Role-Based Access Control (RBAC)**:
   - Middleware checks user role before allowing access
   - `authorize('admin')` for admin-only routes
   - `authorize('admin', 'manager')` for shared access

2. **Self-Protection**:
   - Users cannot change their own role
   - Users cannot delete their own account
   
3. **Route Protection**:
   - All admin routes require authentication
   - Frontend checks role before showing admin UI
   - Backend validates on every request

4. **Order Access**:
   - Users can only view their own orders
   - Admins/Managers can view all orders

---

## Future Enhancements

Potential additions for future versions:

- [ ] Automated email sending (SMTP integration)
- [ ] Real shipment tracking API integration
- [ ] Push notifications for order updates
- [ ] Inventory alerts (low stock warnings)
- [ ] Advanced analytics (charts, graphs)
- [ ] Export reports (CSV, PDF)
- [ ] Bulk operations (bulk status update)
- [ ] Customer notes/internal comments
- [ ] Return/refund management
- [ ] Discount codes and promotions
- [ ] Email marketing campaigns
- [ ] Multi-currency support
- [ ] Warehouse/supplier management

---

## Tips for Managers/Admins

### Daily Workflow

1. **Morning**:
   - Check Dashboard for overnight orders
   - Review new orders in Orders tab
   - Update Processing orders to Shipped
   - Send Shipped emails

2. **Midday**:
   - Check inventory (product stock levels)
   - Add new products if needed
   - Respond to customer inquiries

3. **Evening**:
   - Update Shipped orders to Delivered
   - Send Delivered emails
   - Review statistics

### Best Practices

- **Update orders promptly**: Customers appreciate timely updates
- **Use email templates**: Save time with pre-written messages
- **Monitor top products**: Keep popular items in stock
- **Check statistics daily**: Identify trends early
- **Review top customers**: Consider loyalty programs

### Email Template Customization

You can edit templates before sending:
- Add tracking numbers
- Personalize messages
- Include promotional offers
- Add customer support contact

---

## Troubleshooting

### "Failed to load users"
- Check if you're logged in as Admin
- Verify admin routes are mounted in server.js
- Check browser console for errors

### Order status not updating
- Verify you're Admin or Manager
- Check network tab for failed requests
- Ensure server is running

### Email template not copying
- Try clicking "Copy to Clipboard" again
- Check browser clipboard permissions
- Manually select all and copy (Ctrl+C/Cmd+C)

### Statistics showing zero
- Check if there are any orders in database
- Verify orders have valid data
- Check browser console for errors

---

## Support

For questions or issues:
1. Check this documentation
2. Review ROLES.md for permission details
3. Check server logs for errors
4. Open an issue in the repository

---

**Remember**: With great power comes great responsibility. Admins and Managers have access to sensitive customer data and business operations. Always handle with care and professionalism.
