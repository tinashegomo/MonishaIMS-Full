# Monisha IMS — Frontend

React frontend for the Monisha Inventory Management System — a school uniform inventory platform built with React, Vite, Tailwind CSS, and TanStack Query.

## Tech Stack

- **React 19** with Vite 8
- **Tailwind CSS 4** (semantic design tokens)
- **TanStack Query** for server state management
- **React Hook Form** + **Yup** for form validation
- **Recharts** for dashboard charts
- **Axios** for HTTP requests
- **Lucide React** for icons
- **React Router DOM** for routing

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and expects the backend at `http://localhost:8080`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── api/              # Axios instance and API functions
├── components/
│   ├── auth/         # Login/Register forms, ProtectedRoute
│   ├── customer/     # Customer modal
│   ├── dashboard/    # Dashboard charts, info panels, shared components
│   ├── layout/       # TopNav, BottomNav, MainLayout
│   ├── order/        # Order item list, row, helpers, customer input
│   ├── product/      # Product form, list, delete modal
│   ├── school/       # School modal
│   └── warehouse/    # Warehouse batch list, form, delete modal
├── hooks/            # TanStack Query hooks
├── pages/
│   ├── admin/        # Users list, user details, delete modal
│   ├── auth/         # Login, Register, ForgotPassword
│   ├── customers/    # Customers list
│   ├── dashboard/    # Dashboard
│   ├── orders/       # Orders list, create, details
│   ├── products/     # Products list, create, details
│   ├── profile/      # Profile (edit, password, dark mode)
│   ├── schools/      # Schools list
│   ├── tailoring/    # Tailoring (IN_PRODUCTION orders)
│   └── warehouse/    # Warehouse list, create, details
├── utils/            # Token utilities
└── yupSchema/        # Yup validation schemas per entity
```

## Pages

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Email + password sign in |
| `/register` | Register | Create account |
| `/forgot-password` | Forgot Password | Reset password |
| `/` | Dashboard | Stats, charts, info panels |
| `/warehouse` | Warehouse | Batch list |
| `/warehouse/create-batch` | Create Batch | New warehouse batch form |
| `/warehouse/:batchId` | Batch Details | Batch info, sizes, products |
| `/products` | Products | Product list |
| `/products/create-product` | Create Product | New product form |
| `/products/:productId` | Product Details | Product info, financials, sizes |
| `/orders` | Orders | Order list with status management |
| `/orders/create-order` | Create Order | New order form |
| `/orders/:orderId` | Order Details | Order info, items, measurements |
| `/tailoring` | Tailoring | IN_PRODUCTION orders |
| `/schools` | Schools | School CRUD |
| `/customers` | Customers | Customer list |
| `/profile` | Profile | Edit info, change password, dark mode |
| `/admin/users` | Users | User management (admin only) |
| `/admin/users/:userId` | User Details | User info and activity |

## Design System

All styling uses Tailwind 4 semantic tokens defined in `index.css`:

- **Colors**: `text-text-primary`, `bg-surface-base`, `bg-brand-primary`, `border-border-default`
- **Typography**: `text-h2`, `text-body-normal`, `text-ui-label`
- **Spacing**: `mb-32`, `p-24`, `gap-16`
- **Effects**: `shadow-elevation-1`, `rounded-card`, `glass-panel`

No raw Tailwind colors (e.g., `text-red-500`) except in Recharts configs and dashboard status cards.

## Responsive Layout

- **Desktop (lg+)**: Horizontal top navbar with brand, nav links, profile dropdown
- **Mobile (<lg)**: Fixed bottom tab bar with 5 icon links + "More" profile dropdown
- Tables are `min-w-*` / `w-*` with no horizontal scroll
- All list pages use `max-w-7xl mx-auto`

## Authentication

JWT-based. Token stored in localStorage, attached to every request via Axios interceptor. 401/403 responses auto-redirect to `/login`.

## Backend API

All requests go to `http://localhost:8080/api/monishaInventory/`. See the backend project for full API documentation.
