# Setup Guide - Premium Ecommerce Platform

Complete step-by-step setup instructions for the full-stack ecommerce application.

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed ([Download](https://nodejs.org/))
- Git installed
- A MongoDB Atlas account (free tier available at [mongodb.com](https://www.mongodb.com))
- Cloudinary account for image hosting ([Sign up](https://cloudinary.com))
- Razorpay account for payments ([Sign up](https://razorpay.com))

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new project
4. Create a cluster (choose free tier)
5. Create a database user with username and password
6. Whitelist your IP address
7. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
8. Save this for backend setup

## Step 2: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/users/register/free)
2. Create a free account
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Razorpay Setup

1. Go to [Razorpay](https://razorpay.com)
2. Create a merchant account
3. Go to Settings > API Keys
4. Copy your test mode:
   - Key ID
   - Key Secret

## Step 4: Backend Setup

### 4.1 Install Backend Dependencies

```bash
cd backend
npm install
```

### 4.2 Create Environment File

```bash
cp .env.example .env
```

### 4.3 Update Backend .env

Edit `backend/.env` with your credentials:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String (from MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Secret (create a random string)
JWT_SECRET=your_random_jwt_secret_key_here_make_it_long

# Cloudinary Credentials
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# Razorpay Credentials (Test Mode)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Frontend URL for CORS
CLIENT_URL=http://localhost:5173
```

### 4.4 Start Backend

```bash
npm run dev
```

You should see: `Server running on port 5000`

## Step 5: Frontend Setup

### 5.1 Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 5.2 Create Environment File

```bash
cp .env.example .env
```

### 5.3 Update Frontend .env

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=rzp_test_your_key_id
```

### 5.4 Start Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Step 6: Create Admin User

1. Go to `http://localhost:5173/register`
2. Register a new account
3. In MongoDB Atlas:
   - Go to Collections
   - Find the user you just created in the `users` collection
   - Edit the document
   - Change `role` from `"user"` to `"admin"`
   - Save

## Step 7: Test the Application

### Test User Flow:
1. Visit `http://localhost:5173`
2. Browse products
3. Add products to cart
4. Proceed to checkout
5. Place order (COD or Razorpay test)

### Test Admin Flow:
1. Login with admin account
2. Click profile icon → Admin Dashboard
3. Go to Manage Products
4. Add a new product with images
5. Test product CRUD operations

## Troubleshooting

### Backend Issues

**Error: Cannot find module**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error: MongoDB connection failed**
- Verify MONGO_URI in .env
- Check IP address is whitelisted in MongoDB Atlas
- Ensure username/password are correct

**Error: Cloudinary upload fails**
- Verify CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY
- Check image file size < 5MB

### Frontend Issues

**Error: API calls failing (CORS error)**
- Ensure backend is running on port 5000
- Verify VITE_API_URL in frontend .env
- Check CLIENT_URL in backend .env

**Error: Razorpay not loading**
- Verify VITE_RAZORPAY_KEY is correct (test key)
- Check browser console for errors

**Error: Images not loading**
- Verify Cloudinary credentials
- Check network tab in browser DevTools

### Common Solutions

1. **Clear cache and reinstall:**
   ```bash
   npm cache clean --force
   npm install
   ```

2. **Check MongoDB connection:**
   ```bash
   # Test connection string directly in MongoDB Compass
   ```

3. **Verify API connection:**
   - Visit `http://localhost:5000/api/health`
   - Should return: `{"status":"OK"}`

## Development Tips

### Hot Reload
- Frontend: Automatically reloads on file save
- Backend: Use `npm run dev` (nodemon watches for changes)

### Debugging
- Frontend: Use React DevTools browser extension
- Backend: Logs appear in terminal

### Testing Payments
- Use Razorpay test card: `4111 1111 1111 1111`
- Any future date for expiry
- Any CVV

## Next Steps

After setup is complete:
1. Customize branding and colors
2. Add more products to database
3. Set up email notifications
4. Configure analytics
5. Prepare for deployment

## Deployment

See DEPLOYMENT.md for cloud deployment instructions.

## Support

For issues:
1. Check the troubleshooting section
2. Review error messages in browser console
3. Check backend logs in terminal
4. Visit project documentation

---

Happy coding! 🚀
