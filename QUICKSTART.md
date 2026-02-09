# Quick Start Guide

## Fastest Way to Get Started

### Step 1: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### Step 2: Setup Environment

```bash
# Copy example env file in server directory
cd server
cp .env.example .env
```

Edit `server/.env` and update if needed (defaults should work for local development):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/university-merch
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

### Step 3: Start MongoDB

Make sure MongoDB is installed and running:

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
MongoDB should start automatically as a service after installation.

**Using Docker (Alternative):**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 4: Run the Application

Open TWO terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
React app will open automatically at http://localhost:3000

### Step 5: Test the Application

1. **Register:** Go to http://localhost:3000/register and create an account
2. **Login:** Use your credentials to login
3. **Browse:** Visit products page
4. **Note:** Initially, there won't be any products. You'll need to add them.

## Adding Sample Products

### Option 1: Using MongoDB Compass or Shell

Connect to your MongoDB and insert sample products:

```javascript
use university-merch

db.products.insertMany([
  {
    name: "University T-Shirt",
    description: "Official university t-shirt with embroidered logo",
    price: 24.99,
    category: "Apparel",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "White", "Gray"],
    stock: 100,
    images: ["https://via.placeholder.com/300?text=T-Shirt"],
    rating: 4.5,
    numReviews: 10,
    featured: true,
    createdAt: new Date()
  },
  {
    name: "University Hoodie",
    description: "Cozy hoodie with university branding",
    price: 44.99,
    category: "Apparel",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Gray"],
    stock: 50,
    images: ["https://via.placeholder.com/300?text=Hoodie"],
    rating: 4.8,
    numReviews: 25,
    featured: true,
    createdAt: new Date()
  },
  {
    name: "University Mug",
    description: "Ceramic mug with university logo",
    price: 12.99,
    category: "Drinkware",
    sizes: ["One Size"],
    colors: ["White", "Navy"],
    stock: 200,
    images: ["https://via.placeholder.com/300?text=Mug"],
    rating: 4.3,
    numReviews: 15,
    featured: false,
    createdAt: new Date()
  },
  {
    name: "University Backpack",
    description: "Durable backpack with multiple compartments",
    price: 39.99,
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Navy", "Black"],
    stock: 75,
    images: ["https://via.placeholder.com/300?text=Backpack"],
    rating: 4.7,
    numReviews: 30,
    featured: true,
    createdAt: new Date()
  },
  {
    name: "University Notebook",
    description: "Premium quality notebook with university branding",
    price: 8.99,
    category: "Stationery",
    sizes: ["One Size"],
    colors: ["Blue", "Red"],
    stock: 150,
    images: ["https://via.placeholder.com/300?text=Notebook"],
    rating: 4.4,
    numReviews: 20,
    featured: false,
    createdAt: new Date()
  }
])
```

### Option 2: Use the Admin Panel (Recommended)

1. **Register a normal account** via the UI at `/register`
2. **Make it admin** using MongoDB:

```javascript
mongosh
use university-merch

db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

exit
```

3. **Login** with your account
4. **Go to Admin Panel** at http://localhost:3000/admin
5. **Click "+ Add New Product"** and fill in the form
6. Products are added instantly through the API!

**Admin Panel Features:**
- ✅ Add new products with a user-friendly form
- ✅ Edit existing products
- ✅ Delete products (Admin only)
- ✅ Upload multiple images (via URLs)
- ✅ Set sizes and colors with checkboxes
- ✅ Mark products as featured
- ✅ Real-time product list view

### Option 3: Using MongoDB Shell (Alternative)

See "Option 1" section above for MongoDB shell commands to insert products directly.

---

## Common Commands
```bash
npm start          # Start server (production)
npm run dev        # Start server with nodemon (development)
```

### Client Commands
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## Verify Everything is Working

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"success":true,"message":"Server is running"}`

2. **Frontend:**
   Open http://localhost:3000 in your browser

3. **Database:**
   ```bash
   mongosh
   use university-merch
   show collections
   ```

## Troubleshooting

### Port 5000 already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in server/.env
```

### Port 3000 already in use
```bash
# React will ask if you want to use another port
# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB connection refused
```bash
# Check if MongoDB is running
mongosh

# If not, start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Next Steps

- Customize the application for your university
- Add real product images
- Implement payment gateway
- Deploy to production
- Add admin dashboard functionality

**Happy Coding! 🎓**
