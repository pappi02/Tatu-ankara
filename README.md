# Tatu Ankara - E-Commerce Platform

A complete, single-file Next.js e-commerce application for **Tatu Ankara**, a premium Kenyan fashion brand specializing in elegant women's clothing crafted from authentic Ankara fabrics. Features a modern, responsive design with full e-commerce capabilities including product browsing, shopping cart, checkout, and admin management.

## Features

### Customer-Facing
- **Homepage** - Hero banner, featured collections, new arrivals, best sellers, customer testimonials, and value propositions
- **Shop** - Product grid with category filtering (dresses, jumpsuits, two-piece sets, tops, skirts), search functionality, and sorting
- **Product Details** - High-quality product images, detailed descriptions, size variants with stock tracking, size guide, and delivery information
- **Shopping Cart** - Add/remove items, adjust quantities, real-time totals with persistent localStorage
- **Checkout** - Multi-step checkout flow with delivery address collection and M-Pesa payment instructions
- **Order Tracking** - Visual timeline showing order status progression (Pending → Payment Submitted → Payment Confirmed → Preparing → Dispatched → Delivered)
- **Authentication** - Secure login/register with role-based access control
- **Customer Dashboard** - View order history, track order status, manage profile information

### Admin Dashboard
- **Dashboard Overview** - Key metrics (today's orders, sales total, pending payments, low stock alerts)
- **Products Management** - Full CRUD operations (add, edit, delete), manage variants, stock levels, featured/new arrival tags
- **Orders Management** - View all orders, filter by status, update order status with one-click actions, track payment status
- **Customers Database** - View all customers, order counts, total customer spend, contact information

### Product Catalogue
8 premium Ankara pieces available:
1. **Celestial Circle Halter Maxi Dress** - Blue & gold circular pattern (Featured)
2. **Circular Print Crop Top & Pant Set** - Blue & orange two-piece (Featured)
3. **Leafy Green Strapless Jumpsuit** - Green & yellow leaf geometric
4. **Bold Multicolor Bodycon Midi Dress** - Red, gold & blue multicolor (Featured)
5. **Radiant Gold Ankara Duster Cardigan** - Red & gold duster jacket
6. **Celestial Peplum Blouse** - Blue, gold & white circular peplum top
7. **Sunset Pencil Midi Skirt** - Red & yellow circular pattern
8. **Emerald Wrap Dress** - Green & orange diamond pattern (Featured)

### Design System
- **Mobile-first responsive design** - Optimized for all screen sizes
- **Color Palette** - Sophisticated black, white, and gold (#C9A227) theme
- **Typography** - Clean, modern fonts with generous whitespace
- **Animations** - Smooth fade-ins, slide transitions, and hover effects
- **Components** - Reusable buttons, cards, badges, and form inputs
- **User Experience** - Skeleton loaders, empty states, toast notifications, and instant feedback

## Tech Stack
- **Framework** - Next.js 14 (App Router with server & client components)
- **Language** - TypeScript for type safety
- **Styling** - Pure CSS with CSS variables and media queries (no external UI libraries)
- **State Management** - React Context API for global app state
- **Storage** - localStorage for cart, orders, user session persistence
- **Images** - Optimized local PNG/JPG files served from `/public` folder

## Image Asset Structure
Product images are stored locally in `/public/` directory:
- `p1.jpg` - Celestial Circle Halter Maxi Dress
- `p2.jpg` - Circular Print Crop Top & Pant Set
- `p3.jpg` - Leafy Green Strapless Jumpsuit
- `p4.jpg` - Bold Multicolor Bodycon Midi Dress
- `p5.jpg` - Radiant Gold Ankara Duster Cardigan
- `p6.jpg` - Celestial Peplum Blouse
- `p7.jpg` - Sunset Pencil Midi Skirt
- `p8.jpg` - Emerald Wrap Dress

## Demo Credentials
- **Admin Login** - Email: `admin@tatuankara.com` | Password: `admin123`
- **Customer Login** - Use any email and password to create an account

## How to Run Locally

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation Steps

```bash
# 1. Navigate to project directory
cd tatu-ankara-shop

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser and navigate to
http://localhost:3000
```

### Troubleshooting
- **Images not displaying**: Ensure product images (p1.jpg - p8.jpg) are in `/public` folder
- **Port 3000 in use**: Kill the process or run on different port: `npm run dev -- -p 3001`
- **Hydration errors**: Clear browser cache and restart dev server

## How to Build for Production

```bash
npm run build
# Static files will be in the /dist folder
```

## Project Structure
```
tatu-ankara-shop/
├── app/
│   ├── layout.tsx          # Root layout with Next.js metadata & config
│   ├── page.tsx            # Main application (all components in single file)
│   └── globals.css         # Global CSS variables & base styles
├── public/
│   ├── p1.jpg              # Product images (p1-p8)
│   ├── p2.jpg
│   └── ... (p3-p8.jpg)
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
└── README.md               # This file
```

## Key Implementation Details

### State Management
- **AppContext** - Global state for cart, orders, products, user authentication
- **Custom Hooks** - `useApp()` for accessing app context throughout components
- **localStorage Integration** - Automatic persistence of cart, orders, wishlist, user data

### Product System
- **Variants** - Each product has size variants (S, M, L, XL) with individual stock levels
- **Categories** - Products organized by type (dresses, two-piece, jumpsuits, tops, skirts, all)
- **Metadata** - Featured, newArrival, and bestSeller flags for homepage display
- **Pricing** - Support for regular and sale prices with discount display

### Order Management
- **Status Flow** - Linear progression: Pending → Payment Submitted → Payment Confirmed → Preparing → Dispatched → Delivered
- **Status History** - Every status change logged with timestamp and operator
- **Payment Verification** - M-Pesa till-based payment with manual confirmation workflow
- **Order ID Format** - Unique identifiers using format `TA-{timestamp}`

### Authentication
- **Role-Based Access** - Admin and customer roles with different UI/features
- **Session Management** - User state persisted via localStorage
- **Protected Routes** - Admin dashboard only accessible with admin credentials

## Order Status Flow

The application implements a complete order lifecycle:

1. **Pending** - Order created, awaiting payment
2. **Payment Submitted** - Customer submitted M-Pesa confirmation
3. **Payment Confirmed** - Admin verified payment received
4. **Preparing** - Items being packed and prepared for shipment
5. **Dispatched** - Order shipped with tracking information
6. **Delivered** - Order successfully delivered to customer

Admin can advance orders through each stage with one-click status updates. Customers see real-time visual timeline of their order progress.

## Payment & Pricing

### Currency
- All prices displayed in **KES (Kenyan Shillings)**
- Format: `KES {amount.toLocaleString()}`

### Payment Method
- **M-Pesa Integration** - Manual verification workflow
- **Till Number** - 123456 (for customer payments)
- **Workflow** - Customer sends M-Pesa confirmation → Admin verifies in dashboard → Order proceeds

### Product Pricing
- Regular prices range from KES 2,600 - 6,200
- Sale prices offered on select items
- Size variants have consistent pricing per product

## Browser Support
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features
- **Skeleton Loaders** - Smooth content loading states
- **Image Optimization** - Local images served efficiently
- **CSS-in-JS** - Zero runtime CSS overhead
- **No External Dependencies** - Minimal bundle size
- **localStorage Caching** - Instant data retrieval

## Production Deployment Considerations

⚠️ **This is a demo/prototype application.** Before deploying to production:

### Security
- [ ] Replace localStorage with a secure backend API
- [ ] Implement JWT token-based authentication
- [ ] Add input validation and sanitization on all forms
- [ ] Implement HTTPS/TLS for all communications
- [ ] Add CSRF protection to state-changing operations
- [ ] Sanitize any user-generated content
- [ ] Implement rate limiting on API endpoints
- [ ] Use environment variables for sensitive configuration

### Backend Requirements
- [ ] Database (PostgreSQL, MongoDB, etc.) for persistent data storage
- [ ] API server (Node/Express, Python/Django, Go, etc.)
- [ ] Payment gateway integration (M-Pesa API provider)
- [ ] Email service for order notifications
- [ ] File storage (S3, Cloudinary) for product images
- [ ] Admin authentication system

### Performance
- [ ] Image CDN for faster delivery
- [ ] Database query optimization and indexing
- [ ] API caching strategies
- [ ] Compression and minification
- [ ] Database backups and recovery procedures

### Monitoring
- [ ] Error tracking (Sentry, Rollbar, etc.)
- [ ] Analytics and user tracking
- [ ] Server performance monitoring
- [ ] Uptime monitoring and alerts

## Future Enhancement Ideas
- User reviews and ratings
- Wishlist functionality (backend persistence)
- Abandoned cart recovery emails
- Recommendation engine
- Loyalty/rewards program
- Social media integration
- Live chat support
- Multiple language support (Swahili, etc.)
- Mobile app version

## Customization Guide

### Changing Brand Colors
Edit the CSS variables in `app/page.tsx` (around line 661):
```css
:root {
  --gold: #C9A227;      /* Primary accent color */
  --black: #111111;     /* Primary text/buttons */
  --white: #FFFFFF;     /* Background */
  /* Update gray tones and other colors as needed */
}
```

### Adding New Products
1. Add product image to `/public/` folder (e.g., `p9.jpg`)
2. Add product object to `DEMO_PRODUCTS` array in `app/page.tsx`
3. Include required fields: id, name, slug, description, price, category, images, variants, sizes
4. Update CATEGORIES array if adding a new category

### Modifying Categories
Edit the `CATEGORIES` array in `app/page.tsx` to add or remove product categories.

### Updating Company Information
- Store name: Search for "Tatu Ankara" throughout `app/page.tsx`
- Contact info: Update Footer component section
- About page content: Update AboutPage component section
- Social media links: Update Footer component with actual links

## License & Attribution
This project is provided as-is for educational and commercial purposes.

## Support
For issues, questions, or feature requests, please refer to the project documentation or contact the development team.
