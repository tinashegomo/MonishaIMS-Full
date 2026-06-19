# System Patterns — Monisha IMS

## 1. Backend Architecture: Strict Layered

```
Controller  →  Service  →  Repository  →  Entity
   (HTTP)      (logic)      (JPA)        (persistence)
```

- **Controllers** only translate HTTP ↔ DTO and delegate to a single service method. No business logic, no DB access, no exception translation (handled by `GlobalExceptionHandler`). All controllers use `@RequestMapping("/api/monishaInventory/<module>")` at class level. All methods use verb-suffixed paths (`/create-X`, `/get-all-X`, `/get-X-byId/{id}`, `/update-X/{id}`, `/delete-X/{id}`).
- **Services** hold ALL business logic: validation, stock mutation, order-number generation, financial calculations, snapshot copying. Annotated `@Service`, `@RequiredArgsConstructor`, `@Transactional` on write methods.
- **Repositories** are `JpaRepository<Entity, UUID>` interfaces, one per entity, with derived-query methods only (no custom JPQL).
- **Entities** are JPA-managed records mapping 1:1 to DB columns. All use UUID PKs, `@PrePersist`/`@PreUpdate` for timestamps, `@Getter`/`@Setter`/`@NoArgsConstructor` from Lombok.
- **DTOs + MapStruct mappers** sit between Controller and Service; the Service consumes/produces DTOs on its public surface. Request DTOs carry `jakarta.validation` annotations (`@NotBlank`, `@NotNull`, `@Email`, `@Size`, `@Min`, `@NotEmpty`).

### Why DTOs everywhere (not entities)

1. **Decoupling** — wire format evolves independently of DB schema.
2. **Snapshot safety** — `OrderItemResponseDTO` includes snapshot fields (type, variant, color, unitPrice) copied from inventory at order time.
3. **Security** — entities like `UserEntity` carry `password`; DTOs omit it.
4. **Control** — computed fields (totalQuantity, totalPrice, balance) are calculated in the service; the frontend cannot set them.

## 2. MapStruct Convention

Each `dto/<module>/` has a matching `mapper/<module>/<X>Mapper.java` interface (`@Mapper(componentModel = "spring")`).

**Pattern:** Each mapper has 4 methods:
- `toEntity(RequestDTO)` — maps request → entity
- `toResponse(Entity)` — maps entity → response (with `@Mapping` for flattening nested relationships)
- `toResponseList(List<Entity>)` — batch response mapping
- `updateXFromDTO(RequestDTO, @MappingTarget Entity)` — partial update

**Critical pattern:** `OrderMapper.toEntity()` and `OrderItemMapper.toEntity()` use `@Mapping(target = "field", ignore = true)` for fields that the service sets manually (prices, totals, relationships, status). This prevents the frontend from injecting values into fields that should only come from business logic.

**Flattening:** `ProductMapper.toResponse()` uses `@Mapping(source = "school.schoolId", target = "schoolId")` to flatten nested objects into flat DTO fields.

## 3. Service Layer Business Rules

### 3a. Stock Deduction (Two-Level)

1. **Batch → Product:** When a product is created (`ProductService.createProduct`), `ProductSizeService.addSizeToProduct` creates product sizes. Stock is NOT deducted from batch at product creation time in the current code — the batch's `totalQuantity` and `totalPrice` are recalculated but batch sizes are not decremented. **Note:** The documentation says batch stock IS deducted, but the code in `ProductService.createProduct()` does NOT call `batchSizeService.deductStock()`. It only recalculates totals.

2. **Product → Order:** When an order item is created (`OrderItemService.createOrderItem`), `ProductSizeService.deductStock()` decrements `ProductSize.quantity` and recalculates `Product.totalQuantity`. Validates `requested <= available`, throws `RuntimeException("Insufficient stock for size: " + size)` if not.

3. **Batch → Order (direct):** If an order item uses a `batchId` directly (not a `productId`), `WarehouseBatchSizeService.deductStock()` decrements the `WarehouseBatchSizeEntity.quantity` directly.

4. **Custom-made:** No stock deducted (no `productId` or `batchId` in the DTO).

### 3b. Order Number Generation

`OrderService.createOrder()` generates: `"ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4)`. Example: `ORD-1716123456789-3f2a`.

### 3c. Snapshot Copy (OrderItem)

For ready-made items, `OrderItemService` copies `type`, `variant`, `color`, and `unitPrice` from the product/batch entity at order time — NOT from the frontend DTO. The mapper ignores these fields (`@Mapping(target = "type", ignore = true)`). This protects order history from future inventory changes.

### 3d. Financial Calculations

- `totalAmount` = sum of all `OrderItem.totalPrice` = sum of `(unitPrice * quantity)` per item.
- `paidAmount` comes from the frontend DTO; validated to not exceed `totalAmount`.
- `balance` = `totalAmount - paidAmount`.
- `fullyPaid` = `balance == 0`.
- All are `BigDecimal`.

### 3e. Order Status Derivation

If any item is `customMade = true`, the order status is set to `IN_PRODUCTION`. Otherwise, it starts as `PENDING`.

### 3f. hasMeasurements Derivation

Derived from items: `true` if ANY item has `measurementsTaken = true`.

### 3g. Registration Always Creates USER Role

`AuthService.register()` explicitly sets `user.setUserRole(UserRole.USER)` after mapping, regardless of what the frontend sends. Only admins can promote users via `update-user-role`.

## 4. Exception Handling

Two custom exceptions in `exception/exceptions/`:
- `NotFoundException` (RuntimeException) → `GlobalExceptionHandler` → HTTP 404 with `ErrorResponse { timestamp, errorMessage, errorDetails, errorCode }`
- `DuplicateException` (RuntimeException) → HTTP 409 CONFLICT
- Validation errors (`MethodArgumentNotValidException`) → HTTP 400 (Spring default, not customized)

Services should throw `NotFoundException` / `DuplicateException`. Never let raw `EntityNotFoundException` or `DataIntegrityViolationException` leak to the wire.

## 5. Security Pattern

- `SecurityConfig` declares a `SecurityFilterChain` bean: stateless, CSRF disabled, BCrypt, `DaoAuthenticationProvider` with `CustomUserDetailsService`.
- `/api/monishaInventory/auth/**` → `permitAll()`. Everything else → `authenticated()`.
- `@EnableMethodSecurity` is enabled but `@PreAuthorize` annotations are NOT used on any controller methods yet.
- `AuthFilter` (OncePerRequestFilter) registered before `UsernamePasswordAuthenticationFilter`:
  1. Skips `/auth/` paths.
  2. Reads `Authorization: Bearer <token>`.
  3. Calls `JWTUtils.getUsernameFromToken()` and `isTokenValid()`.
  4. Loads user via `CustomUserDetailsService.loadUserByUsername(email)`.
  5. Sets `UsernamePasswordAuthenticationToken` in `SecurityContextHolder`.
- `AuthUser` wraps `UserEntity` and implements `UserDetails`. Returns `ROLE_ADMIN` / `ROLE_MANAGER` / `ROLE_USER` as `SimpleGrantedAuthority`.
- `SecurityUtils` provides static helpers: `getCurrentUser()`, `getCurrentUserEmail()`, `getCurrentUserRole()`.
- JWT: `jjwt` 0.12.x API (`Jwts.builder()`, `Jwts.parser().verifyWith(key)`). 90-day expiration. HmacSHA256. Secret from `SecretJwtString` property.
- `DataSeeder` implements `CommandLineRunner`: creates admin `tinashegomo96@gmail.com` / `Tinashe@123` on first boot if no `ADMIN` exists.

## 6. Frontend Patterns

### 6a. Page + Form Separation

- **`pages/<module>/<Page>.jsx`** — thin shell: owns the mutation hook, `onSuccess`/`onError` side-effects (save token, navigate), page-level error banner, renders a single form component.
- **`components/<module>/<Page>Form.jsx`** — presentational: owns `useForm` + `yupResolver(<schema>)` + form markup. Receives `handle<Action>` + `isPending` as props.
- Currently applied to `Login` + `Register`. Future pages should follow this pattern.

### 6b. Form Validation (Yup + react-hook-form)

- Schemas in `src/yupSchema/<backend-dto-module>/<DtoName>.js`.
- Each file exports two named bindings: `<dtoNameCamel>Schema` and `<dtoNameCamel>DefaultValues`.
- Field names in the schema match the backend DTO field names **exactly** (e.g. `userName`, `userEmail`).
- Validation rules mirror Jakarta validation annotations (`@NotBlank` → `.required()`, `@Email` → `.email()`, `@Size(min=8)` → `.min(8)`).

### 6c. Data Fetching (TanStack Query)

- **One** axios instance in `api/InventoryAPI.js`: baseURL `http://localhost:8080/api/monishaInventory`, request interceptor adds `Authorization: Bearer <token>`, checks local token expiry via `isTokenExpired()`.
- **One** `hooks/InventoryHooks.js` exporting hooks per endpoint:
  - Query pattern: `useGetAll<X>` — `useQuery({ queryKey: ["x"], queryFn: () => ... })`
  - Mutation pattern: `useCreate<X>` — `useMutation({ mutationFn: ..., onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["x"] }) } })`
- Axios interceptor does NOT have a 401 response handler yet.

### 6d. Auth State

- `tokenUtils.js`: `getStoredToken()`, `saveToken(token)`, `removeToken()`, `isTokenExpired(token)` (checks `exp` claim via `atob` decode — no signature verification, that's the backend's job).
- `ProtectedRoute.jsx`: reads token from localStorage; if missing or expired → `<Navigate to="/login" replace />`.

### 6e. Routing

- `App.jsx` defines all routes. Public: `/login`, `/register`. Protected under `/` with `MainLayout` + `ProtectedRoute`: `/` (Dashboard), `/warehouse`, `/products`, `/schools`, `/orders`, `/tailoring`, `/settings`, `/profile`.

### 6f. Styling (Tailwind 4)

- Config in `index.css` `@theme` block (no `tailwind.config.js`).
- Brand red primary scale + full neutral scale + status colors.
- Semantic CSS custom properties on `:root` (light) and `.dark` (dark mode).
- `@theme inline` block exposes semantic tokens as Tailwind utilities.
- Inter font, custom heading/body/text UI sizes with letter-spacing.
- Glassmorphism, custom scrollbars.
- Known issue: Sidebar uses `bg-brand-600`, `text-brand-300`, `shadow-brand-500/20` — these are the OLD purple brand token names that may not exist in the current red-based `@theme`. Check and migrate to `primary-*` tokens.

## 7. Controller URL Convention

All controllers use `@RequestMapping("/api/monishaInventory/<module>")` at the class level and verb-suffixed paths on individual methods:
- `POST /<module>/create-<entity>` — create
- `GET /<module>/get-all-<entities>` — list all
- `GET /<module>/get-<entity>-byId/{id}` — get by ID
- `PUT /<module>/update-<entity>/{id}` — update
- `DELETE /<module>/delete-<entity>/{id}` — delete

Exceptions: Auth uses `/auth/register`, `/auth/login` (no verb suffix). Order status uses `PATCH /order/update-order-status/{orderId}`. Order by-status uses `GET /order/get-order-byStatus/{status}`.

## 8. Key Observations from Code

- **School API paths in frontend are wrong:** `InventoryAPI.js` schools endpoints use `/create-school`, `/get-all-schools` etc. without the `/school` prefix. The backend expects `/school/create-school`. This will cause 404 errors.
- **Sidebar uses semantic tokens:** `bg-brand-primary`, `text-brand-primary`, `bg-brand-subtle`, `bg-brand-tint` — all properly defined in `index.css` `@theme inline` block.
- **Login page navigates to "/dashboard":** `Login.jsx:17` calls `navigate("/dashboard")` but `App.jsx` only has `path="/"` for the Dashboard. This navigation will go to an undefined route.
- **No update endpoints for warehouse batches or products** — only create + delete.
- **No delete endpoint for orders** — `OrderController` has no delete method (though `OrderService` does not have one either).
- **No `@Transactional` on some service methods** that modify data (e.g., `UserService.updateUserRole`, `CustomerService.updateCustomer`).
- **MeasurementRequestDTO** has no validation annotations.
- **Return types differ:** `SchoolController.deleteSchool` and `WarehouseController.deleteWarehouseBatch` and `ProductController.deleteProduct` return `void` (HTTP 200), while `CustomerController.deleteCustomer` and `UserController.deleteUser` return `ResponseEntity<Void>` (HTTP 204). Inconsistent.

## 9. Things to NOT Do

- Do not return entities from controllers. Always map to DTO.
- Do not store JWT in `sessionStorage` (localStorage is the pattern).
- Do not skip `WarehouseBatchSize` / `ProductSize` validation when creating an order.
- Do not name the orders table `order` (use `orders` to avoid MySQL reserved keyword).
- Do not put business logic in controllers.
- Do not add Redux/Zustand — TanStack Query + localStorage is the intended pattern.
- Do not use `@RequestMapping` on individual methods if the class already has it.
- Do NOT modify the user's manually-authored `Register.jsx` or `RegisterForm.jsx`.
