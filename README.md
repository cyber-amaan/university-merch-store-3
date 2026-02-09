# University Merch Store - Full Stack E-Commerce Application

A complete full-stack e-commerce web application for selling university merchandise, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### User Features
- 🔐 User authentication (register/login with JWT)
- 👤 Three user roles: User, Manager, Admin (see ROLES.md)
- 🛍️ Browse products by category
- 🔍 Search and filter products
- 🛒 Shopping cart management
- 💳 Checkout process with order placement
- 📦 View order history
- 👤 User profile management

### Manager Features
- ➕ Add/Edit products
- 📊 View all orders
- 🔄 Update order status
- 📦 Process shipments

### Admin Features
- ✅ All Manager permissions
- 🗑️ Delete products
- 👥 Manage user roles
- 📈 Full system access

### Technical Features
- RESTful API design
- JWT authentication
- Password hashing with bcrypt
- Input validation
- Error handling
- Responsive design

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client

## Project Structure

```
university-merch-store/
├── server/                 # Backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── server.js         # Entry point
│   └── package.json
│
├── client/                # Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Context providers
│   │   ├── pages/        # Page components
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd university-merch-store
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/university-merch
# JWT_SECRET=your_secret_key_here
# NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS/Linux
mongod

# Windows
# MongoDB should be running as a service
```

### 5. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
# Server will run on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
# React app will run on http://localhost:3000
```

The application should now be running at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/:itemId` - Update cart item (protected)
- `DELETE /api/cart/:itemId` - Remove from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  phone: String,
  address: Object,
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  sizes: [String],
  colors: [String],
  stock: Number,
  images: [String],
  rating: Number,
  numReviews: Number,
  featured: Boolean,
  createdAt: Date
}
```

### Cart
```javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    size: String,
    color: String,
    price: Number
  }],
  updatedAt: Date
}
```

### Order
```javascript
{
  user: ObjectId,
  items: [OrderItem],
  shippingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  totalPrice: Number,
  createdAt: Date
}
```

## User Roles

The application supports three roles with different permission levels:

1. **User** (Customer) - Default role for all registrations
2. **Manager** - Can manage products and orders
3. **Admin** - Full system access

See **ROLES.md** for detailed permissions and setup instructions.

### Creating Admin/Manager Accounts

To create an admin or manager account:

1. Register a normal account via the UI
2. Update the role in MongoDB:

```javascript
// Make user an Admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)

// Make user a Manager
db.users.updateOne(
  { email: "manager@example.com" },
  { $set: { role: "manager" } }
)
```

Alternatively, use MongoDB Compass to edit the user document's `role` field.

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/university-merch
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

## Testing the Application

1. **Register a new user** at `/register`
2. **Login** at `/login`
3. **Browse products** at `/products`
4. **View product details** by clicking on a product
5. **Add to cart** and proceed to checkout
6. **View orders** at `/orders`

## Adding Sample Products

You can add products through the API or directly in MongoDB:

```javascript
// Example product
{
  name: "University T-Shirt",
  description: "Official university t-shirt with logo",
  price: 24.99,
  category: "Apparel",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Navy", "White", "Gray"],
  stock: 100,
  images: ["https://example.com/image.jpg"],
  rating: 4.5,
  featured: true
}
```

## Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables
2. Update MONGODB_URI to production database
3. Deploy server directory

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the React app: `npm run build`
2. Deploy the build folder
3. Update API URL in frontend

## Future Enhancements

- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Image upload functionality
- [ ] Order tracking
- [ ] Inventory management
- [ ] Analytics and reporting
- [ ] Discount codes and promotions

## Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB is accessible

**Port Already in Use:**
- Change PORT in .env file
- Kill the process using the port

**CORS Errors:**
- Ensure backend CORS is configured correctly
- Check proxy setting in client/package.json

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for university students**
