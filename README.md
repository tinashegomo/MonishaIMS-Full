# Monisha Inventory Management System

A full-stack inventory management system for retail and tailoring businesses. Manages warehouse batches, products, customers, schools, orders, and tailoring workflows with real-time dashboard analytics.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Backend** | Spring Boot | 3.5.14 |
| **Language** | Java | 21 |
| **Database** | MySQL | 8.x |
| **ORM** | Spring Data JPA / Hibernate | - |
| **Auth** | JWT (jjwt) | 0.12.5 |
| **Object Mapping** | MapStruct | 1.5.5.Final |
| **Frontend** | React | 19.2.6 |
| **Build Tool** | Vite | 8.0.12 |
| **Styling** | Tailwind CSS | 4.3.0 |
| **Server State** | TanStack Query | 5.101.0 |
| **Forms** | React Hook Form + Yup | 7.77.0 / 1.7.1 |
| **Charts** | Recharts | 3.8.1 |
| **Export** | xlsx + jsPDF | 0.18.5 / 4.2.1 |

## Project Structure

```
MonishaInventoryManagementSystem/
├── backend/                              # Spring Boot API
│   └── MonishaInventoryManagementSystem/
│       ├── pom.xml
│       ├── Dockerfile
│       └── src/main/java/com/tinasheGomo/MonishaInventoryManagementSystem/
│           ├── config/                   # DataSeeder (default admin)
│           ├── controller/               # 7 module controllers
│           ├── service/                  # 8 module services
│           ├── repository/               # 7 JPA repositories
│           ├── entity/                   # 10 JPA entities (UUID PKs)
│           ├── dto/                      # Request/Response DTOs
│           ├── mapper/                   # MapStruct mappers
│           ├── security/                 # JWT, AuthFilter, SecurityConfig
│           ├── exception/                # Global exception handler
│           └── enums/                    # OrderStatus, UserRole
├── frontend/                             # React SPA
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                      # QueryClient + BrowserRouter
│       ├── App.jsx                       # Route table
│       ├── index.css                     # Tailwind 4 theme + dark mode
│       ├── api/InventoryAPI.js           # Axios instance + endpoints
│       ├── hooks/                        # TanStack Query hooks
│       ├── utils/                        # Export, date, status utilities
│       ├── components/                   # Reusable UI components
│       ├── pages/                        # Route pages
│       └── yupSchema/                    # Validation schemas
└── documentation/                        # Project docs
```

## Getting Started

### Prerequisites

- Java 21
- Maven
- Node.js 18+
- MySQL 8.x

### Backend

```bash
cd backend/MonishaInventoryManagementSystem

# Create database
mysql -u root -p -e "CREATE DATABASE monisha_inventory"

# Configure (edit application-local.properties for your MySQL credentials)
# Default: localhost:3306/monisha_inventory, root/pass

# Run
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs on `http://localhost:5173` with API proxy to `localhost:8080`.

### Default Admin Account

- **Email:** tinashegomo96@gmail.com
- **Password:** Tinashe@123

## API Endpoints

Base path: `/api/monishaInventory`

### Auth (Public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login (returns JWT) |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/user/get-current-user` | Get current user profile |
| GET | `/user/get-current-user-role` | Get current user role |
| GET | `/user/get-all-users` | List all users (admin) |
| GET | `/user/get-user-byId/{id}` | Get user by ID |
| PATCH | `/user/update-user-role/{id}` | Update user role |
| PATCH | `/user/update-user/{id}` | Update user profile |
| PATCH | `/user/change-password` | Change password |
| DELETE | `/user/delete-user/{id}` | Delete user |

### Warehouse

| Method | Endpoint | Description |
|---|---|---|
| POST | `/warehouse/create-batch` | Create batch with sizes |
| GET | `/warehouse/get-all-batches` | List all batches |
| GET | `/warehouse/get-batch-byId/{id}` | Get batch by ID |
| POST | `/warehouse/add-sizes-to-batch/{id}` | Add sizes to batch |
| DELETE | `/warehouse/delete-batch/{id}` | Delete batch |

### Products

| Method | Endpoint | Description |
|---|---|---|
| POST | `/product/create-product` | Create product |
| GET | `/product/get-all-products` | List all products |
| GET | `/product/get-product-byId/{id}` | Get product by ID |
| DELETE | `/product/delete-product/{id}` | Delete product |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/order/create-order` | Create order with items |
| GET | `/order/get-all-orders` | List all orders |
| GET | `/order/get-order-byId/{id}` | Get order by ID |
| GET | `/order/get-order-byStatus/{status}` | Filter by status |
| PATCH | `/order/update-order-status/{id}` | Update order status |

### Customers

| Method | Endpoint | Description |
|---|---|---|
| POST | `/customer/create-customer` | Create customer |
| GET | `/customer/get-all-customers` | List all customers |
| GET | `/customer/get-customer-byId/{id}` | Get customer by ID |
| PUT | `/customer/update-customer/{id}` | Update customer |
| DELETE | `/customer/delete-customer/{id}` | Delete customer |

### Schools

| Method | Endpoint | Description |
|---|---|---|
| POST | `/school/create-school` | Create school |
| GET | `/school/get-all-schools` | List all schools |
| GET | `/school/get-school-byId/{id}` | Get school by ID |
| PUT | `/school/update-school/{id}` | Update school |
| DELETE | `/school/delete-school/{id}` | Delete school |

## Frontend Routes

| Path | Page | Auth |
|---|---|---|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | Forgot Password | Public |
| `/` | Dashboard | Protected |
| `/warehouse` | Batch List | Protected |
| `/warehouse/create-batch` | Create Batch | Protected |
| `/warehouse/:batchId` | Batch Details | Protected |
| `/products` | Product List | Protected |
| `/products/create-product` | Create Product | Protected |
| `/products/:productId` | Product Details | Protected |
| `/schools` | Schools | Protected |
| `/customers` | Customers | Protected |
| `/orders` | Order List | Protected |
| `/orders/create-order` | Create Order | Protected |
| `/orders/:orderId` | Order Details | Protected |
| `/tailoring` | Tailoring | Protected |
| `/profile` | Profile | Protected |
| `/admin/users` | User Management | Admin |
| `/admin/users/:userId` | User Details | Admin |

## Architecture

### Backend Patterns

- **Layered architecture:** Controller -> Service -> Repository -> Entity
- **DTOs everywhere:** Entities never exposed to frontend
- **MapStruct** for entity/DTO mapping
- **UUID primary keys** on all entities
- **JWT authentication:** Stateless, 90-day expiry, BCrypt passwords
- **Global exception handling:** `NotFoundException` (404), `DuplicateException` (409)
- **Data seeding:** Default admin created on first boot

### Frontend Patterns

- **TanStack Query** for all server state (no Redux/Zustand)
- **React Hook Form + Yup** for form validation (schemas mirror backend DTOs)
- **Axios interceptors:** Auto-attach JWT, handle 401/403 redirects
- **Responsive layout:** TopNav on desktop, BottomNav on mobile
- **Dark mode:** Class-based `.dark` toggle with semantic token inversion
- **Export:** Excel and PDF export on Warehouse, Products, Orders, Dashboard

### Order Status Flow

```
PENDING -> IN_PRODUCTION -> READY_FOR_COLLECTION -> COMPLETED
   |              |
   +-> CANCELLED  +-> CANCELLED
```

## Deployment

- **Frontend:** Vercel (with API proxy rewrite to backend)
- **Backend:** Render (Docker-based, port 10000)
- **Production config:** All credentials via environment variables

## License

Private project.
