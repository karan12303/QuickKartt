# QuickKart - MERN Stack E-Commerce Application

A full-featured e-commerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, role-based access control, product management, shopping cart, wishlist, and address management with Google Maps integration.

## Features

### Authentication
- JWT-based signup and login for shoppers and admins
- Passwords hashed with bcrypt
- Role-based access control: restrict admin-only routes

### Shopper Panel
- Register / Login / Logout
- Browse product list (name, price, image)
- Add to cart, remove from cart, adjust quantity
- Checkout with form: name, phone, selected address
- View order confirmation with order ID
- View past orders
- **Saved Address Management**:
  - Add new address (full name, address, city, pin code, phone)
  - Edit/delete saved addresses
  - Select one during checkout

### Admin Panel
- Login/logout as admin
- View, add, edit, delete products
- Upload product image via image URL (stored in MongoDB)
- View all customer orders with details (name, items, total, address)

## Project Structure

```
/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/                # React source code
│       ├── components/     # Reusable components
│       ├── context/        # Context API
│       ├── pages/          # Page components
│       │   └── admin/      # Admin pages
│       └── App.js          # Main App component
│
├── server/                 # Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Business logic
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   └── server.js           # Entry point
│
├── .env                    # Environment variables
└── README.md               # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd mern-ecommerce
   ```

2. Install backend dependencies:
   ```
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../client
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce-cart
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   ```

   Create a `.env` file in the client directory with the following variables:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

   To get a Google Maps API key:
   1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
   2. Create a new project or select an existing one
   3. Enable the "Maps JavaScript API" and "Places API"
   4. Create an API key in the "Credentials" section
   5. Restrict the API key to your domain for security

## Running the Application

1. Seed the database with admin user:
   ```
   cd server
   npm run data:seed
   ```
   This will create:
   - Admin user: admin@example.com / admin123
   - Regular user: john@example.com / john123

2. Start the backend server:
   ```
   npm run dev
   ```

3. Start the frontend development server (in a new terminal):
   ```
   cd ../client
   npm start
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product (Admin)
- `PUT /api/products/:id` - Update a product (Admin)
- `DELETE /api/products/:id` - Delete a product (Admin)
- `POST /api/products/seed` - Seed sample products

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Addresses
- `POST /api/users/addresses` - Add a new address
- `GET /api/users/addresses` - Get all addresses
- `PUT /api/users/addresses/:id` - Update an address
- `DELETE /api/users/addresses/:id` - Delete an address

## Technologies Used

- **Frontend:**
  - React.js
  - React Router
  - React Bootstrap
  - Axios
  - Context API for state management
  - Google Maps Places API for address autocomplete

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT for authentication
  - bcrypt for password hashing

## Deployment

### Deploying to GitHub

1. Create a GitHub repository:
   - Go to [GitHub](https://github.com/) and create a new repository
   - Follow the instructions to push your existing repository

2. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/quickkart.git
   git push -u origin main
   ```

### Deploying to Netlify

1. Set up your backend:
   - Deploy your backend to a service like Render, Heroku, or Railway
   - Update the `REACT_APP_API_URL` in `client/.env.production` with your backend URL

2. Deploy to Netlify:
   - Log in to [Netlify](https://www.netlify.com/)
   - Click "New site from Git"
   - Connect to your GitHub repository
   - Set the base directory to `client`
   - Click "Deploy site"

3. Set environment variables in Netlify:
   - Go to Site settings > Build & deploy > Environment
   - Add the following variables:
     - `REACT_APP_API_URL`: Your backend URL
     - `REACT_APP_GOOGLE_MAPS_API_KEY`: Your Google Maps API key

## Notes

- All prices are displayed in Indian Rupees (₹)
- The application uses context API for authentication and cart management
- The application includes role-based access control for admin features
- The frontend can be deployed to Netlify while the backend needs to be deployed to a service that supports Node.js applications
