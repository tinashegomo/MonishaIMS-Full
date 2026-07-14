# Monisha IMS — Frontend

React frontend for the Monisha Inventory Management System — a school uniform inventory platform built with React, Vite, Tailwind CSS, and TanStack Query.

## Tech Stack

- **React 19** with Vite 8
- **Tailwind CSS 4** (semantic design tokens, no config file)
- **TanStack Query** for server state management
- **React Hook Form** + **Yup** for form validation
- **Recharts** for dashboard charts
- **Axios** for HTTP requests
- **Lucide React** for icons
- **React Router DOM** for routing
- **xlsx** for Excel export
- **jsPDF** + **jspdf-autotable** for PDF export

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
├── api/
│   └── InventoryAPI.js           # Axios instance + all endpoint functions
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx    # JWT guard, redirects to /login
│   ├── customer/
│   │   └── CustomerModal.jsx
│   ├── dashboard/
│   │   ├── DashboardCharts.jsx   # HeroStats, SecondaryStats, OrdersTrend
│   │   ├── DashboardInfoPanels.jsx
│   │   └── dashboardShared.jsx   # Shared card/chart components
│   ├── layout/
│   │   ├── MainLayout.jsx        # TopNav + Outlet + BottomNav
│   │   ├── TopNav.jsx            # Desktop navbar + profile dropdown
│   │   ├── BottomNav.jsx         # Mobile tab bar + profile dropdown
│   │   └── NavLinks.jsx          # Route metadata (icons, labels)
│   ├── order/
│   │   ├── CustomerInput.jsx     # Typeahead with inline new-customer expansion
│   │   ├── OrderItemList.jsx
│   │   └── OrderItemRow.jsx
│   ├── product/
│   │   ├── ProductForm.jsx
│   │   ├── ProductList.jsx
│   │   └── DeleteProductModal.jsx
│   ├── school/
│   │   └── SchoolModal.jsx
│   ├── warehouse/
│   │   ├── WarehouseBatchList.jsx
│   │   ├── WarehouseForm.jsx     # Autocomplete dropdowns for type/variant/color
│   │   └── DeleteBatchModal.jsx
│   └── shared/
│       └── Modal.jsx             # Reusable <dialog> modal
├── hooks/
│   ├── InventoryHooks.js         # TanStack Query hooks for ALL endpoints
│   ├── useCreateOrderForm.js     # Order form logic (useFieldArray)
│   ├── useDashboardStats.js      # Dashboard aggregate computations
│   ├── useProductForm.js         # Product form logic
│   └── useWarehouseForm.js       # Warehouse form logic + suggestion handlers
├── pages/
│   ├── admin/
│   │   ├── Users.jsx             # Admin user management
│   │   ├── UserDetails.jsx
│   │   └── ConfirmUserDeleteModal.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   ├── customers/
│   │   └── Customers.jsx         # Full CRUD list + modal
│   ├── dashboard/
│   │   └── Dashboard.jsx         # KPI stats, Recharts, alerts, export
│   ├── orders/
│   │   ├── Orders.jsx            # Order list with status dropdown + export
│   │   ├── CreateOrder.jsx       # Full create form with customer typeahead
│   │   └── OrderDetails.jsx
│   ├── products/
│   │   ├── Products.jsx          # Product list with export
│   │   ├── CreateProduct.jsx
│   │   └── ProductDetails.jsx
│   ├── profile/
│   │   └── Profile.jsx           # Edit info, change password, dark mode toggle
│   ├── schools/
│   │   └── Schools.jsx           # Full CRUD list + modal
│   ├── tailoring/
│   │   └── Tailoring.jsx         # IN_PRODUCTION orders with status dropdown
│   └── warehouse/
│       ├── Warehouse.jsx         # Batch list with export
│       ├── CreateWarehouseBatch.jsx
│       └── WarehouseBatchDetails.jsx
├── utils/
│   ├── tokenUtils.js             # JWT localStorage helpers + expiry check
│   ├── dateUtils.js              # Date formatting
│   ├── exportUtils.js            # exportToExcel() and exportToPDF()
│   └── statusUtils.js            # STATUS_TRANSITIONS, STATUS_COLORS
├── yupSchema/
│   ├── auth/
│   ├── customer/
│   ├── order/
│   ├── product/
│   ├── school/
│   ├── user/
│   └── warehouse/
└── index.css                     # Tailwind 4 @theme + semantic tokens + dark mode
```

## Pages

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Email + password sign in |
| `/register` | Register | Create account |
| `/forgot-password` | Forgot Password | Reset password |
| `/` | Dashboard | Stats, charts, info panels, Excel/PDF export |
| `/warehouse` | Warehouse | Batch list with Excel/PDF export |
| `/warehouse/create-batch` | Create Batch | New warehouse batch form |
| `/warehouse/:batchId` | Batch Details | Batch info, sizes, products |
| `/products` | Products | Product list with Excel/PDF export |
| `/products/create-product` | Create Product | New product form |
| `/products/:productId` | Product Details | Product info, financials, sizes |
| `/orders` | Orders | Order list with status management + Excel/PDF export |
| `/orders/create-order` | Create Order | New order form with customer typeahead |
| `/orders/:orderId` | Order Details | Order info, items, measurements |
| `/tailoring` | Tailoring | IN_PRODUCTION orders with status dropdown |
| `/schools` | Schools | School CRUD |
| `/customers` | Customers | Customer list |
| `/profile` | Profile | Edit info, change password, dark mode toggle |
| `/admin/users` | Users | User management (admin only) |
| `/admin/users/:userId` | User Details | User info and activity |

## Design System

All styling uses Tailwind 4 semantic tokens defined in `index.css`. No `tailwind.config.js` — everything is configured via the `@theme` block.

### Colors

| Token | Usage |
|---|---|
| `text-text-primary` | Headings, primary text |
| `text-text-secondary` | Body text |
| `text-text-muted` | Labels, timestamps |
| `bg-bg-default` | Page background |
| `bg-surface-default` | Cards, tables |
| `bg-surface-elevated` | Inputs, elevated surfaces |
| `bg-surface-muted` | Hover states |
| `bg-brand-primary` | Buttons, links |
| `bg-brand-hover` | Button hover |
| `bg-brand-pressed` | Button active |
| `bg-brand-tint` | Light brand background |
| `bg-brand-subtle` | Subtle brand background |
| `border-border-default` | Default borders |
| `border-border-focus` | Input focus |
| `text-danger-main` | Errors, delete actions |
| `text-success-main` | Positive values, in-stock |
| `text-warning-main` | Warnings |

### Typography

| Token | Usage |
|---|---|
| `text-h1` / `text-h2` / `text-h3` / `text-h4` | Headings |
| `text-body-normal` | Body text |
| `text-body-small` | Captions, dropdown items |
| `text-ui-label` | Form labels |

### Effects

| Token | Usage |
|---|---|
| `shadow-elevation-1` | Cards |
| `shadow-elevation-2` | Dropdowns, modals |
| `rounded-card` | Cards |
| `rounded-input` | Inputs, buttons |
| `rounded-full` | Icon buttons |
| `press-scale` | Click feedback |
| `animate-fade-in` | Page transitions |
| `animate-scale-in` | Dropdown entrance |

No raw Tailwind colors (e.g., `text-red-500`) except in Recharts configs and a few status badges.

## Dark Mode

Toggle in Profile page. Uses `.dark` class on `<html>` with full CSS custom property inversion.

```css
/* index.css — dark mode tokens */
.dark {
  --color-bg-default: var(--color-neutral-950);
  --color-surface-default: var(--color-neutral-900);
  --color-text-primary: var(--color-neutral-50);
  /* ... full palette swap */
}
```

All components use semantic tokens, so dark mode works automatically.

## Responsive Layout

- **Desktop (lg+)**: Horizontal top navbar with brand, nav links, profile dropdown
- **Mobile (<lg)**: Fixed bottom tab bar with 5 icon links + "More" profile dropdown
- Tables are `min-w-*` / `w-*` with no horizontal scroll
- All list pages use `max-w-7xl mx-auto`

## Dropdown Pattern

All dropdowns (profile menu, 3-dot action menus, autocomplete suggestions) use the same pattern:

1. **Single state**: `openMenu` / `openDropdown` (string | null)
2. **Container**: `relative` wrapper around trigger + dropdown
3. **Closing**: `onBlur` + `relatedTarget` check on the container
4. **Selecting**: `onMouseDown` + `preventDefault` on items (prevents blur before value is set)
5. **Positioning**: `absolute right-0 top-full mt-2 z-10`

No `useRef`, no `useEffect`, no `getBoundingClientRect`, no `position: fixed`.

## Export

Excel and PDF export on Dashboard, Warehouse, Products, and Orders pages.

```js
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

// Column definitions
const COLUMNS = [
  { header: "Order #", key: "orderNumber" },
  { header: "Customer", key: "customerName" },
];

// Usage
exportToExcel(data, COLUMNS, "orders");
exportToPDF(data, COLUMNS, "Orders", "orders");
```

## Authentication

JWT-based. Token stored in localStorage, attached to every request via Axios interceptor. 401/403 responses auto-redirect to `/login`.

## Backend API

All requests go to `http://localhost:8080/api/monishaInventory/`. In production, Vercel rewrites `/api/*` to the Render backend.
