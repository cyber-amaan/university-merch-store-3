# University Merch Store - Full Stack Web Application

## Project Overview
A complete e-commerce platform for university merchandise including apparel, accessories, and branded items.

## Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## Features

### User Features
- Browse products by category
- Product search and filtering
- Shopping cart management
- User authentication (signup/login)
- Order placement and history
- User profile management

### Admin Features
- Product management (CRUD)
- Order management
- User management
- Dashboard with statistics

## Project Structure

```
university-merch-store/
├── client/                 # Frontend React app
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context providers
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                # Backend Node.js app
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   ├── uploads/          # Uploaded images
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Database Schema

### User Model
- name, email, password
- role (user/admin)
- address, phone
- orders[]

### Product Model
- name, description, price
- category, sizes[], colors[]
- stock, images[]
- ratings

### Order Model
- user reference
- products[], totalAmount
- shippingAddress
- status, paymentStatus
- createdAt

### Cart Model
- user reference
- items[] (product, quantity, size, color)

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- DELETE /api/products/:id (admin)

### Cart
- GET /api/cart
- POST /api/cart/add
- PUT /api/cart/update
- DELETE /api/cart/:itemId

### Orders
- POST /api/orders
- GET /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id (admin)

## Setup Instructions

1. Clone the repository
2. Install dependencies for both client and server
3. Configure environment variables
4. Start MongoDB
5. Run development servers
6. Access at http://localhost:3000

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/university-merch
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000
```
