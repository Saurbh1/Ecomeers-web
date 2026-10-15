# Premium Ecommerce Platform

A full-stack ecommerce application built with React, Node.js, MongoDB, and Tailwind CSS. Features modern UI, admin dashboard, payment integration, and complete product management.

## Features

### Frontend
- **Modern Responsive UI** - Premium design with Tailwind CSS
- **User Authentication** - Register, login, persistent sessions
- **Product Browsing** - Collection with pagination and filtering
- **Shopping Cart** - Add/remove items with local + server persistence
- **Checkout** - Address form, payment method selection
- **Payment Integration** - Razorpay payment gateway support
- **Order Management** - View order history and status tracking
- **User Dashboard** - Profile management, wishlist, order history
- **Responsive Design** - Mobile-first design, works on all devices

### Admin Panel
- **Product Management** - Add, edit, delete products with image upload
- **Image Upload** - Multi-image upload via Cloudinary
- **Inventory Management** - Stock tracking
- **Order Management** - View and update order status
- **Dashboard Analytics** - Revenue stats and order metrics
- **Protected Routes** - Admin-only access

### Backend
- **REST APIs** - Complete REST API endpoints
- **JWT Authentication** - Secure token-based auth
- **MongoDB Database** - Scalable document-based storage
- **Password Hashing** - bcryptjs password encryption
- **Razorpay Integration** - Payment processing
- **Image Upload** - Cloudinary integration
- **Error Handling** - Comprehensive error management
- **Validation** - Request validation and sanitization

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- Razorpay

## Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:5173
```

5. Start backend:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=your_razorpay_key
```

5. Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Collection.jsx
│   │   │   ├── Product.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Order.jsx
│   │   │   ├── PlaceOrder.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminProducts.jsx
│   │   │   │   └── AdminOrders.jsx
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   └── payments.js
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── uploadController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── upload.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── asyncHandler.js
│   ├── config/
│   │   └── db.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── razorpay.js
│   └── server.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `DELETE /api/cart/remove/:productId` - Remove from cart

### Orders
- `POST /api/orders/create` - Create order
- `POST /api/orders/verify` - Verify Razorpay payment
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/admin` - Get all orders (admin)
- `PUT /api/orders/:id` - Update order status (admin)

### Upload
- `POST /api/upload` - Upload images (admin)

## Usage Guide

### Customer Flow
1. Browse products on home/collection pages
2. Click product to view details
3. Add items to cart
4. Proceed to checkout
5. Enter delivery address
6. Select payment method (COD or Razorpay)
7. Complete payment
8. View order in My Orders

### Admin Flow
1. Login with admin credentials
2. Access admin dashboard from profile menu
3. Manage products (add/edit/delete with image upload)
4. View and update order status
5. Check revenue analytics

## Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Create new service on Render/Railway
3. Connect GitHub repository
4. Set environment variables
5. Deploy automatically on push

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set build command: `npm run build`
4. Deploy automatically

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Create database user
3. Update MONGO_URI in backend .env

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Protected admin routes
- Request validation
- CORS configuration
- Secure payment processing
- Environment variable protection

## Performance Optimizations

- Lazy loading of components
- Image optimization
- Pagination on product lists
- Async request handling
- Database indexing
- Efficient state management

## Future Enhancements

- Product reviews and ratings system
- Advanced filtering and search
- Wishlist feature expansion
- Promo codes and discounts
- Email notifications
- SMS notifications
- User notifications
- Product recommendations
- Social media integration
- Analytics dashboard

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables
- Check Node.js version (18+)

### Frontend API calls failing
- Verify backend is running on port 5000
- Check CORS configuration
- Verify VITE_API_URL in frontend .env

### Payment issues
- Verify Razorpay credentials
- Check payment key in frontend
- Test with Razorpay test mode

## Support

For issues or questions, please check the documentation or contact support.

## License

This project is licensed under the MIT License.

---

**Built with ❤️ for modern ecommerce**
