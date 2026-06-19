# Tech Context — Monisha IMS

## Stack Overview

| Layer | Technology | Version |
|---|---|---|
| Backend framework | Spring Boot | 3.5.14 |
| Language (backend) | Java | 21 |
| Build (backend) | Maven | (Spring Boot parent) |
| ORM | Spring Data JPA (Hibernate) | (managed) |
| Database | MySQL | 8.x assumed |
| Auth | JWT (jjwt) | jjwt 0.12.5 |
| Mapping | MapStruct | 1.5.5.Final |
| Boilerplate | Lombok | 1.18.38 |
| Frontend framework | React | 19.2.6 |
| Build (frontend) | Vite | 8.0.12 |
| Styling | Tailwind CSS | 4.3.0 |
| Tailwind Vite plugin | @tailwindcss/vite | 4.3.0 |
| Routing | react-router-dom | 7.17.0 |
| Server state | @tanstack/react-query | 5.101.0 |
| HTTP client | axios | 1.17.0 |
| Forms | react-hook-form | 7.77.0 |
| Validation | yup + @hookform/resolvers | yup 1.7.1, resolvers 5.4.0 |
| Icons | lucide-react | 1.17.0 |
| Linting | ESLint | 10.3.0 (flat config) |
| Vite React plugin | @vitejs/plugin-react | 6.0.1 |

## Repository Layout

```
MonishaInventoryManagementSystem/
├── AGENTS.md                        # AI agent rules (memory-bank + skills)
├── memory-bank/                     # 5 context files (projectbrief, techContext, systemPatterns, activeContext, progress)
├── skills/                          # 24 SKILL.md workflow files
├── backend/
│   └── MonishaInventoryManagementSystem/
│       ├── pom.xml
│       └── src/main/java/com/tinasheGomo/monishainventorymanagementsystem/
│           ├── MonishaInventoryManagementSystemApplication.java
│           ├── config/DataSeeder.java          # Seeds default admin on first boot
│           ├── controller/
│           │   ├── auth/AuthController.java
│           │   ├── user/UserController.java
│           │   ├── school/SchoolController.java
│           │   ├── customer/CustomerController.java
│           │   ├── warehouse/WarehouseController.java
│           │   ├── product/ProductController.java
│           │   └── order/OrderController.java
│           ├── service/
│           │   ├── auth/AuthService.java
│           │   ├── user/UserService.java
│           │   ├── school/SchoolService.java
│           │   ├── customer/CustomerService.java
│           │   ├── warehouse/WarehouseBatchService.java
│           │   ├── warehouse/WarehouseBatchSizeService.java
│           │   ├── product/ProductService.java
│           │   ├── product/ProductSizeService.java
│           │   ├── order/OrderService.java
│           │   ├── order/OrderItemService.java
│           │   └── measurement/MeasurementService.java
│           ├── repository/ (7 packages, one per module)
│           ├── entity/
│           │   ├── user/UserEntity.java
│           │   ├── school/SchoolEntity.java
│           │   ├── customer/CustomerEntity.java
│           │   ├── warehouse/WarehouseBatchEntity.java
│           │   ├── warehouse/WarehouseBatchSizeEntity.java
│           │   ├── product/ProductEntity.java
│           │   ├── product/ProductSizeEntity.java
│           │   ├── order/OrderEntity.java
│           │   ├── order/OrderItemEntity.java
│           │   └── measurement/MeasurementEntity.java
│           ├── dto/ (auth, user, school, customer, measurement, warehouse/{request,response}, product/{request,response}, order/{request,response})
│           ├── mapper/ (7 packages, one per module)
│           ├── security/
│           │   ├── SecurityConfig.java
│           │   ├── AuthFilter.java
│           │   ├── JWTUtils.java
│           │   ├── AuthUser.java
│           │   ├── CustomUserDetailsService.java
│           │   ├── CorsConfig.java
│           │   └── SecurityUtils.java
│           ├── exception/
│           │   ├── GlobalExceptionHandler.java
│           │   ├── ErrorResponse.java
│           │   └── exceptions/NotFoundException.java, DuplicateException.java
│           └── enums/
│               ├── OrderStatus.java (PENDING, IN_PRODUCTION, READY_FOR_COLLECTION, COMPLETED, CANCELLED)
│               └── UserRole.java (ADMIN, MANAGER, USER)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── jsconfig.json (path alias @/ → src/)
│   ├── index.html
│   └── src/
│       ├── main.jsx                  (QueryClient + BrowserRouter)
│       ├── App.jsx                   (route table)
│       ├── index.css                 (Tailwind 4 @theme + dark mode + semantic tokens)
│       ├── api/InventoryAPI.js       (axios instance + all endpoint functions)
│       ├── hooks/InventoryHooks.js   (TanStack Query hooks for all endpoints)
│       ├── utils/tokenUtils.js       (JWT localStorage helpers + exp check)
│       ├── components/
│       │   ├── auth/ProtectedRoute.jsx
│       │   ├── auth/LoginForm.jsx
│       │   ├── auth/RegisterForm.jsx
│       │   └── layout/{MainLayout,Sidebar,Header,NavLinks}.jsx
│       ├── pages/
│       │   ├── auth/Login.jsx
│       │   ├── auth/Register.jsx
│       │   ├── dashboard/Dashboard.jsx (placeholder)
│       │   ├── warehouse/Warehouse.jsx (placeholder)
│       │   ├── products/Products.jsx (placeholder)
│       │   ├── schools/Schools.jsx (placeholder)
│       │   ├── orders/Orders.jsx (placeholder)
│       │   ├── tailoring/Tailoring.jsx (placeholder)
│       │   ├── settings/Settings.jsx (placeholder)
│       │   └── profile/Profile.jsx (placeholder)
│       └── yupSchema/
│           └── auth/AuthRequestDTO.js, UserRequestDTO.js
└── documentation/
    ├── project_documentation.md
    └── backend_documentation.md
```

## Backend Configuration (`application.properties`)

```
spring.datasource.url=jdbc:mysql://localhost:3306/monisha_inventory
spring.datasource.username=root
spring.datasource.password=pass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
SecretJwtString="tinashegomo123456789tinashegomo123456789";
# jwt.expiration = 90 days (7776000000L) — hardcoded in JWTUtils.java
server.port=8080
```

- CORS: `http://localhost:5173` (Vite dev), `http://localhost:3000` (CRA fallback). All methods, credentials enabled.

## API Contract

**Base path:** `/api/monishaInventory`

### Auth (public)
- `POST /auth/register` — body: `UserRequestDTO` {userName, userEmail, userPassword, userPhoneNumber} → `AuthResponseDTO` {token, userId, userName, userEmail, userRole}
- `POST /auth/login` — body: `AuthRequestDTO` {email, password} → `AuthResponseDTO`

### Users (authenticated)
- `GET /user/get-current-user` → `UserResponseDTO`
- `GET /user/get-current-user-role` → `UserRole` enum string
- `GET /user/get-all-users` → `List<UserResponseDTO>`
- `GET /user/get-user-byId/{id}` → `UserResponseDTO`
- `PUT /user/update-user-role/{userId}` — query param `userRole` → `UserResponseDTO`
- `DELETE /user/delete-user/{id}` → 204

### Schools
- `POST /school/create-school` — `SchoolRequestDTO` {schoolName}
- `GET /school/get-all-schools`
- `GET /school/get-school-byId/{schoolId}`
- `PUT /school/update-school/{schoolId}` — `SchoolRequestDTO`
- `DELETE /school/delete-school/{schoolId}` → 200 (void)

### Customers
- `POST /customer/create-customer` — {customerName, phoneNumber, alternativePhoneNumber?, address?}
- `GET /customer/get-all-customers`
- `GET /customer/get-customer-byId/{customerId}`
- `PUT /customer/update-customer/{customerId}`
- `DELETE /customer/delete-customer/{customerId}` → 204

### Warehouse
- `POST /warehouse/create-batch` — {batchName, batchPrice, type, variant, color, description?, batchSizes: [{size, quantity}]}
- `GET /warehouse/get-all-batches`
- `GET /warehouse/get-batch-byId/{batchId}`
- `DELETE /warehouse/delete-batch/{batchId}` → 200 (void)

### Products
- `POST /product/create-product` — {productName, productPrice, description?, productSizes: [{size, quantity}], schoolId?, batchId}
- `GET /product/get-all-products`
- `GET /product/get-product-byId/{productId}`
- `DELETE /product/delete-product/{productId}` → 200 (void)

### Orders
- `POST /order/create-order` — {customerId, schoolId?, paidAmount, collectionDate?, notes?, orderItems: [{productId|batchId?, size?, quantity, type?, variant?, color?, unitPrice?, customMade?, measurementsTaken?, measurements?}]}
- `GET /order/get-all-orders`
- `GET /order/get-order-byId/{orderId}`
- `GET /order/get-order-byStatus/{status}` — OrderStatus enum
- `PATCH /order/update-order-status/{orderId}` — query param `status` → `OrderResponseDTO`

## Auth Flow

1. `POST /auth/login` returns `{ token, userId, userName, userEmail, userRole }`.
2. Frontend stores `token` in `localStorage` under key `token`.
3. Axios interceptor reads token and adds `Authorization: Bearer <token>` to every request.
4. `AuthFilter` (OncePerRequestFilter) reads header, validates JWT via `JWTUtils`, populates `SecurityContextHolder`.
5. `AuthFilter` **skips** `/api/monishaInventory/auth/**` so login/register are public.
6. `CustomUserDetailsService` loads users by email for the security stack.
7. `SecurityConfig` is stateless, CSRF disabled, BCrypt, `/auth/**` public, all else authenticated.
8. JWT: 90-day expiry, HmacSHA256, email as subject, secret from `application.properties`.
9. `ProtectedRoute.jsx` reads token from localStorage; if missing or expired → redirect to `/login`.
10. No 401 response interceptor exists yet on the axios instance.

## Frontend Configuration

- **Vite dev server:** port 5173 (default).
- **Path alias:** `@/` → `src/` in both `vite.config.js` (resolve.alias) and `jsconfig.json`.
- **API base URL:** `http://localhost:8080/api/monishaInventory` (hardcoded in `InventoryAPI.js`).
- **Tailwind 4** configured via `index.css` `@theme` block:
  - **Brand:** `primary-50`…`primary-900` — red scale (`#e60000` = primary-500)
  - **Neutrals:** `neutral-0` (white)…`neutral-1000` (black)
  - **Status:** `success-*` (green), `warning-*` (amber), `info-*` (blue)
  - **Semantic aliases:** `bg-default`, `surface-default`, `text-primary`, `border-default`, `brand-primary`, `danger-main`, etc. — defined on `:root` and `.dark`
  - **Font:** Inter (body)
  - **Dark mode:** `.dark` class toggle; full palette inversion via CSS custom properties
  - **Radius:** chip 4px, input 8px, card 12px, panel 16px, pill 999px
  - **Elevation:** 4 levels of box-shadow
- **State strategy:** TanStack Query for server state; no Redux/Zustand. Auth state in localStorage.
- **Routing:** Public routes: `/login`, `/register`. Protected routes wrapped in `<ProtectedRoute>` + `<MainLayout>`: `/`, `/warehouse`, `/products`, `/schools`, `/orders`, `/tailoring`, `/settings`, `/profile`.

## Build / Run

**Backend:**
```bash
cd backend/MonishaInventoryManagementSystem
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev     # Vite on :5173
npm run build   # Production build
npm run lint    # ESLint flat-config check
```

## Dependencies

### Maven (pom.xml)
- `spring-boot-starter-web`, `data-jpa`, `security`, `validation`
- `mysql-connector-j` (runtime)
- `lombok` 1.18.38 (provided)
- `mapstruct` 1.5.5.Final + `mapstruct-processor` (provided)
- `jjwt-api` 0.12.5 + `jjwt-impl`, `jjwt-jackson` (runtime)
- `spring-boot-starter-test`, `spring-security-test` (test)

### NPM (package.json)
- `react` 19.2.6, `react-dom` 19.2.6
- `react-router-dom` 7.17.0
- `@tanstack/react-query` 5.101.0
- `axios` 1.17.0
- `react-hook-form` 7.77.0
- `yup` 1.7.1, `@hookform/resolvers` 5.4.0
- `lucide-react` 1.17.0
- `tailwindcss` 4.3.0, `@tailwindcss/vite` 4.3.0
- Dev: `vite` 8.0.12, `@vitejs/plugin-react` 6.0.1, `eslint` 10.3.0, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`

## Entity ID Strategy

All entities use `@GeneratedValue(strategy = GenerationType.UUID)` with `UUID` primary keys. No auto-increment integers. The `@Setter(AccessLevel.NONE)` pattern prevents code from overriding generated IDs.

## Entity Field Patterns

- Every entity has `createdAt` (updatable=false) and `updatedAt` managed via `@PrePersist` / `@PreUpdate` lifecycle callbacks.
- `@ManyToOne` uses `FetchType.LAZY`.
- `@OneToMany` uses `CascadeType.ALL` + `orphanRemoval = true` for ownership relationships.
- `OrderEntity` uses `@Table(name="orders")` to avoid MySQL reserved keyword conflict.

## Database Tables (Hibernate-managed, ddl-auto=update)

| Entity | Table | Key Fields |
|---|---|---|
| UserEntity | user_entity | userId (PK), userName (unique), userEmail (unique), userPassword (BCrypt), userRole, userPhoneNumber (unique) |
| SchoolEntity | school_entity | schoolId (PK), schoolName (unique), @OneToMany→products |
| CustomerEntity | customer_entity | customerId (PK), customerName, phoneNumber, alternativePhoneNumber?, address?, @OneToMany→orders |
| WarehouseBatchEntity | warehouse_batch_entity | batchId (PK), batchName (unique), type, variant, color, batchPrice, totalQuantity, totalPrice, description?, @OneToMany→batchSizes+products |
| WarehouseBatchSizeEntity | warehouse_batch_size_entity | sizeId (PK), size, quantity, @ManyToOne→batch |
| ProductEntity | product_entity | productId (PK), productName, productPrice, totalPrice, type, variant, color, totalQuantity, description?, @ManyToOne→school?, @ManyToOne→batch, @OneToMany→productSizes |
| ProductSizeEntity | product_size_entity | productSizeId (PK), size, quantity, @ManyToOne→product |
| OrderEntity | orders | orderId (PK), orderNumber (unique), totalAmount, paidAmount, balance, fullyPaid, hasMeasurements, schoolOrder, orderStatus, collectionDate?, notes?, @ManyToOne→customer+school? |
| OrderItemEntity | order_item_entity | orderItemId (PK), type, variant, color, size, quantity, unitPrice, totalPrice, customMade, measurementsTaken, @ManyToOne→order+product?+batch? |
| MeasurementEntity | measurement_entity | measurementId (PK), measurementName, measurementValue (BigDecimal), @ManyToOne→orderItem |

## Known Issues

1. `application.properties` line 9 has `SecretJwtString="tinashegomo123456789tinashegomo123456789";` — the `@Value("${SecretJwtString}")` in JWTUtils reads this. Note the unusual property name format (not `jwt.secret`).
2. School API calls in `InventoryAPI.js` miss the `/school` prefix in their paths (e.g., `/create-school` instead of `/school/create-school`). This needs fixing.
3. No `@PreAuthorize` role checks on any controller methods.
4. `spring.jpa.show-sql=true` is always on (no profile gating).
5. No 401 response interceptor on the axios instance (expired token shows generic network error).
6. `validate` is a typo in `schools/Schools.jsx:5` (should be "validation").
