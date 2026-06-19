# Progress — Monisha IMS

## Status Legend
- [x] Done
- [~] In progress / partial
- [ ] Not started
- [!] Blocked / needs decision

---

## Infrastructure

- [x] Spring Boot 3.5.14 / Java 21 backend bootstrapped
- [x] Maven pom.xml with web, data-jpa, security, validation, mysql-connector, lombok, mapstruct 1.5.5.Final, jjwt 0.12.5
- [x] application.properties — MySQL DSN, JPA ddl-auto=update, JWT secret
- [x] CORS allowed for localhost:5173 and localhost:3000
- [x] React 19 + Vite 8 frontend bootstrapped
- [x] Tailwind 4 configured via index.css @theme (red primary scale, semantic tokens, dark mode)
- [x] ESLint 10 flat config (eslint.config.js)
- [x] npm run build passes
- [x] npm run lint passes
- [x] Frontend dependencies: axios, @tanstack/react-query, react-hook-form, yup, @hookform/resolvers, react-router-dom, lucide-react, tailwindcss v4, @tailwindcss/vite

---

## Backend — Modules

### Auth
- [x] UserEntity (UUID PK, email unique, BCrypt password, role, name, phone, timestamps)
- [x] UserRole enum (ADMIN, MANAGER, USER)
- [x] AuthService (register — always sets USER role; login — authenticates + issues JWT)
- [x] AuthController (/auth/register, /auth/login)
- [x] AuthRequestDTO (email, password), AuthResponseDTO (token, userId, userName, userEmail, userRole)
- [x] JWTUtils (sign/validate with HmacSHA256, 90-day expiry, email subject, secret from properties)
- [x] AuthFilter (OncePerRequestFilter, skips /auth/, populates SecurityContext)
- [x] AuthUser (wraps UserEntity, implements UserDetails, returns ROLE_* authorities)
- [x] CustomUserDetailsService (loads user by email)
- [x] SecurityConfig (stateless, BCrypt, /auth/** public, @EnableMethodSecurity enabled but unused)
- [x] CorsConfig (localhost:5173, localhost:3000)
- [x] SecurityUtils (static helpers: getCurrentUser, getCurrentUserEmail, getCurrentUserRole)
- [x] DataSeeder (creates admin tinashegomo96@gmail.com / Tinashe@123 on first boot)
- [ ] Role-based authorization (@PreAuthorize on admin endpoints)
- [ ] Refresh-token flow (not in v1 scope)

### Users
- [x] UserRepository (findByUserEmail, findByUserId, existsByUserEmail, existsByUserName, existsByUserRole)
- [x] UserService + UserController (get-current-user, get-current-user-role, get-all, get-by-id, update-role, delete)
- [x] UserRequestDTO (userName, userEmail, userPassword, userPhoneNumber, userRole — optional)
- [x] UserResponseDTO (userId, userName, userEmail, userRole, userPhoneNumber, createdAt, updatedAt)
- [x] UserMapper
- [ ] Frontend user management page (admin-only)

### Schools
- [x] SchoolEntity (schoolId PK, schoolName unique, createdAt, updatedAt, @OneToMany→products)
- [x] SchoolRepository (existsBySchoolName, findBySchoolName, findBySchoolId)
- [x] SchoolService + SchoolController (full CRUD)
- [x] SchoolRequestDTO (schoolName — @NotBlank, @Size 2-100)
- [x] SchoolResponseDTO (schoolId, schoolName, createdAt, updatedAt)
- [x] SchoolMapper
- [x] Frontend Schools page — list + create/edit modal

### Customers
- [x] CustomerEntity (customerId PK, customerName, phoneNumber, alternativePhoneNumber?, address?, @OneToMany→orders, timestamps)
- [x] CustomerRepository (findByCustomerId, findByCustomerName, existsByCustomerName)
- [x] CustomerService + CustomerController (full CRUD, duplicate name check, 204 on delete)
- [x] CustomerRequestDTO (customerName, phoneNumber, alternativePhoneNumber?, address?)
- [x] CustomerResponseDTO
- [x] CustomerMapper
- [x] Frontend Customers page — list + create/edit modal

### Warehouse / Batches
- [x] WarehouseBatchEntity (batchId PK, batchName unique, type, variant, color, batchPrice, totalQuantity, totalPrice, description?, timestamps, @OneToMany→batchSizes+products)
- [x] WarehouseBatchSizeEntity (sizeId PK, size, quantity, timestamps, @ManyToOne→batch)
- [x] WarehouseBatchRepository (existsByBatchName, findByBatchName, findByBatchId)
- [x] WarehouseBatchSizeRepository (findByBatch_BatchId, findByBatch_BatchIdAndSize)
- [x] WarehouseBatchService (create — with sizes, list, get-by-id, delete)
- [x] WarehouseBatchSizeService (add-size-to-batch, get-sizes-by-batch, calculateBatchTotalQuantity, deductStock)
- [x] WarehouseController (/warehouse/create-batch, get-all-batches, get-batch-byId, delete-batch)
- [x] WarehouseBatchRequestDTO (batchName, batchPrice, type, variant, color, description?, batchSizes — @NotEmpty nested list)
- [x] WarehouseBatchSizeRequestDTO (size, quantity — @Min 0)
- [x] WarehouseBatchResponseDTO, WarehouseBatchSizeResponseDTO
- [x] WarehouseBatchMapper, WarehouseBatchSizeMapper
- [ ] Frontend Warehouse page (most complex form — useFieldArray for sizes)
- [ ] Update batch endpoint

### Products
- [x] ProductEntity (productId PK, productName, productPrice, totalPrice, type, variant, color, totalQuantity, description?, @ManyToOne→school?, @ManyToOne→batch, @OneToMany→productSizes)
- [x] ProductSizeEntity (productSizeId PK, size, quantity, timestamps, @ManyToOne→product)
- [x] ProductRepository (findByProductId), ProductSizeRepository (findByProduct_ProductId, findByProduct_ProductIdAndSize)
- [x] ProductService (create — with sizes from batch + optional school, list, get-by-id, delete)
- [x] ProductSizeService (add-size-to-product, get-sizes-by-product, calculateProductTotalQuantity, deductStock)
- [x] ProductController (/product/create-product, get-all-products, get-product-byId, delete-product)
- [x] ProductRequestDTO (productName, productPrice, description?, productSizes — @NotEmpty, schoolId?, batchId — @NotNull)
- [x] ProductSizeRequestDTO (size, quantity — @Min 1)
- [x] ProductResponseDTO (flattens schoolId/schoolName, batchId/batchName)
- [x] ProductSizeResponseDTO
- [x] ProductMapper (flattens school, batch), ProductSizeMapper
- [ ] Frontend Products page (dependent dropdowns from batch inventory)
- [ ] Update product endpoint

### Orders
- [x] OrderEntity (@Table(name="orders"), UUID PK, orderNumber unique, totalAmount, paidAmount, balance, fullyPaid, hasMeasurements, schoolOrder, orderStatus, collectionDate?, notes?, @ManyToOne→customer+school?, @OneToMany→orderItems)
- [x] OrderItemEntity (orderItemId PK, type, variant, color, size, quantity, unitPrice, totalPrice, customMade, measurementsTaken, timestamps, @ManyToOne→order+product?+batch?, @OneToMany→measurements)
- [x] OrderStatus enum: PENDING, IN_PRODUCTION, READY_FOR_COLLECTION, COMPLETED, CANCELLED
- [x] OrderRepository (findByOrderId, findByOrderNumber, findByOrderStatus)
- [x] OrderItemRepository (findByOrderItemId)
- [x] OrderService (create with full flow: snapshot+deduct+calc+derive-status, list, get-by-id, get-by-status, update-status)
- [x] OrderItemService (3 modes: product ready-made, batch ready-made, custom-made)
- [x] OrderController (POST create, GET all, GET by-id, GET by-status, PATCH update-status — NO delete)
- [x] OrderRequestDTO (customerId, schoolId?, paidAmount, collectionDate?, notes?, orderItems — @NotEmpty)
- [x] OrderItemRequestDTO (productId?, batchId?, size?, quantity, type?, variant?, color?, unitPrice?, customMade?, measurementsTaken?, measurements?)
- [x] OrderResponseDTO (flattens customerId/name, schoolId/name, all financial fields, orderItems)
- [x] OrderItemResponseDTO (flattens productId, batchId, measurements)
- [x] OrderMapper (toEntity ignores 10 fields set by service; toResponse flattens customer+school)
- [x] OrderItemMapper (toEntity ignores type, variant, color, unitPrice, totalPrice, order, product, batch, measurements)
- [ ] Frontend Orders page (list with status filter + create-order wizard)
- [ ] Add/remove items on existing order
- [ ] Custom-made stock deduction on status transition to COMPLETED

### Measurements (Tailoring)
- [x] MeasurementEntity (measurementId PK, measurementName, measurementValue BigDecimal, @ManyToOne→orderItem)
- [x] MeasurementRepository (findByMeasurementId)
- [x] MeasurementService (getMeasurementsByOrderItem, createMeasurements — internal, no controller)
- [x] MeasurementRequestDTO (measurementName, measurementValue — NO validation annotations)
- [x] MeasurementResponseDTO (measurementId, measurementName, measurementValue, orderItemId)
- [x] MeasurementMapper (flattens orderItem.orderItemId → orderItemId)
- [ ] Frontend Tailoring page (list IN_PRODUCTION orders, mark-complete action)

### Shared / Cross-cutting
- [x] GlobalExceptionHandler (NotFoundException → 404, DuplicateException → 409)
- [x] ErrorResponse { timestamp, errorMessage, errorDetails, errorCode }
- [x] SecurityUtils
- [ ] Validation error response handler (currently Spring default)
- [ ] Pagination on list endpoints
- [ ] Sorting/filtering

---

## Frontend — Pages

- [x] App.jsx (route table)
- [x] main.jsx (QueryClientProvider + BrowserRouter)
- [x] index.css (Tailwind 4 @theme + semantic tokens + dark mode)
- [x] api/InventoryAPI.js (axios instance + JWT request interceptor + all endpoint functions)
- [x] hooks/InventoryHooks.js (TanStack Query hooks for all endpoints)
- [x] utils/tokenUtils.js (getStoredToken, saveToken, removeToken, isTokenExpired)
- [x] components/auth/ProtectedRoute.jsx (token check → redirect to /login)
- [x] components/layout/MainLayout.jsx (sidebar + header + Outlet)
- [x] components/layout/Sidebar.jsx (nav links + brand + user profile from useGetCurrentUser)
- [x] components/layout/Header.jsx (search bar + notifications + user chip from useGetCurrentUser)
- [x] components/layout/NavLinks.jsx (route metadata with icons, badge, isFuture flag)
- [x] pages/auth/Login.jsx — styled page shell with error banner + LoginForm
- [x] components/auth/LoginForm.jsx — 2 fields (email, password), password toggle, loading spinner
- [x] pages/auth/Register.jsx — styled page shell with error banner + RegisterForm
- [x] components/auth/RegisterForm.jsx — 4 fields (username, email, password, phone), password toggle
- [~] pages/dashboard/Dashboard.jsx (placeholder)
- [x] pages/warehouse/Warehouse.jsx (full list page)
- [x] pages/warehouse/CreateWarehouseBatch.jsx (full create form)
- [x] pages/products/Products.jsx (full list page)
- [x] pages/products/CreateProduct.jsx (full create form)
- [x] pages/schools/Schools.jsx (full CRUD list + modal)
- [x] pages/customers/Customers.jsx (full CRUD list + modal)
- [x] pages/orders/Orders.jsx (full list page)
- [x] pages/orders/CreateOrder.jsx (full create form)
- [~] pages/tailoring/Tailoring.jsx (placeholder)
- [~] pages/settings/Settings.jsx (placeholder)
- [~] pages/profile/Profile.jsx (placeholder)

### Frontend — Plumbing
- [x] 401 response interceptor (auto-redirect to /login on expired token)
- [x] Login redirects to "/" (was "/dashboard" — no such route)
- [ ] Global toast/notification system
- [ ] Loading skeletons per page
- [ ] Confirmation modal for delete actions
- [ ] Optimistic updates for low-risk mutations

### Frontend — Yup Schemas
- [x] yup + @hookform/resolvers installed
- [x] Folder pattern established
- [x] yupSchema/auth/AuthRequestDTO.js (email, password)
- [x] yupSchema/auth/UserRequestDTO.js (userName, userEmail, userPassword, userPhoneNumber)
- [x] yupSchema/school/SchoolRequestDTO.js
- [x] yupSchema/customer/CustomerRequestDTO.js
- [x] yupSchema/warehouse/request/WarehouseBatchRequestDTO.js (with nested sizes)
- [x] yupSchema/product/request/ProductRequestDTO.js
- [x] yupSchema/order/request/OrderRequestDTO.js (with customer fields)

---

## Tests

- [x] Test package directory exists (empty)
- [ ] No tests written
- [ ] OrderService tests (stock deduction, order number gen, custom vs ready-made branching)
- [ ] AuthService tests (register duplicates, login failures)
- [ ] WarehouseBatchService tests (size CRUD, batch deletion cascade)
- [ ] SecurityConfig integration test
- [ ] Controller tests with MockMvc

---

## Documentation

- [x] AGENTS.md
- [x] documentation/project_documentation.md
- [x] documentation/backend_documentation.md
- [x] memory-bank/projectbrief.md
- [x] memory-bank/techContext.md
- [x] memory-bank/systemPatterns.md
- [x] memory-bank/activeContext.md
- [x] memory-bank/progress.md
- [ ] ADR: JWT-in-localStorage vs httpOnly cookie
- [ ] ADR: Verb-suffixed URL convention
- [ ] ADR: Snapshot fields on OrderItem

---

## Skills (Auto-Apply Status)

| Skill | Auto-applies | Reason |
|---|---|---|
| using-agent-skills | ✓ | Meta-skill for all others |
| context-engineering | ✓ | Session start, config compliance |
| spec-driven-development | ✓ | Every new page build |
| planning-and-task-breakdown | ✓ | Multi-step page builds |
| incremental-implementation | ✓ | Most work touches >1 file |
| test-driven-development | ✓ | Zero tests exist; every service needs coverage |
| debugging-and-error-recovery | ✓ | Build/lint/runtime errors |
| code-review-and-quality | ✓ | Before any significant change |
| code-simplification | ✓ | When refactoring |
| security-and-hardening | ✓ | Auth, forms, stock mutation |
| frontend-ui-engineering | ✓ | All page builds |
| ui-ux-pro-max | ✓ | Visual quality |
| api-and-interface-design | ✓ | Endpoint changes |
| documentation-and-adrs | ✓ | Recording decisions |
| doubt-driven-development | ✓ | High-stakes: auth, stock, orders |
| source-driven-development | ✓ | Verify framework patterns |
| git-workflow-and-versioning | — | Not a git repo |
| ci-cd-and-automation | — | No CI/CD |
| shipping-and-launch | — | Not in production |
| performance-optimization | — | Premature |
| browser-testing-with-devtools | — | No chrome-devtools MCP |
| deprecation-and-migration | — | Nothing to migrate |
| idea-refine | — | No vague ideas |
| interview-me | — | Specs are clear |
