# MyBookstore - Project Structure Guide

## 📁 File Organization

### Frontend (`src/`)
```
src/
├── api/                    # API communication
│   ├── axios.js           # Axios instance configuration
│   └── backend.js         # Backend API endpoints
│
├── components/            # Reusable UI components
│   ├── AuthModal.jsx      # Authentication modal
│   ├── BookCard.jsx       # Individual book display card
│   ├── Books.jsx          # Search results display
│   ├── BestSellers.jsx    # Bestseller carousel
│   ├── NewArrivals.jsx    # New books carousel
│   ├── Navbar.jsx         # Navigation bar
│   ├── Hero.jsx           # Hero/banner section
│   ├── Features.jsx       # Feature highlights
│   ├── Reviews.jsx        # Customer reviews section
│   ├── Gallery.jsx        # Image gallery
│   ├── CheckoutForm.jsx   # Stripe payment form
│   ├── CartPage.jsx       # Shopping cart display [MOVED TO PAGES]
│   ├── Categories.jsx     # Book categories
│   ├── BlogSection.jsx    # Blog/news section
│   ├── DiscountBanner.jsx # Promotional banner
│   └── Footer.jsx         # Footer component
│
├── context/               # Global state management
│   ├── AuthContext.jsx    # User authentication state
│   ├── BookContext.jsx    # Books data & search state
│   └── CartContext.jsx    # Shopping cart state
│
├── hooks/                 # Custom React hooks
│   └── [deprecated: useBooks.js removed - use BookContext instead]
│
├── pages/                 # Page components (routes)
│   ├── Home.jsx           # Homepage
│   ├── BookDetails.jsx    # Single book detail page
│   ├── CartPage.jsx       # Shopping cart page
│   ├── Checkout.jsx       # Payment checkout page
│   ├── MyOrders.jsx       # User's order history
│   └── AdminDashboard.jsx # Admin panel
│
├── utils/                 # Utility functions
│   └── currency.js        # Currency formatting (INR)
│   └── [deprecated: mockBooks.js removed - use Google Books API]
│
├── config/                # Configuration files
│   └── firebase.js        # Firebase configuration
│
├── assets/                # Static images/media
│
├── App.jsx                # Main app component
├── main.jsx               # React app entry point
├── App.css                # Global styles
└── index.css              # Global CSS reset
```

### Backend (`backend/`)
```
backend/
├── app.py                 # Flask application entry point
├── config.py              # Configuration (DB, secrets)
├── middleware.py          # Request middleware
├── init_db.py             # Database initialization
├── populate_dashboard.py  # Dashboard data seeding
├── rebuild_db.py          # Database rebuild utility
├── seed_db.py             # Database seeding script
├── requirements.txt       # Python dependencies
│
├── models/                # Database models
│   ├── __init__.py
│   ├── user.py           # User model
│   ├── product.py        # Product/Book model
│   ├── order.py          # Order model
│   └── review.py         # Review model
│
├── routes/                # API endpoint routes
│   ├── __init__.py
│   ├── auth.py           # Authentication routes (/api/auth/*)
│   ├── products.py       # Product routes (/api/products/*)
│   ├── orders.py         # Order routes (/api/orders/*)
│   ├── payments.py       # Payment routes (/api/payments/*)
│   ├── admin.py          # Admin routes (/api/admin/*)
│   └── reviews.py        # Review routes (/api/reviews/*)
│
└── instance/              # Instance folder (database files, config)
```

---

## 🔄 Application Flow

### "Buy Now" Feature Flow

#### Option 1: Quick Buy (From Book Details)
1. User clicks **"Buy Now"** button on book detail page
2. `quickBuy()` clears cart and adds ONLY that book
3. User navigates to checkout
4. Cart displays only the selected book with total calculation:
   - Base Price: `product.price`
   - Tax (8%): `totalPrice * 0.08`
   - Shipping: `$5.99` if under $50, free otherwise
5. Stripe payment processing
6. Order confirmation

#### Option 2: Add to Cart (From Book Cards)
1. User clicks **"🛒 Add to Cart"** icon on book card
2. `addToCart()` adds book to existing cart (accumulates items)
3. User continues shopping or clicks **"Buy Now"** in cart page
4. Checkout shows all cart items with combined total

---

## 📊 Total Price Calculation

```javascript
// Formula used in CheckoutForm.jsx and Checkout.jsx
const tax = totalPrice * 0.08;
const shipping = totalPrice > 50 ? 0 : 5.99;
const finalAmount = totalPrice + tax + shipping;
```

**Example:**
- Single book: $20
- Tax (8%): $1.60
- Shipping: $5.99 (book < $50)
- **Total: $27.59**

---

## 🗑️ Removed Files

### ✅ Removed Duplicates
- **`src/hooks/useBooks.js`** - Unused hook (uses Google Books API, but BookContext already handles this)
- **`src/utils/mockBooks.js`** - Mock data only used as fallback in unused hook

**Reason for Removal:** Application uses BookContext for centralized data management and Google Books API, making these files redundant.

---

## 🔧 Key Dependencies

| Package | Purpose |
|---------|---------|
| `react` | UI framework |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP requests |
| `@stripe/react-stripe-js` | Payment processing |
| `firebase` | Authentication |
| `tailwindcss` | Styling |
| `lucide-react` | Icons |
| `react-hot-toast` | Notifications |
| `swiper` | Carousels |
| `recharts` | Charts (admin dashboard) |

---

## 🚀 Environment Variables

Create `.env` file in root:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_FIREBASE_API_KEY=...
VITE_BACKEND_URL=http://localhost:5000
```

---

## 📝 API Endpoints

### Authentication (`/api/auth/`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout

### Products (`/api/products/`)
- `GET /` - Get all local products
- `GET /:id` - Get product details
- `POST /` - Create product (admin)

### Orders (`/api/orders/`)
- `GET /` - Get user's orders
- `POST /` - Create order
- `GET /:id` - Get order details

### Payments (`/api/payments/`)
- `POST /create-payment-intent` - Create Stripe payment intent
- `POST /webhook` - Stripe webhook for payment confirmation

---

## 🎯 Next Steps for Improvement

1. **Move CartPage to pages/** ✅ (Already in structure)
2. **Add error boundaries** for better error handling
3. **Optimize image loading** with lazy loading
4. **Add TypeScript** for better type safety
5. **Implement user reviews** properly
6. **Add book recommendations** based on purchase history
7. **Implement admin features** fully
