# Luxe Commerce — Deployment Guide

Premium full-stack ecommerce app with **frontend fallback mode**: the store works even when MongoDB, Razorpay, or Cloudinary are unavailable.

## Tech Stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, Vite 6, Tailwind CSS, Framer Motion, Recharts |
| Backend | Express, MongoDB (optional), JWT, Razorpay, Cloudinary |

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=rzp_test_YOUR_KEY_HERE
```

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET=your_long_random_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_SECRET=your_razorpay_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
CLIENT_URL=https://your-frontend.vercel.app
```

> **Demo without backend:** Run only the frontend — products, cart, and wishlist use mock data and `localStorage`.

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Backend

```bash
cd backend
npm install
npm run dev
```

API: http://localhost:5000

## Production Build

```bash
cd frontend
npm run build
npm run preview
```

Output: `frontend/dist`

## Deploy Frontend (Vercel)

1. Push repo to GitHub.
2. Import project in [Vercel](https://vercel.com).
3. **Root Directory:** `frontend`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Add environment variables:
   - `VITE_API_URL` = your Render/Railway API URL + `/api`
   - `VITE_RAZORPAY_KEY` = Razorpay key ID

## Deploy Backend (Render)

1. New **Web Service** → connect repo.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add all `backend/.env` variables.
6. Set `CLIENT_URL` to your Vercel URL (for CORS if configured).

### MongoDB Atlas

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Whitelist `0.0.0.0/0` for cloud deploy (or Render IP).
3. Paste connection string into `MONGO_URI`.

## Coupon Codes (Demo)

| Code | Effect |
|------|--------|
| `PREMIUM10` | 10% off (min $50) |
| `WELCOME20` | $20 off (min $100) |
| `FREESHIP` | Free shipping |

Free shipping also applies on subtotals ≥ **$150**.

## Admin Access

Register a user, then set `role: "admin"` in MongoDB for that user document, or use your seeded admin account.

Routes:

- `/admin` — Dashboard & charts
- `/admin/products` — CRUD + image upload
- `/admin/orders` — Order management

## Fallback Architecture

| Failure | Behavior |
|---------|----------|
| MongoDB down | Mock products from `mockProducts.js` |
| API unreachable | Frontend `api/products.js` client fallback |
| Razorpay missing | Mock order IDs; COD still works |
| Cloudinary missing | Placeholder image URLs on upload |
| Not logged in | Cart/wishlist in `localStorage` |
| Order API fails | Orders saved to `local_orders` in browser |

## Verification Checklist

- [ ] `cd frontend && npm run build` — succeeds
- [ ] `cd frontend && npm run dev` — homepage loads with products
- [ ] `cd backend && npm run dev` — `API Running` at `/`
- [ ] Collection filters/search work offline
- [ ] Add to cart + checkout (guest = local order)
- [ ] Admin dashboard renders charts

## Portfolio Demo Tips

1. Run **frontend only** for instant demo (no MongoDB required).
2. Show coupon `PREMIUM10` at checkout.
3. Highlight responsive navbar, product zoom, and testimonials on home.

## Production Security (Backend)

| Layer | Implementation |
|-------|----------------|
| Headers | `helmet` |
| Rate limit | 200 req/15min API, 20 req/15min auth |
| NoSQL injection | `express-mongo-sanitize` |
| XSS | Custom body/query sanitizer |
| HPP | `hpp` |
| JWT | HttpOnly cookie + Bearer header, 7d expiry |
| CORS | Credentials + `CLIENT_URL` whitelist |
| Logging | JSON structured logger (`LOG_LEVEL`) |
| Health | `GET /api/health` |

## Production Frontend

| Feature | Details |
|---------|---------|
| Theme | Dark/light toggle (`localStorage`) |
| SEO | OpenGraph, Twitter cards, canonical URLs |
| Static | `public/robots.txt`, `public/sitemap.xml` |
| Performance | Lazy routes, code splitting, image lazy load |
| API | Retry (2x) on 5xx/timeout, fallback toasts |
| Admin | Pagination, bulk actions, CSV export |

Update `VITE_SITE_URL` and sitemap/robots URLs before going live.

---

© Luxe Commerce — Portfolio-ready premium ecommerce platform.
