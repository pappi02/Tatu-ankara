# Tatu Ankara - E-Commerce Platform

A complete, single-file Next.js e-commerce application for Tatu Ankara, a Kenyan fashion brand specializing in women's clothing made from premium Ankara fabrics.

## Features

### Customer-Facing
- **Homepage** - Hero banner, featured collections, new arrivals, best sellers, why choose us
- **Shop** - Product grid with category filters, price range, sorting, search
- **Product Page** - Image gallery, size selector, quantity picker, size guide, delivery info
- **Cart** - Add/remove items, quantity updates, persistent localStorage
- **Checkout** - Multi-step checkout with M-Pesa payment instructions
- **Order Tracking** - Visual timeline showing order status progression
- **Authentication** - Login/register with role-based access
- **Customer Dashboard** - Order history, profile management

### Admin Dashboard
- **Dashboard** - Stats cards (today's orders, sales, pending payments, low stock)
- **Products** - Full CRUD with add/edit/delete, image URLs, variants, stock management
- **Orders** - View all orders, filter by status, update order status with one-click actions
- **Customers** - View customer list with order counts and total spent

### Design System
- Mobile-first responsive design
- Black, white, and gold (#C9A227) color palette
- Clean typography with generous whitespace
- Smooth animations and transitions
- Sticky cart button on mobile
- Skeleton loaders and empty states

## Tech Stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- Pure CSS (no external UI libraries)
- localStorage for persistence

## Demo Credentials
- **Admin**: admin@tatuankara.com / admin123
- **Customer**: Any email / Any password

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open http://localhost:3000
```

## How to Build for Production

```bash
npm run build
# Static files will be in the /dist folder
```

## Project Structure
```
tatu-ankara-shop/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main application (all components in one file)
│   └── globals.css     # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Architecture Highlights
- **Single-file architecture** - All components in one page.tsx for simplicity
- **Context-based state management** - No external state libraries needed
- **localStorage persistence** - Cart, orders, user data survive page refreshes
- **Product Variants** - Size-based inventory tracking prevents overselling
- **Status History** - Every order status change is logged with timestamp
- **Role-based routing** - Admin routes protected with guard checks

## Order Status Flow
1. Pending → Payment Submitted → Payment Confirmed → Preparing → Dispatched → Delivered
2. Admin can advance orders through the flow with one-click buttons
3. Customers see a visual timeline of their order progress

## Payment Workflow
- M-Pesa manual verification (Till Number: 123456)
- Customer submits M-Pesa confirmation message
- Admin confirms payment in dashboard
- Order proceeds to preparation

## Security Notes
- This is a demo application. In production:
  - Replace localStorage with a real backend API
  - Implement proper JWT authentication
  - Add input validation and sanitization
  - Use HTTPS for all communications
  - Implement rate limiting
  - Add CSRF protection
